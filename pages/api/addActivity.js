import { Pool } from 'pg';

const pool = new Pool({
    // connectionString: process.env.POSTGRES_URL
    connectionString: "postgres://default:Azy2srgWb9aU@ep-polished-cherry-55480419-pooler.us-east-1.postgres.vercel-storage.com/verceldb?sslmode=require"
});

const addActivity = `
insert into activity ("Activity_name", "Aid", "Uid", "Date", "Start_time", "End_time", "Duration")
values (DEFAULT, DEFAULT, $1, DEFAULT, DEFAULT, DEFAULT, DEFAULT);
`;

export default async (req, res) => {
    if (req.method === 'POST') {
        const { uid } = req.body;

        try {
            const values = [uid];
            await pool.query(addActivity, values);

            res.status(200).json({ message: 'Activity added successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });  
    }
};