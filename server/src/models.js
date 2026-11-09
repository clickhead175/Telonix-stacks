import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  key: { type: String, unique: true, default: 'main' },
  name: { type: String, required: true, maxlength: 80 },
  role: { type: String, required: true, maxlength: 100 },
  intro: { type: String, required: true, maxlength: 320 },
  about: { type: String, required: true, maxlength: 1200 },
  location: { type: String, maxlength: 100 },
  availability: { type: String, maxlength: 100 },
  email: { type: String, required: true, maxlength: 120 },
  linkedin: { type: String, maxlength: 300 },
  whatsapp: { type: String, maxlength: 40 },
  focus: { type: [String], default: [] },
  socialLinks: [{
    label: { type: String, required: true, trim: true, maxlength: 40 },
    url: { type: String, required: true, trim: true, maxlength: 300 },
  }],
  testimonials: [{
    name: { type: String, required: true, trim: true, maxlength: 100 },
    company: { type: String, required: true, trim: true, maxlength: 100 },
    quote: { type: String, required: true, trim: true, maxlength: 600 },
    rating: { type: Number, required: true, min: 1, max: 5 },
  }],
}, { timestamps: true, versionKey: false });

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 100 },
  client: { type: String, trim: true, maxlength: 100, default: '' },
  category: { type: String, trim: true, maxlength: 50, default: 'WEB DEVELOPMENT' },
  description: { type: String, required: true, trim: true, maxlength: 1000 },
  role: { type: String, trim: true, maxlength: 90, default: '' },
  challenge: { type: String, trim: true, maxlength: 1000, default: '' },
  approach: { type: String, trim: true, maxlength: 1000, default: '' },
  outcome: { type: String, trim: true, maxlength: 600, default: '' },
  technologies: { type: [String], default: [] },
  liveUrl: { type: String, trim: true, maxlength: 500, default: '' },
  sourceUrl: { type: String, trim: true, maxlength: 500, default: '' },
  imageUrl: { type: String, trim: true, maxlength: 1000, default: '' },
  year: { type: String, trim: true, maxlength: 4, default: '2026' },
  featured: { type: Boolean, default: false },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true, versionKey: false });

const adminSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
}, { timestamps: true, versionKey: false });

export const PortfolioSettings = mongoose.model('PortfolioSettings', settingsSchema);
export const Project = mongoose.model('Project', projectSchema);
export const Admin = mongoose.model('Admin', adminSchema);