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
    WHERE activity."Uid" = $1 
    AND activity."Date" BETWEEN (CURRENT_DATE AT TIME ZONE 'EST' - $2::integer * INTERVAL '1 week') 
                        AND (CURRENT_DATE AT TIME ZONE 'EST' - $2::integer * INTERVAL '1 week' + INTERVAL '7 days')
    ORDER BY activity."Date" DESC, activity."Start_time" DESC;
`;


export default async (req, res) => {
    if (req.method === 'POST') {
        const searchQuery = req.body.searchQuery;
        const weeksBefore = req.body.weeksBefore;

        try {
            // Insert user
            const values = [`${searchQuery}`, weeksBefore];
            const results = await pool.query(History, values);

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
