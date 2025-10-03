# Frontend Deployment

This app is built with Create React App and supports runtime configuration for the API base URL using `public/env.js`.

## Scripts

- `npm start`: Start dev server
- `npm run build`: Build for production

## Runtime configuration

At runtime, the app reads `window._env_.REACT_APP_API_URL` if present, then falls back to `process.env.REACT_APP_API_URL`. This allows you to swap API URLs without rebuilding.

1) Copy the template to `public/env.js` and set your URL:

```html
<script src="/env.js"></script>
```

```javascript
// public/env.js
window._env_ = {
  REACT_APP_API_URL: "https://your-backend.example.com/api",
};
```

2) In development, you can also create a `.env` file with:

```
REACT_APP_API_URL=http://localhost:5000/api
```

## Deploy on Render (Static Site)

1. Create a new Static Site on Render and connect this repo or a subdirectory (`frontend`).
2. Build command: `npm install && npm run build`
3. Publish directory: `build`
4. Add a static file at `build/env.js` at deploy time. You can do this via a pre-publish script or by committing `public/env.js` with the correct value.
5. Set custom headers or redirects as needed in Render settings.

Environment to set:
- `REACT_APP_API_URL` (optional if you supply `env.js`)

## Deploy on Vercel

1. Import project to Vercel (root or `frontend` as the project).
2. Framework preset: Create React App
3. Build command: `npm run build`
4. Output directory: `build`
5. Add Environment Variable `REACT_APP_API_URL` for each environment.
6. Optionally, add an `env.js` file as described above for runtime overrides.

After deployment, verify API calls by opening the browser console and ensuring requests go to your configured `REACT_APP_API_URL`.
