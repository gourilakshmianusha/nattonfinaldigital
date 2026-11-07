<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/1a4e8d9e-3f6a-49f5-903a-0ea72f4c0b85

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Production deployment

Deploy the frontend **and** API together for admin login, published content and live tools. See [the Netlify and Node/hPanel deployment guide](docs/admin/DEPLOYMENT.md) for environment settings and verification. Uploading only `dist` does not deploy the API.
