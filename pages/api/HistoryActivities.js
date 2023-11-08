import { Pool } from 'pg';

const pool = new Pool({
    // connectionString: process.env.POSTGRES_URL
    connectionString: "postgres://default:Azy2srgWb9aU@ep-polished-cherry-55480419-pooler.us-east-1.postgres.vercel-storage.com/verceldb?sslmode=require"
});

const History = `
    SELECT 
        *, 
        to_char(activity."Date", 'YYYY-MM-DD') AS formatted_date,
        ($2::date - $3::integer * INTERVAL '1 week' + INTERVAL '1 day')::date as starttime,
        ($2::date - $3::integer * INTERVAL '1 week' + INTERVAL '7 days' - INTERVAL '1 second')::date as endtime,
        activity."Date"::date as date
    FROM 
        activity
    WHERE 
        activity."Uid" = $1 
        AND activity."Date"::date >= ($2::date - $3::integer * INTERVAL '1 week' + INTERVAL '1 day')::date 
        AND activity."Date"::date < ($2::date - $3::integer * INTERVAL '1 week' + INTERVAL '7 days')::date
    ORDER BY 
        activity."Date" DESC, 
        activity."Start_time" DESC;
`;


export default async (req, res) => {
    if (req.method === 'POST') {
        const searchQuery = req.body.searchQuery;
        const currentDate = req.body.currentDate;
        const weeksBefore = req.body.weeksBefore;

        try {
            // Insert user
            const values = [`${searchQuery}`, currentDate, weeksBefore];
            console.log(`${searchQuery}`, `${currentDate}`, `${weeksBefore}`);
            console.log('Success! HistoryActivities');
            const results = await pool.query(History, values);

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
