<div align="center">

# ⚙️ Server — REST API Backend
### Alumni Associations Dpian · সার্ভার / API

[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org)
[![Express.js](https://img.shields.io/badge/Express.js-4-black)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://mongodb.com)
[![Socket.io](https://img.shields.io/badge/Socket.io-4-black)](https://socket.io)
[![JWT](https://img.shields.io/badge/JWT-Auth-red)](https://jwt.io)

> The Express.js backend powering all business logic, authentication, email delivery, media uploads, real-time events, and REST API endpoints for the Alumni Association platform.

</div>

---

## 📁 Project Structure

```
server/
├── config/
│   ├── db.js               # MongoDB Atlas connection (Mongoose)
│   └── cloudinary.js       # Cloudinary SDK configuration
├── controllers/
│   ├── auth.controller.js  # Register, login, logout, refresh token
│   ├── user.controller.js  # User CRUD, role management
│   ├── member.controller.js    # Member profiles, approvals
│   ├── event.controller.js     # Event CRUD + registration
│   ├── notice.controller.js    # Notice CRUD + socket broadcast
│   ├── blog.controller.js      # Blog/news CRUD
│   ├── committee.controller.js # Committee member management
│   ├── donation.controller.js  # Donation recording & reporting
│   ├── gallery.controller.js   # Gallery album management
│   ├── partner.controller.js   # Partners/sponsors management
│   ├── contact.controller.js   # Contact form handler + email
│   └── settings.controller.js  # CMS settings read/write
├── middleware/
│   ├── auth.middleware.js   # JWT verification, role checks
│   ├── upload.middleware.js # Multer + Cloudinary upload handler
│   └── rateLimit.js        # express-rate-limit configs
├── models/
│   ├── user.model.js       # User schema (auth, role, profile)
│   ├── member.model.js     # Alumni member profile schema
│   ├── event.model.js      # Event schema
│   ├── notice.model.js     # Notice schema
│   ├── blog.model.js       # Blog/news post schema
│   ├── committee.model.js  # Committee member schema
│   ├── donation.model.js   # Donation record schema
│   ├── gallery.model.js    # Gallery album & photos schema
│   ├── partner.model.js    # Partner/sponsor schema
│   └── settings.model.js  # CMS site settings schema
├── routes/
│   ├── auth.routes.js      # /api/v1/auth/*
│   ├── user.routes.js      # /api/v1/users/*
│   ├── member.routes.js    # /api/v1/members/*
│   ├── event.routes.js     # /api/v1/events/*
│   ├── notice.routes.js    # /api/v1/notices/*
│   ├── blog.routes.js      # /api/v1/blogs/*
│   ├── committee.routes.js # /api/v1/committee/*
│   ├── donation.routes.js  # /api/v1/donations/*
│   ├── gallery.routes.js   # /api/v1/gallery/*
│   ├── partner.routes.js   # /api/v1/partners/*
│   ├── contact.routes.js   # /api/v1/contact
│   └── settings.routes.js  # /api/v1/settings
├── services/
│   └── auth.service.js     # Token generation, validation helpers
├── utils/
│   └── email.js            # Nodemailer + Brevo SMTP email sender
├── seed/
│   ├── seed.js             # Seeds events, notices, settings, blogs, partners
│   └── seed_members.js     # Seeds sample member profiles
├── .env.example            # Environment variable template
├── server.js               # Main entry point — Express + Socket.io init
└── package.json
```

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174

# MongoDB
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/practon_alumni

# JWT
JWT_SECRET=your_strong_jwt_secret_here
JWT_REFRESH_SECRET=your_strong_refresh_secret_here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Brevo SMTP (Email)
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your_brevo_login@email.com
SMTP_PASS=your_brevo_smtp_password
SMTP_FROM_EMAIL=noreply@yourdomain.com
SMTP_FROM_NAME=Practon Alumni Association
```

> ⚠️ **Never commit `.env` to version control.** Use `.env.example` for documentation.

---

## 🚀 Development

```bash
npm install
npm run dev        # Start with nodemon (hot reload)
npm start          # Start without hot reload (production)
```

---

## 🔌 REST API Reference

All endpoints are prefixed with `/api/v1`.

### Authentication — `/auth`
| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Register new user account |
| `POST` | `/auth/login` | Public | Login → access + refresh tokens |
| `POST` | `/auth/logout` | Auth | Invalidate tokens |
| `POST` | `/auth/refresh` | Public | Refresh access token |
| `GET` | `/auth/me` | Auth | Get current logged-in user |

### Members — `/members`
| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/members` | Public | Paginated member listing |
| `GET` | `/members/:id` | Public | Single member detail |
| `POST` | `/members` | Auth | Submit member registration |
| `PATCH` | `/members/:id` | Admin | Approve / update member |
| `DELETE` | `/members/:id` | Admin | Delete member |

### Events — `/events`
| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/events` | Public | List all events |
| `GET` | `/events/:id` | Public | Single event detail |
| `POST` | `/events` | Admin | Create event |
| `PATCH` | `/events/:id` | Admin | Update event |
| `DELETE` | `/events/:id` | Admin | Delete event |
| `POST` | `/events/:id/register` | Auth | Register for an event |
| `GET` | `/events/:id/registrations` | Admin | Get event registrations |

### Notices — `/notices`
| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/notices` | Public | List all notices |
| `POST` | `/notices` | Admin | Create notice + socket broadcast |
| `PATCH` | `/notices/:id` | Admin | Update notice |
| `DELETE` | `/notices/:id` | Admin | Delete notice |

### Donations — `/donations`
| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/donations` | Admin | All donation records |
| `POST` | `/donations` | Auth | Submit donation |
| `PATCH` | `/donations/:id` | Admin | Verify / update status |

### Contact — `/contact`
| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/contact` | Public | Submit contact form (email to admin) |

### Settings — `/settings`
| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/settings` | Public | Fetch site-wide CMS settings |
| `PATCH` | `/settings` | Admin | Update settings |

---

## 🔐 Authorization Middleware

```javascript
// Usage in routes
router.post('/events', protect, authorize('admin', 'superadmin'), createEvent);
```

### Role Hierarchy
```
superadmin > admin > moderator > member > user
```

The `protect` middleware validates the JWT access token from:
1. `Authorization: Bearer <token>` header
2. `accessToken` HttpOnly cookie (fallback)

---

## 📧 Email System

Email delivery uses **Nodemailer** with **Brevo SMTP** transport.

The admin notification email address is **dynamically resolved** from the database `Settings` collection:

```javascript
// utils/email.js flow:
// 1. Fetch admin email from Settings model (DB)
// 2. Send via Brevo SMTP (Nodemailer)
// 3. Fallback: Brevo HTTP API if SMTP fails
```

Emails are sent for:
- Contact form submissions → admin notification + user confirmation
- Event registration → user digital ticket
- Member approval → confirmation email
- Donation receipt → confirmation email

---

## 🔴 Real-time — Socket.io

The server runs Socket.io alongside Express on the same HTTP server.

```javascript
// Clients join the 'alumni-notices' room
// When admin creates a notice, server emits:
io.emit('new-notice', noticeData);

// Admins are in a private room:
socket.join('admin-room');
io.to('admin-room').emit('new-registration', data);
```

---

## 🛡️ Security Features

- **Helmet.js** — HTTP security headers (XSS, HSTS, CSP, etc.)
- **express-rate-limit** — 100 req/15min per IP on auth endpoints
- **bcryptjs** — Password hashing with salt rounds = 12
- **CORS** — Restricted to `CLIENT_URL` and `ADMIN_URL` only
- **Zod validation** — Input validation on all POST/PATCH endpoints
- **HttpOnly cookies** — Refresh tokens stored in HttpOnly cookies
- **JWT expiry** — Short-lived 15 min access tokens

---

## 🧪 Database Seeding

```bash
node seed/seed.js         # Seeds: settings, events, notices, committee, blogs, partners
node seed/seed_members.js # Seeds: sample member profiles
```

> ⚠️ Only run seeds in development. Running in production will insert duplicate records.

---

## 📦 Key Dependencies

| Package | Version | Purpose |
|---|---|---|
| `express` | `^4.18` | Web framework |
| `mongoose` | `^8.x` | MongoDB ODM |
| `socket.io` | `^4.x` | Real-time WebSocket |
| `jsonwebtoken` | `^9.x` | JWT generation & verification |
| `bcryptjs` | `^2.x` | Password hashing |
| `nodemailer` | `^6.x` | Email sending |
| `cloudinary` | `^2.x` | Cloud image storage |
| `multer` | `^1.x` | File upload middleware |
| `helmet` | `^7.x` | HTTP security headers |
| `express-rate-limit` | `^7.x` | Rate limiting |
| `zod` | `^3.x` | Request schema validation |
| `cors` | `^2.x` | Cross-origin resource sharing |
| `dotenv` | `^16.x` | Environment variable loading |
| `nodemon` | `^3.x` | Dev hot-reload (devDependency) |

---

© 2026 Practon Alumni Association
