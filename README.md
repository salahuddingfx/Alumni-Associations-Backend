# Practon Alumni Association Platform — Backend API

This is the Express API server powering the Alumni management system.

## Features
- Fully bilingual schema definitions
- JWT authentication with access/refresh cookie system
- Role authorization (Super Admin, Admin, Moderator)
- Sockets for real-time announcements
- node-cache layer
- express-rate-limit and Helmet security

## Setup and Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env` file and customize database / keys:
   ```bash
   cp .env.example .env
   ```

3. Run in development mode:
   ```bash
   npm run dev
   ```
