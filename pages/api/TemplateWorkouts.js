import { Pool } from 'pg';

const pool = new Pool({
    // connectionString: process.env.POSTGRES_URL
    connectionString: "postgres://default:Azy2srgWb9aU@ep-polished-cherry-55480419-pooler.us-east-1.postgres.vercel-storage.com/verceldb?sslmode=require"
});

const History = `
    SELECT *
    FROM workouts
    WHERE workouts."Aid" = $1
    ORDER BY workouts."Seq_num";
`;

export default async (req, res) => {
    if (req.method === 'POST') {
        const aid = req.body.aid;

        try {
            console.log('Querying database');
            const results = await pool.query(History, [aid]);
            
            res.json({ success: true, data: results });
        } catch (err) {
            console.log('Error occurred');
            console.error(err);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        res.status(405).end();  // Method Not Allowed
    }
};
