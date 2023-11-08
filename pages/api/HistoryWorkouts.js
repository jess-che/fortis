import { Pool } from 'pg';

const pool = new Pool({
    // connectionString: process.env.POSTGRES_URL
    connectionString: "postgres://default:Azy2srgWb9aU@ep-polished-cherry-55480419-pooler.us-east-1.postgres.vercel-storage.com/verceldb?sslmode=require"
});

const History = `
    SELECT *
    FROM workouts
    WHERE workouts."Uid" = $1
    AND workouts."Aid" = $2
    ORDER BY workouts."Seq_num";
`;

export default async (req, res) => {
    if (req.method === 'POST') {
        const uid = req.body.uid;
        const aid = req.body.aid;

        try {
            const values = [uid, aid];
            const results = await pool.query(History, values);
            
            console.log('Success! HistoryWorkouts');
            res.json({ success: true, data: results });
        } catch (err) {
            console.log('error in HistoryWorkouts');
            console.error(err);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        res.status(405).end();  // Method Not Allowed
    }
};
