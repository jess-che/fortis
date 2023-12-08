import { Pool } from 'pg';

const pool = new Pool({
    // connectionString: process.env.POSTGRES_URL
    connectionString: "postgres://default:Azy2srgWb9aU@ep-polished-cherry-55480419-pooler.us-east-1.postgres.vercel-storage.com/verceldb?sslmode=require"
});

const query = `
    WITH UserSets AS (
        SELECT 
            a."Uid", 
            SUM(w."Set") AS TotalSets
        FROM 
            public.activity a
        INNER JOIN 
            public.workouts w ON a."Aid" = w."Aid" AND a."Uid" = w."Uid"
        WHERE 
            a."Date" >= CURRENT_DATE - INTERVAL '2 weeks'
        GROUP BY 
            a."Uid"
    )

    SELECT 
        ud.*, 
        u.email, 
        COALESCE(us.TotalSets, 0) AS TotalSets
    FROM 
        public.friend AS f
    JOIN 
        public.user_data AS ud ON f."Receiver" = ud.uid
    JOIN 
        public.users AS u ON ud.uid = u.uid
    LEFT JOIN 
        UserSets us ON ud.uid = us."Uid"
    WHERE 
        f."Sender" = $1
        AND f.accepted = 1

    UNION

    SELECT 
        ud.*, 
        u.email, 
        COALESCE(us.TotalSets, 0) AS TotalSets
    FROM 
        public.friend AS f
    JOIN 
        public.user_data AS ud ON f."Sender" = ud.uid
    JOIN 
        public.users AS u ON ud.uid = u.uid
    LEFT JOIN 
        UserSets us ON ud.uid = us."Uid"
    WHERE 
        f."Receiver" = $1
        AND f.accepted = 1;
    `;

    export default async (req, res) => {
        if (req.method === 'POST') {
            const searchQuery = req.body.searchQuery;
            console.log(searchQuery);
    
            try {
                const results = await pool.query(query, [searchQuery]);
                console.log('Query executed successfully');
                res.json({ success: true, data: results.rows }); // Send back just the rows
            } catch (err) {
                console.error('Error executing query:', err);
                res.status(500).json({ success: false, message: err.message });
            }
        } else {
            res.status(405).end(); // Method Not Allowed
        }
    };    