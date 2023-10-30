import { Pool } from 'pg';

const pool = new Pool({
    // connectionString: process.env.POSTGRES_URL
    connectionString: "postgres://default:Azy2srgWb9aU@ep-polished-cherry-55480419-pooler.us-east-1.postgres.vercel-storage.com/verceldb?sslmode=require"
});

const insertQuery = `
INSERT INTO public.workouts ("Uid", "Aid", "Eid", "Weight", "Rep", "Set")
VALUES ($1, $2, $3, $4, $5, $6);
`;


export default async (req, res) => {
    if (req.method === 'POST') {
        const exercises = req.body;

        // Check if exercises is an array
        if (!Array.isArray(exercises)) {
            return res.status(400).json({ error: 'Exercises data must be an array' });
        }

        try {
            console.log('hi');
            for (let exercise of exercises) {
                // Check if exercise has all necessary properties
                const { Uid, Aid, Eid, Weight, Rep, Set } = exercise;

                await pool.query(insertQuery, [Uid, Aid, Eid, Weight, Rep, Set]);
            }
            res.status(200).json({ message: 'Exercises saved successfully' });
        } catch (err) {
            console.log('hello');
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    } else {
        res.status(405).end();  // Method Not Allowed
    }
};