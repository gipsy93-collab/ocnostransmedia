<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/a05130fd-c14f-4e08-843e-99b084cb07d1

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env](.env) to your Gemini API key
   (optional: `GEMINI_API_KEY_FALLBACK` as a backup key)
3. Run the app:
   `npm run dev`

## Troubleshooting: "Your API key was reported as leaked"

The chat endpoint returns HTTP 403 `PERMISSION_DENIED` with that message when
Google has revoked the key. It is **not** a code bug and no code change can undo
it. Fix it by generating a new key at https://aistudio.google.com/app/apikey and
replacing the value in:

- `.env` (local development, used by `npm run dev:api`)
- Vercel → Project → Settings → Environment Variables → `GEMINI_API_KEY`
  (redeploy afterwards)

The server now hides the raw JSON from users and shows a generic message
instead, and it automatically falls back to `GEMINI_API_KEY_FALLBACK` when the
primary key is rejected. Check which keys are loaded with:

```
curl http://localhost:3001/api/health
```
