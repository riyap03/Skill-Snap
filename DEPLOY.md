# SkillSnap Deploy Checklist

## Backend on Render

Create a Render **Web Service** from this repo.

- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`
- Health Check Path: `/api/health`

Environment variables:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
PORT=5000
GOOGLE_CLIENT_ID=your_google_oauth_web_client_id
CLIENT_URL=http://localhost:5173,https://skill-snap-three.vercel.app
```

If your frontend domain changes later, update `CLIENT_URL` and redeploy the backend.

## Frontend on Render

Create a Render **Static Site** from this repo.

- Root Directory: `Skill-Snap`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`

Environment variables:

```env
VITE_API_URL=https://skill-snap-jnih.onrender.com
VITE_GOOGLE_CLIENT_ID=your_google_oauth_web_client_id
```

Add a static site rewrite for React Router:

- Source: `/*`
- Destination: `/index.html`
- Action: `Rewrite`

## Google OAuth

In Google Cloud Console, your OAuth Web Client needs these origins:

```txt
http://localhost:5173
https://skill-snap-three.vercel.app
```

Use the same OAuth Client ID for:

- `GOOGLE_CLIENT_ID` in backend Render env vars
- `VITE_GOOGLE_CLIENT_ID` in frontend Render env vars

## Common Fixes

- If frontend still calls localhost, update `VITE_API_URL` in the Render Static Site env vars and redeploy the frontend.
- If auth requests are blocked by CORS, add the frontend URL to backend `CLIENT_URL` and redeploy the backend.
- If login/register returns `400`, check DevTools > Network > failed request > Response for the backend message.
