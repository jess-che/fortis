import { Pool } from 'pg';

const pool = new Pool({
    // connectionString: process.env.POSTGRES_URL
    connectionString: "postgres://default:Azy2srgWb9aU@ep-polished-cherry-55480419-pooler.us-east-1.postgres.vercel-storage.com/verceldb?sslmode=require"
});

const Bobby = `
    SELECT 
        e.muscle_group,
        SUM(w."Set") AS total_sets
    FROM 
        public.workouts w
    JOIN 
        public.exercise e ON w."Eid" = e.eid
    JOIN 
        public.activity a ON w."Aid" = a."Aid" AND w."Uid" = a."Uid"
    WHERE 
        w."Uid" = $1
        AND a."Date" >= current_date - INTERVAL '1 week'
    GROUP BY 
        e.muscle_group;
    `; 


export default async (req, res) => {
    if (req.method === 'POST') {
        const searchQuery = req.body.searchQuery;
        try {
            // Insert user
            const values = [`${searchQuery}`];
            console.log('yippers');
            const results = await pool.query(Bobby, values);
            
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
    