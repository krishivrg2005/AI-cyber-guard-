# Vercel deployment for AI CyberGuard

This project has been prepared for Vercel without changing the existing dashboard/API behavior.

## What was changed

- Added `server.ts` at the repository root so Vercel can run the existing Express API and WebSocket hub as one Node server.
- Added `vercel.json` to install the pnpm workspace and build the React/Vite frontend before the server starts.
- The built frontend is copied to `public/` and served by the existing Node server.
- Added Vercel deployment/production origins to the existing WebSocket origin allowlist.
- Added Node/pnpm metadata to the root `package.json`.

## Deploy

1. Extract this project.
2. Push the project to GitHub.
3. In Vercel, choose **Add New Project** and import the GitHub repository.
4. Keep the repository root as the Vercel Root Directory.
5. Deploy.

Vercel should use the existing `vercel.json` settings automatically.

## Environment variables

For protected dashboard operations, add:

`WORKSPACE_TOKEN=some-long-random-secret`

If you want the frontend to send the same token for destructive operations, add:

`VITE_WORKSPACE_TOKEN=the-same-value`

For real persistent production storage, add a PostgreSQL connection string:

`DATABASE_URL=postgresql://...`

Without `DATABASE_URL`, the application keeps its existing local JSON fallback behavior. On Vercel, local filesystem writes are not a reliable permanent database, so PostgreSQL is recommended for persistence.

## ML engine

The Node API already contains fallback heuristic analysis when the separate Python ML service is unavailable. Therefore the Vercel deployment remains functional without a separate Python server.

If you later deploy the Python ML engine separately, set:

`ML_ENGINE_URL=https://your-ml-service.example.com`

No frontend code changes are required.

## Local run after these changes

Build the frontend:

`pnpm --filter @workspace/ai-cyberguard build`

Copy the frontend:

`rm -rf public && cp -R artifacts/ai-cyberguard/dist/public public`

Run the server:

`node --import tsx server.ts`

