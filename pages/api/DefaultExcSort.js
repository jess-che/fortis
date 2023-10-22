import { Pool } from 'pg';

const pool = new Pool({
    connectionString: "postgres://default:Azy2srgWb9aU@ep-polished-cherry-55480419-pooler.us-east-1.postgres.vercel-storage.com/verceldb?sslmode=require"
});

const DefaultSort = `
SELECT * FROM exercise
ORDER BY popularity DESC;
`;

export default async (req, res) => {
    if (req.method === 'GET') {  // Change to handle GET requests

        try {
            const results = await pool.query(DefaultSort);
            // Return the results in the expected format
            res.status(200).json({ data: { rows: results.rows } });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    } else {
        res.status(405).end();  // Method Not Allowed
    }
};
