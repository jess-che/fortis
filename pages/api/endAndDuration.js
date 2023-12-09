// handling save end and duration of activity
import { Pool } from 'pg';

const pool = new Pool({
    // connectionString: process.env.POSTGRES_URL
    connectionString: "postgres://default:Azy2srgWb9aU@ep-polished-cherry-55480419-pooler.us-east-1.postgres.vercel-storage.com/verceldb?sslmode=require"
});

const query = `
UPDATE activity
SET 
    "End_time" = NOW(),
    "Duration" = NOW() - "Start_time",
    "Activity_name" = $2
WHERE 
    "Aid" = (SELECT "Aid" FROM activity
             WHERE "Uid" = $1
             ORDER BY "Aid" DESC
             LIMIT 1)
    AND "Uid" = $1;
`;

export default async (req, res) => {
    if (req.method === 'POST') {
        const { uid, name } = req.body;

        try {
            const values = [uid, name];
            await pool.query(query, values);

            res.status(200).json({ message: 'EndTime and Duration Updated Successfully' });
        } catch (err) {
            console.log("Error in EndTime and Duration")
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
};