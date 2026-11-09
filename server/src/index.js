import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import express from 'express';
import mongoose from 'mongoose';
import { put } from '@vercel/blob';
import multer from 'multer';
import { fileTypeFromBuffer } from 'file-type';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { rateLimit } from 'express-rate-limit';
import { body, param, validationResult } from 'express-validator';
import { Admin, PortfolioSettings, Project } from './models.js';
import { defaultProjects, defaultSettings } from './defaults.js';

const app = express();
const port = Number(process.env.PORT) || 5000;
const isProduction = process.env.NODE_ENV === 'production';
const cookieName = 'portfolio_admin';
const allowedSettings = ['name', 'role', 'intro', 'about', 'location', 'availability', 'email', 'linkedin', 'whatsapp', 'focus', 'socialLinks', 'testimonials'];
const projectUploadsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../uploads/projects');
const imageUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 4 * 1024 * 1024, files: 1, fields: 0 } });

app.disable('x-powered-by');
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      frameAncestors: ["'none'"],
      formAction: ["'self'", 'https://formspree.io'],
    },
  },
}));
app.use(express.json({ limit: '30kb' }));
app.use(cookieParser());

let databaseInitialization;

async function initializeDatabase() {
  if (!process.env.MONGODB_URI) return;
  if (mongoose.connection.readyState === 1 && databaseInitialization) return databaseInitialization;
  if (!databaseInitialization) {
    databaseInitialization = (async () => {
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
      }

      await PortfolioSettings.updateOne(
        { key: 'main' },
        { $setOnInsert: { key: 'main', ...defaultSettings } },
        { upsert: true },
      );
      await PortfolioSettings.updateOne(
        { key: 'main', email: 'muhammadsabahatzubair@gmail.com' },
        { $set: { email: defaultSettings.email } },
      );
      await PortfolioSettings.collection.updateOne({ key: 'main' }, { $unset: { logoUrl: '', skills: '' } });
      const oldPlaceholderTitles = ['Your next big idea', 'A better way to work', 'Made for what is next'];
      const existingProjects = await Project.find({}, 'title').lean();
      if (existingProjects.length === 0) {
        await Project.insertMany(defaultProjects);
      } else if (existingProjects.every((project) => oldPlaceholderTitles.includes(project.title))) {
        await Project.deleteMany({ title: { $in: oldPlaceholderTitles } });
        await Project.insertMany(defaultProjects);
      }
      if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
        const email = process.env.ADMIN_EMAIL.trim().toLowerCase();
        if (process.env.ADMIN_PASSWORD.length < 12) {
          console.error('ADMIN_PASSWORD must be at least 12 characters; admin account was not initialized.');
        } else if (!await Admin.exists({ email })) {
          await Admin.create({ email, passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD, 12) });
          console.log(`Initialized admin account for ${email}`);
        }
      }
    })().catch((error) => {
      databaseInitialization = undefined;
      throw error;
    });
  }
  await databaseInitialization;
}

app.use((req, res, next) => {
  initializeDatabase()
    .catch((error) => console.error(`MongoDB connection failed: ${error.message}`))
    .then(() => next());
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many sign-in attempts. Try again in 15 minutes.' },
});
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 12,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many image uploads. Try again later.' },
});

function sendValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: 'Please check the submitted fields.', errors: errors.array() });
  next();
}

const asyncHandler = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);

function isSafeImageUrl(value) {
  if (/^\/(?:projects|uploads\/projects)\/[a-z0-9._/-]+$/i.test(value)) return true;
  try { return ['http:', 'https:'].includes(new URL(value).protocol); } catch { return false; }
}

function adminAuth(req, res, next) {
  const secret = process.env.JWT_SECRET;
  const token = req.cookies[cookieName];
  if (!secret || secret.length < 32 || !token) return res.status(401).json({ message: 'Please sign in to continue.' });
  try {
    req.admin = jwt.verify(token, secret, { algorithms: ['HS256'] });
    next();
  } catch {
    res.clearCookie(cookieName, { httpOnly: true, sameSite: 'strict', secure: isProduction, path: '/api' });
    return res.status(401).json({ message: 'Your session has expired. Please sign in again.' });
  }
}

function normalizeProject(input) {
  return {
    title: input.title,
    client: input.client || '',
    category: input.category || 'WEB DEVELOPMENT',
    description: input.description,
    role: input.role || '',
    challenge: input.challenge || '',
    approach: input.approach || '',
    outcome: input.outcome || '',
    technologies: Array.isArray(input.technologies) ? input.technologies.map((item) => item.trim()).filter(Boolean).slice(0, 12) : [],
    liveUrl: input.liveUrl || '',
    sourceUrl: input.sourceUrl || '',
    imageUrl: input.imageUrl || '',
    year: input.year || String(new Date().getFullYear()),
    featured: Boolean(input.featured),
    sortOrder: Number(input.sortOrder) || 0,
  };
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, database: mongoose.connection.readyState === 1 ? 'connected' : 'offline' });
});

app.get('/api/portfolio', asyncHandler(async (_req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json({ settings: defaultSettings, projects: defaultProjects, database: 'offline' });
  }
  try {
    const [savedSettings, savedProjects] = await Promise.all([
      PortfolioSettings.findOne({ key: 'main' }).lean(),
      Project.find().sort({ sortOrder: 1, createdAt: -1 }).lean(),
    ]);
    const settings = savedSettings
      ? { ...savedSettings, testimonials: Array.isArray(savedSettings.testimonials) ? savedSettings.testimonials : [] }
      : defaultSettings;
    res.json({ settings, projects: savedProjects, database: 'connected' });
  } catch {
    res.status(503).json({ message: 'Portfolio data is temporarily unavailable.' });
  }
}));

app.post('/api/admin/login', loginLimiter, [
  body('email').isEmail().normalizeEmail().withMessage('Enter a valid email address.'),
  body('password').isString().isLength({ min: 1, max: 200 }),
], sendValidationErrors, asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) return res.status(503).json({ message: 'Admin sign-in is unavailable until MongoDB is connected.' });
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) return res.status(503).json({ message: 'Admin sign-in is not configured. Set JWT_SECRET to at least 32 characters in the server environment.' });
  const admin = await Admin.findOne({ email: req.body.email }).lean();
  const passwordMatches = admin && await bcrypt.compare(req.body.password, admin.passwordHash);
  if (!passwordMatches) return res.status(401).json({ message: 'Email or password is incorrect.' });
  const token = jwt.sign({ sub: admin._id.toString(), email: admin.email }, process.env.JWT_SECRET, { algorithm: 'HS256', expiresIn: '2h' });
  res.cookie(cookieName, token, { httpOnly: true, sameSite: 'strict', secure: isProduction, maxAge: 2 * 60 * 60 * 1000, path: '/api' });
  res.json({ email: admin.email });
}));

app.get('/api/admin/session', (req, res) => {
  const token = req.cookies[cookieName];
  const secret = process.env.JWT_SECRET;
  if (!token || !secret || secret.length < 32) return res.json({ authenticated: false });
  try {
    const session = jwt.verify(token, secret, { algorithms: ['HS256'] });
    return res.json({ authenticated: true, email: session.email });
  } catch {
    res.clearCookie(cookieName, { httpOnly: true, sameSite: 'strict', secure: isProduction, path: '/api' });
    return res.json({ authenticated: false });
  }
});

app.post('/api/admin/logout', (_req, res) => {
  res.clearCookie(cookieName, { httpOnly: true, sameSite: 'strict', secure: isProduction, path: '/api' });
  res.status(204).end();
});

app.post('/api/admin/uploads/project-image', adminAuth, uploadLimiter, imageUpload.single('image'), asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Choose an image to upload.' });
  const detectedType = await fileTypeFromBuffer(req.file.buffer);
  const extensions = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
  const extension = detectedType && extensions[detectedType.mime];
  if (!extension) return res.status(415).json({ message: 'Use a JPEG, PNG, or WebP image.' });
  const filename = `${randomUUID()}.${extension}`;
  if (process.env.VERCEL) {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return res.status(503).json({ message: 'Image uploads are not configured. Add BLOB_READ_WRITE_TOKEN to the server environment.' });
    }
    const blob = await put(filename, req.file.buffer, {
      access: 'public',
      addRandomSuffix: false,
      contentType: detectedType.mime,
    });
    return res.status(201).json({ imageUrl: blob.url });
  }
  await mkdir(projectUploadsDir, { recursive: true });
  await writeFile(path.join(projectUploadsDir, filename), req.file.buffer, { flag: 'wx' });
  res.status(201).json({ imageUrl: `/uploads/projects/${filename}` });
}));

app.put('/api/admin/settings', adminAuth, [
  body('name').optional().isString().trim().isLength({ min: 1, max: 80 }),
  body('role').optional().isString().trim().isLength({ min: 1, max: 100 }),
  body('intro').optional().isString().trim().isLength({ min: 1, max: 320 }),
  body('about').optional().isString().trim().isLength({ min: 1, max: 1200 }),
  body('location').optional().isString().trim().isLength({ max: 100 }),
  body('availability').optional().isString().trim().isLength({ max: 100 }),
  body('email').optional().isEmail().normalizeEmail(),
  body('linkedin').optional({ values: 'falsy' }).isURL({ protocols: ['https'], require_protocol: true }).isLength({ max: 300 }),
  body('whatsapp').optional().isString().trim().matches(/^[+0-9 ()-]{7,40}$/),
  body('focus').optional().isArray({ max: 8 }),
  body('focus.*').optional().isString().trim().isLength({ min: 1, max: 40 }),
  body('socialLinks').optional().isArray({ max: 12 }),
  body('socialLinks.*.label').optional().isString().trim().isLength({ min: 1, max: 40 }),
  body('socialLinks.*.url').optional().isURL({ protocols: ['https', 'http'], require_protocol: true }).isLength({ max: 300 }),
  body('testimonials').optional().isArray({ max: 12 }),
  body('testimonials.*.name').isString().trim().isLength({ min: 1, max: 100 }),
  body('testimonials.*.company').isString().trim().isLength({ min: 1, max: 100 }),
  body('testimonials.*.quote').isString().trim().isLength({ min: 1, max: 600 }),
  body('testimonials.*.rating').isFloat({ min: 1, max: 5 }).custom((value) => Number.isInteger(Number(value) * 10)).withMessage('Use a rating from 1 to 5 in 0.1 increments.'),
], sendValidationErrors, asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) return res.status(503).json({ message: 'MongoDB is not connected.' });
  const update = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowedSettings.includes(key)));
  const current = await PortfolioSettings.findOne({ key: 'main' }).lean();
  const currentFields = Object.fromEntries(allowedSettings.filter((key) => current?.[key] !== undefined).map((key) => [key, current[key]]));
  const saved = await PortfolioSettings.findOneAndUpdate({ key: 'main' }, { $set: { ...defaultSettings, ...currentFields, ...update } }, { upsert: true, new: true, runValidators: true }).lean();
  res.json(saved);
}));

app.post('/api/admin/projects', adminAuth, [
  body('title').isString().trim().isLength({ min: 1, max: 100 }),
  body('client').optional().isString().trim().isLength({ max: 100 }),
  body('description').isString().trim().isLength({ min: 1, max: 1000 }),
  body('role').optional().isString().trim().isLength({ max: 90 }),
  body('challenge').optional().isString().trim().isLength({ max: 1000 }),
  body('approach').optional().isString().trim().isLength({ max: 1000 }),
  body('outcome').optional().isString().trim().isLength({ max: 600 }),
  body('category').optional().isString().trim().isLength({ max: 50 }),
  body('technologies').optional().isArray({ max: 12 }),
  body('technologies.*').optional().isString().trim().isLength({ min: 1, max: 40 }),
  body('liveUrl').optional({ values: 'falsy' }).isURL({ protocols: ['http', 'https'], require_protocol: true }).isLength({ max: 500 }),
  body('sourceUrl').optional({ values: 'falsy' }).isURL({ protocols: ['http', 'https'], require_protocol: true }).isLength({ max: 500 }),
  body('imageUrl').optional({ values: 'falsy' }).custom(isSafeImageUrl).isLength({ max: 1000 }),
  body('year').optional().isString().trim().isLength({ max: 4 }),
  body('featured').optional().isBoolean(),
  body('sortOrder').optional().isInt({ min: 0, max: 10000 }),
], sendValidationErrors, asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) return res.status(503).json({ message: 'MongoDB is not connected.' });
  const project = await Project.create(normalizeProject(req.body));
  res.status(201).json(project);
}));

app.put('/api/admin/projects/:id', adminAuth, [
  param('id').isMongoId(),
  body('title').optional().isString().trim().isLength({ min: 1, max: 100 }),
  body('client').optional().isString().trim().isLength({ max: 100 }),
  body('description').optional().isString().trim().isLength({ min: 1, max: 1000 }),
  body('role').optional().isString().trim().isLength({ max: 90 }),
  body('challenge').optional().isString().trim().isLength({ max: 1000 }),
  body('approach').optional().isString().trim().isLength({ max: 1000 }),
  body('outcome').optional().isString().trim().isLength({ max: 600 }),
  body('category').optional().isString().trim().isLength({ max: 50 }),
  body('technologies').optional().isArray({ max: 12 }),
  body('technologies.*').optional().isString().trim().isLength({ min: 1, max: 40 }),
  body('liveUrl').optional({ values: 'falsy' }).isURL({ protocols: ['http', 'https'], require_protocol: true }).isLength({ max: 500 }),
  body('sourceUrl').optional({ values: 'falsy' }).isURL({ protocols: ['http', 'https'], require_protocol: true }).isLength({ max: 500 }),
  body('imageUrl').optional({ values: 'falsy' }).custom(isSafeImageUrl).isLength({ max: 1000 }),
  body('year').optional().isString().trim().isLength({ max: 4 }),
  body('featured').optional().isBoolean(),
  body('sortOrder').optional().isInt({ min: 0, max: 10000 }),
], sendValidationErrors, asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) return res.status(503).json({ message: 'MongoDB is not connected.' });
  const current = await Project.findById(req.params.id);
  if (!current) return res.status(404).json({ message: 'Project not found.' });
  const update = normalizeProject({ ...current.toObject(), ...req.body });
  const project = await Project.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
  res.json(project);
}));

app.delete('/api/admin/projects/:id', adminAuth, [param('id').isMongoId()], sendValidationErrors, asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) return res.status(503).json({ message: 'MongoDB is not connected.' });
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) return res.status(404).json({ message: 'Project not found.' });
  res.status(204).end();
}));

const clientDist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../client/dist');
app.use('/uploads/projects', express.static(projectUploadsDir, { dotfiles: 'deny', index: false, immutable: true, maxAge: '1d' }));
if (isProduction && !process.env.VERCEL && existsSync(clientDist)) {
  app.use(express.static(clientDist, { index: false }));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(clientDist, 'index.html'), (error) => { if (error) next(error); });
  });
}

app.use((error, _req, res, _next) => {
  if (error instanceof multer.MulterError) {
    const status = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    return res.status(status).json({ message: status === 413 ? 'Image must be 4 MB or smaller.' : 'Invalid image upload.' });
  }
  console.error(error);
  res.status(500).json({ message: 'Something went wrong. Please try again.' });
});

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  app.listen(port, () => console.log(`Portfolio API listening on http://localhost:${port}`));
  if (!process.env.MONGODB_URI) {
    console.warn('MONGODB_URI is not set; public pages use starter content and admin features are unavailable.');
  }
}

export default app;