# Muhammad Zubair | Portfolio

A MERN portfolio starter with a React/Vite public site, an Express API, MongoDB persistence, and a private admin workspace.

## Run locally

Requirements: Node.js 20+ and a MongoDB database (local or Atlas).

1. Copy `server/.env.example` to `server/.env`.
2. Set `MONGODB_URI`, a unique `ADMIN_EMAIL`, an `ADMIN_PASSWORD` of at least 12 characters, and a random `JWT_SECRET` of at least 32 characters.
3. From the project root, run `npm install` and then `npm run dev`.
4. Open the Vite URL shown in the terminal. The admin panel is at `/admin`.

The API listens on port 5000 and the Vite server proxies `/api` requests to it. Without a MongoDB connection, the public site shows editable starter content; sign-in and saving changes remain unavailable. On the first successful database connection, the API inserts the starter profile and projects and creates the admin account from the environment variables. Existing admin passwords are never overwritten on restart.

There is no public or local admin preview/sign-up bypass. All admin changes require a valid server session.

## Admin workspace

Sign in with the configured admin email and password. From the panel you can add, edit, feature, and remove projects, set each project's client/company, description, role, challenge, approach, outcome, technologies, live URL, source URL, and preview image, and edit your profile, availability, contact links, focus areas, social links, and customer testimonials with their approved ratings. Only testimonials entered in the admin panel are published; no customer quotes or ratings are prefilled. Project images can be uploaded from the device as JPEG, PNG, or WebP up to 4 MB; uploaded files use random names and require an authenticated admin session. On Vercel, uploads are stored in Vercel Blob; locally, they are stored under `server/uploads/projects/`. Each public project card opens a shareable `/projects/<slug>` case study with a separate link to the live website. Project preview screenshots are bundled locally in `client/public/projects/`.

The public site presents the technology stack with interactive logos, a Formspree contact form, a persistent light/dark theme switch, and spring-based cursor, magnetic button, and scroll-progress interactions, plus scroll reveals. The custom cursor and motion effects respect touch devices and the operating system's reduced-motion preference.

## Production

### Deploy to Vercel

Import the repository into Vercel with the repository root as the project root. `vercel.json` builds the Vite client into `client/dist`, routes `/api/*` to the Express function in `api/express.js`, and sends `/admin` and `/projects/*` paths to the client app. Vercel provides HTTPS for deployed domains.

Add these server-side environment variables in the Vercel project settings for Production (and Preview if needed): `MONGODB_URI`, `JWT_SECRET` (at least 32 characters), `ADMIN_EMAIL`, and `ADMIN_PASSWORD` (at least 12 characters). The API initializes the MongoDB connection lazily and seeds starter data/admin once per warm function when the database is empty. Existing admin passwords are not overwritten.

For persistent admin image uploads, create a **public** Vercel Blob store and add its `BLOB_READ_WRITE_TOKEN` to the same Vercel environments. The serverless function intentionally returns a configuration error for uploads if this token is missing; it does not store uploads on Vercel's temporary filesystem. Keep database and admin credentials private, and restrict MongoDB network access as appropriate.

### Deploy elsewhere

Build the client with `npm run build`, set `NODE_ENV=production`, and run `npm start` with the server environment configured. The Express server serves the built client, API, and locally uploaded images from one origin, uses secure cookies in production, and applies a content security policy. Use persistent storage and backups for `server/uploads/projects/`, or configure an object-storage service for uploads.

## Security notes

The app uses Helmet security headers, an HTTP-only `SameSite=Strict` admin cookie, short-lived signed sessions, bcrypt password hashes, login rate limiting, request-size limits, schema/input validation, no public registration, and admin-only image uploads. Keep `.env` private, use a unique strong admin password and signing secret, keep dependencies updated, and configure HTTPS and MongoDB access controls before launch. No application can be promised 100% secure; production security also depends on deployment, secrets, infrastructure, and ongoing maintenance.