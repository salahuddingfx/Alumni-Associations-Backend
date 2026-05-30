# 🔒 Security Policy

## Supported Versions

We actively maintain security patches for the following versions of the platform:

| Version | Supported |
|---|---|
| `main` branch (latest) | ✅ Yes |
| Tagged releases (past 6 months) | ✅ Yes |
| Older releases | ❌ No |

---

## 🛡️ Security Architecture

The Practon Alumni Association Platform implements multiple layers of security:

### Authentication & Authorization
- **JWT-based stateless auth** with short-lived access tokens (15 min) and rotating refresh tokens (7 days)
- **HttpOnly cookie** storage for refresh tokens — inaccessible to JavaScript
- **Role-based access control (RBAC)** with 5 levels: `superadmin` › `admin` › `moderator` › `member` › `user`
- **bcryptjs** password hashing with salt rounds = 12

### API Security
- **Helmet.js** — Sets security-critical HTTP headers (XSS Protection, HSTS, X-Frame-Options, CSP, etc.)
- **express-rate-limit** — 100 requests per 15 minutes per IP on auth endpoints; 50 req/15min on sensitive routes
- **CORS whitelist** — Only `CLIENT_URL` and `ADMIN_URL` are permitted origins
- **Zod schema validation** — All incoming request bodies are strictly validated
- **Input sanitization** — Malformed or unexpected fields are rejected before reaching the database

### Data Security
- **MongoDB Atlas** with IP whitelist restrictions and encrypted at-rest storage
- **Cloudinary** secure media delivery via signed URLs where applicable
- **Environment variable isolation** — All secrets stored in `.env`, never in source code
- **No sensitive data in logs** — Passwords and tokens are never logged

---

## 🐛 Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability in this project, please **do NOT create a public GitHub Issue**. Instead, follow responsible disclosure:

### 1. Email Us Privately
Send a detailed report to:

**📧 security@dpian.dev** (or `info.salahuddinkader@gmail.com`)

Please include:
- Description of the vulnerability
- Steps to reproduce (proof-of-concept if possible)
- Affected components, versions, or endpoints
- Potential impact assessment
- Your recommended mitigation (optional)

### 2. What to Expect
| Timeline | Action |
|---|---|
| Within **48 hours** | We will acknowledge receipt of your report |
| Within **7 days** | Initial assessment and severity classification |
| Within **30 days** | Security patch released (or timeline communicated) |
| After fix | Credit given in changelog (if desired) |

### 3. Responsible Disclosure
- Please **do not** exploit the vulnerability beyond what is necessary for the proof of concept
- Please **do not** disclose publicly until a fix has been released
- We will work with you collaboratively and give appropriate public credit after the fix

---

## 🔍 Known Security Considerations

### Admin Panel
- The admin dashboard URL is intentionally not linked from the public site
- Admin login attempts are rate-limited to prevent brute force attacks
- All admin actions are logged in the database audit log

### Environment Variables
- `.env` files must never be committed to version control (enforced by `.gitignore`)
- MongoDB credentials, JWT secrets, and SMTP passwords are rotated quarterly in production

### Email System
- Admin notification email address is resolved dynamically from the database, not hardcoded in environment variables
- SMTP credentials use app-specific passwords, not account passwords

---

## 📋 Security Checklist for Contributors

Before submitting a pull request, ensure:

- [ ] No secrets, API keys, or passwords are committed
- [ ] User inputs are validated with Zod schemas on the server
- [ ] New routes are protected with appropriate `protect` and `authorize` middleware
- [ ] File upload handlers validate MIME type and file size limits
- [ ] Error messages do not leak sensitive internal information
- [ ] New dependencies are reviewed for known CVEs (`npm audit`)

---

## 🏅 Hall of Fame

We thank the following security researchers for responsible disclosure:

_No reports yet — be the first!_

---

© 2026 Practon Alumni Association · প্রাক্তন শিক্ষার্থী পরিষদ
