<<<<<<< HEAD
# F
=======
# Soom Raj Portfolio

MERN portfolio starter with a public work archive, hover-to-open project pages, and a private project manager.

## Run locally

Install dependencies once:

```bash
npm run install:all
```

Start the API in one terminal:

```bash
npm run dev:server
```

Start the React client in another terminal:

```bash
npm run dev:client
```

The client uses local storage for the first working prototype so the admin flow works immediately. The Express API is available at `http://localhost:5000/api` and is ready for MongoDB when `server/.env` is configured from `.env.example`.

## Owner login

- Login uses a one-time email code and a server-issued HTTP-only JWT cookie.
- Set `ADMIN_EMAIL` to the only email allowed to request a code.
- Configure SMTP values in `server/.env` before using `/admin/login`.

For Gmail, use a Google App Password as `SMTP_PASSWORD`; do not use your normal Gmail password. Project screenshots currently use local browser storage in development; Cloudinary upload wiring can be added for production.

## Project image storage

Project images are uploaded to Cloudinary through the authenticated server endpoint. MongoDB stores only the returned Cloudinary URLs. Add these variables to the backend `.env` and backend Vercel project:

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```
>>>>>>> ce7fbbd (initial portfolio application)
