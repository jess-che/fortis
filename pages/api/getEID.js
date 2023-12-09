// get EID from exercise name

import { Pool } from 'pg';

const pool = new Pool({
    // connectionString: process.env.POSTGRES_URL
    connectionString: "postgres://default:Azy2srgWb9aU@ep-polished-cherry-55480419-pooler.us-east-1.postgres.vercel-storage.com/verceldb?sslmode=require"
});

const getEID = `
    SELECT exercise."eid"
    FROM exercise
    WHERE exercise."name" LIKE $1;
    `;

export default async (req, res) => {
    if (req.method === 'POST') {
        const searchQuery = req.body.searchQuery;

        try {
            const values = [`%${searchQuery}%`];

            console.log('Success! getEid');
            const results = await pool.query(getEID, values);

            res.json({ success: true, data: results });
        } catch (err) {
            console.log('error in getEid');
            console.error(err);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        res.status(405).end();  // Method Not Allowed
    }
};