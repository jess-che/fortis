import { Pool } from 'pg';

const pool = new Pool({
    // connectionString: process.env.POSTGRES_URL
    connectionString: "postgres://default:Azy2srgWb9aU@ep-polished-cherry-55480419-pooler.us-east-1.postgres.vercel-storage.com/verceldb?sslmode=require"
});

const query = `
UPDATE activity
SET 
    "Favorite" = $3
WHERE 
    "Uid" = $1
    AND "Aid" = $2
`;

export default async (req, res) => {
    if (req.method === 'POST') {
        const { uid, aid, option } = req.body;
        
        try {
            const values = [uid, aid, option];
            await pool.query(query, values);

            res.status(200).json({ message: 'EndTime and Duration Updated Successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
};