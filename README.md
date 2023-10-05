## Introduction

Fortís

## How It Works

The Python/Flask server is mapped into to Next.js app under `/api/`.

This is implemented using [`next.config.js` rewrites](https://github.com/vercel/examples/blob/main/python/nextjs-flask/next.config.js) to map any request to `/api/:path*` to the Flask API, which is hosted in the `/api` folder.

On localhost, the rewrite will be made to the `127.0.0.1:5328` port, which is where the Flask server is running.

In production, the Flask server is hosted as [Python serverless functions](https://vercel.com/docs/concepts/functions/serverless-functions/runtimes/python) on Vercel.

Flask connects to the postgreSQL server and makes the queries to interact with the data as necessary in the backend. 
Furthermore, postgreSQL is also hosted by Vercel and linked to this project.

To set up postgreSQL, first connect postgre to storage in your Vercel dashboard.

## Getting Started

The initial framework is based on [Vercel's Next.js Flask Starter](https://vercel.com/templates/next.js/nextjs-flask-starter).

First, clone the project onto your local machine.

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

Next, install the dependencies:
```bash

pnpm install
```
Set up auth0:
```bash

pnpm add @auth0/nextjs-auth0
```

Set up pg:
```bash

pnpm add pg
```

Finally, to run the development server:
```bash

pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The Flask server will be running on [http://127.0.0.1:5328](http://127.0.0.1:5328) – feel free to change the port in `package.json` (you'll also need to update it in `next.config.js`).

## Connecting to PostgreSQL database
We use DataGrip to connect to the database, but any database tool that supports PostgreSQL 15 should work. 
First, we get the appropriate information from the Vercel homepage;\
POSTGRES_USER="default"\
POSTGRES_HOST="ep-polished-cherry-55480419-pooler.us-east-1.postgres.vercel-storage.com"\
POSTGRES_PASSWORD="now shown here"\
POSTGRES_DATABASE="verceldb"

Next, input the data into a New Data Source of the type PostgreSQL in DataGrip:
<img width="798" alt="image" src="https://github.com/jess-che/fortis/assets/63178260/874c23da-0d7b-4038-9e7c-d27cf5254451">\
Click OK, and your database should load on the left hand side of the screen. Tables will be shown under verceldb > public > tables:
<img width="351" alt="image" src="https://github.com/jess-che/fortis/assets/63178260/3d15e61d-ef31-4d4f-9003-961b84d3565c">\
Double clicking on a table lets you see its contents. To make queries, go to File -> New -> Query Console, and then use the console that appears to write and run any SQL queries you desire. 

## File Structure

Here is an overview of the project's overall file structure:

```
my-web-app/
│
├── api/
│   └── index.py
│
├── app/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── public/
│   ├── icons/
│   ├── images/
│   ├── next.svg
│   └── vercel.svg
│
├── src/
│   ├── components/
│   ├── pages/
│   └── styles/
│
├── .gitignore
├── README.md
├── next.config.js
├── package.json
├── pnpm-lock.yaml
├── postcss.config.js
├── requirements.txt
├── tailwind.config.js
└── tsconfig.json
```

- **api/**: Contains server-side code, possibly API endpoints or backend routes.
- **app/**: Contains files related to the Next.js application, including favicon, global CSS, layout, and main page.
- **public/**: Holds public assets such as icons, images, and SVG logos.
- **src/**: Contains the source code for the Next.js application, including components, pages, and styles.

*Changes may be made to create a `config/` folder to organize the configuration files.*

## Helpful Doccumentation

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Flask Documentation](https://flask.palletsprojects.com/en/1.1.x/) - learn about Flask features and API.

