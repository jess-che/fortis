import { Pool } from 'pg';

const pool = new Pool({
    // connectionString: process.env.POSTGRES_URL
    connectionString: "postgres://default:Azy2srgWb9aU@ep-polished-cherry-55480419-pooler.us-east-1.postgres.vercel-storage.com/verceldb?sslmode=require"
});

const Streaks1 = `
    SELECT Date, Duration
    FROM activity
    WHERE activity."Uid" = $1
    ORDER BY Date DESC;
    `; 

    const Streaks = `
    SELECT "Date", "Duration"
    FROM activity
    WHERE "Uid" = (
        SELECT "uid" FROM users
        WHERE "Email" LIKE $1
        LIMIT 1
    )
    ORDER BY "Date" DESC;
    `; 


export default async (req, res) => {
    if (req.method === 'POST') {
        const searchQuery = req.body.searchQuery;;

        try {
            // Insert user
           //const values = [${searchQuery}$`];
            console.log('hi', searchQuery);
            const results = await pool.query(Streaks, [searchQuery]);
            
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
