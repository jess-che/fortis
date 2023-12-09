import { Pool } from 'pg';

const pool = new Pool({
    // connectionString: process.env.POSTGRES_URL
    connectionString: "postgres://default:Azy2srgWb9aU@ep-polished-cherry-55480419-pooler.us-east-1.postgres.vercel-storage.com/verceldb?sslmode=require"
});

// I am using a relevance score to measure if the search is start of name vs. end of name.
const searchUserName = `
    SELECT *, 
        CASE 
            WHEN position(lower($1) in lower(name)) = 1 THEN 3
            WHEN position(' ' || lower($1) in lower(name)) > 0 THEN 2
            ELSE 1
        END as relevance_score
    FROM user_data
    WHERE lower(name) LIKE '%' || lower($1) || '%' AND uid <> $2
    AND privacy NOT LIKE 'Private'
    AND uid NOT IN (
        SELECT "Sender" FROM friend WHERE "Receiver" = $2
        UNION
        SELECT "Receiver" FROM friend WHERE "Sender" = $2
    )
    ORDER BY relevance_score DESC, name;
    `;

export default async (req, res) => {
    if (req.method === 'POST') {
        const searchQuery = req.body.searchQuery;
        const uid = req.body.uid;

        try {
            // Insert user
            const values = [`%${searchQuery}%`, uid];
            console.log('hi');
            const results = await pool.query(searchUserName, values);
            
            res.json({ success: true, data: results });
        } catch (err) {
            console.log('hello');
            console.error(err);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        res.status(405).end();  // Method Not Allowed
    }
};
