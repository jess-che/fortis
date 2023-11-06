import { Pool } from 'pg';

const pool = new Pool({
    // connectionString: process.env.POSTGRES_URL
    connectionString: "postgres://default:Azy2srgWb9aU@ep-polished-cherry-55480419-pooler.us-east-1.postgres.vercel-storage.com/verceldb?sslmode=require"
});

// const History = `
//     SELECT *
//     FROM activity
//     WHERE activity."Uid" = $1
//     ORDER BY activity."Date" DESC, activity."Start_time" DESC;
//     `;

const History = `
    SELECT *
    FROM activity
    ORDER BY activity."Date" DESC;
`;


export default async (req, res) => {
    if (req.method === 'GET') {
        try {
            // Insert user
            const results = await pool.query(History);

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
