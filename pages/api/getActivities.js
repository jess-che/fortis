// get activity data based on aid and uid
import { Pool } from 'pg';

const pool = new Pool({
    // connectionString: process.env.POSTGRES_URL
    connectionString: "postgres://default:Azy2srgWb9aU@ep-polished-cherry-55480419-pooler.us-east-1.postgres.vercel-storage.com/verceldb?sslmode=require"
});

const History = `
    SELECT 
        *, 
        to_char(activity."Date", 'YYYY-MM-DD') AS formatted_date
    FROM 
        activity
    WHERE 
        activity."Uid" = $1 
        AND activity."Aid" = $2
`;


export default async (req, res) => {
    if (req.method === 'POST') {
        const searchQuery = req.body.searchQuery;
        const aid = req.body.aid;

        try {
            const values = [`${searchQuery}`, aid];
            const results = await pool.query(History, values);

            console.log('Success! HistoryActivities');
            res.json({ success: true, data: results });
        } catch (err) {
            console.log('Error in HistoryActivites');
            console.error(err);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        res.status(405).end();  // Method Not Allowed
    }
};
