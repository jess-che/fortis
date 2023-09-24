## Introduction

Fortis. 

## How It Works

The Python/Flask server is mapped into to Next.js app under `/api/`.

This is implemented using [`next.config.js` rewrites](https://github.com/vercel/examples/blob/main/python/nextjs-flask/next.config.js) to map any request to `/api/:path*` to the Flask API, which is hosted in the `/api` folder.

On localhost, the rewrite will be made to the `127.0.0.1:5328` port, which is where the Flask server is running.

In production, the Flask server is hosted as [Python serverless functions](https://vercel.com/docs/concepts/functions/serverless-functions/runtimes/python) on Vercel.

*Benjamin, can you check this part on how postgre is connected to this when you have time*
Furthermore, postgreSQL is also hosted by Vercel and linked to this project.

## Getting Started

The initial framework is based on [Vercel's Next.js Flask Starter](https://vercel.com/templates/next.js/nextjs-flask-starter).

To get started, first, install the dependencies:
```bash

pnpm install
```

To set up postgre, first connect postgre to storage in your Vercel dashboard.
Install the Vercel Postgres package:
```bash

pnpm i @vercel/postgres
```
And the latest version of Vercel CLI:
```bash

pnpm install
pnpm i -g vercel@latest
```

To pull link the postgre to project run:
```bash

vercel link
```
To pull latest latest environment variables:
```bash

vercel env pull .env.development.local
``` 

Install the Vercel Postgres SDK:
```bash

npm install @vercel/postgres
``` 

To run the development server:
```bash

pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The Flask server will be running on [http://127.0.0.1:5328](http://127.0.0.1:5328) – feel free to change the port in `package.json` (you'll also need to update it in `next.config.js`).

## Helpful Doccumentation

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Flask Documentation](https://flask.palletsprojects.com/en/1.1.x/) - learn about Flask features and API.

