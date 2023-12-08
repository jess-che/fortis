import { Pool } from 'pg';

const pool = new Pool({
    // connectionString: process.env.POSTGRES_URL
    connectionString: "postgres://default:Azy2srgWb9aU@ep-polished-cherry-55480419-pooler.us-east-1.postgres.vercel-storage.com/verceldb?sslmode=require"
});

const query = `
    SELECT * FROM public.friend
    WHERE "Sender" = $1
    OR "Receiver" = $1
    AND accepted = 1;
    `;

    export default async (req, res) => {
        if (req.method === 'POST') {
            const searchQuery = req.body.searchQuery;
            console.log(searchQuery);
    
            try {
                const results = await pool.query(query, [searchQuery]);
                console.log('Query executed successfully');
                res.json({ success: true, data: results.rows }); // Send back just the rows
            } catch (err) {
                console.error('Error executing query:', err);
                res.status(500).json({ success: false, message: err.message });
            }
        } else {
            res.status(405).end(); // Method Not Allowed
        }
    };    