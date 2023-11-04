import { Pool } from 'pg';

const pool = new Pool({
    // connectionString: process.env.POSTGRES_URL
    connectionString: "postgres://default:Azy2srgWb9aU@ep-polished-cherry-55480419-pooler.us-east-1.postgres.vercel-storage.com/verceldb?sslmode=require"
});

const timey = `
    SELECT 
        SUM(EXTRACT(EPOCH FROM "Duration") / 60) AS total_workout_minutes
    FROM 
        public.activity
    WHERE 
        "Uid" = $1
        AND "Date" >= current_date - INTERVAL '1 week';
    `; 


export default async (req, res) => {
    if (req.method === 'POST') {
        const searchQuery = req.body.searchQuery;
        try {
            // Insert user
            const values = [`${searchQuery}`];
            console.log('yippers');
            const results = await pool.query(timey, values);
            
            res.json({ success: true, data: results });
        } catch (err) {
            console.log('hola');
            console.error(err);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        res.status(405).end();  // Method Not Allowed
    }
};
    