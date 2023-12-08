import { Pool } from 'pg';

const pool = new Pool({
    // connectionString: process.env.POSTGRES_URL
    connectionString: "postgres://default:Azy2srgWb9aU@ep-polished-cherry-55480419-pooler.us-east-1.postgres.vercel-storage.com/verceldb?sslmode=require"
});

const matchyboo = `
    SELECT *
    FROM public.matcher 
    WHERE "Uid" = $1
    `;

export default async (req, res) => {
    if (req.method === 'POST') {
        const uid = req.body.uid;

        try {
            // Insert user
            const values = [uid];
            console.log('please work');
            const results = await pool.query(matchyboo, values);

            res.json({ success: true, data: results });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        res.status(405).end();  // Method Not Allowed
    }
};
