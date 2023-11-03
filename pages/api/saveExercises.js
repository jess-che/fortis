import { Pool } from 'pg';

const pool = new Pool({
    // connectionString: process.env.POSTGRES_URL
    connectionString: "postgres://default:Azy2srgWb9aU@ep-polished-cherry-55480419-pooler.us-east-1.postgres.vercel-storage.com/verceldb?sslmode=require"
});

const insertQuery = `
INSERT INTO public.workouts ("Uid", "Aid", "Seq_num", "Eid", "Weight", "Rep", "Set")
VALUES ($1, $2, $3, $4, $5, $6, $7);
`;


export default async (req, res) => {
    if (req.method === 'POST') {
        const exercises = req.body;
        console.log(exercises);

        // Check if exercises is an array
        if (!Array.isArray(exercises[0])) {
            return res.status(400).json({ error: 'Exercises data must be an array' });
        }

        try {
            console.log('hi');
            let seq_num = 0;
            for (let exercise of exercises[0]) {
                // Check if exercise has all necessary properties
                // const { Uid, Aid, Eid, Weight, Rep, Set } = exercise;
                // const { Aid, Eid, name, Rep, Set, Uid, Weight } = exercise;
                const { aid, eid, exerciseName, numberOfReps, numberOfSets, uid, weight } = exercise;
                console.log(exercise)
                seq_num++;

                // await pool.query(insertQuery, [Uid, Aid, Eid, Weight, Rep, Set]);
                await pool.query(insertQuery, [uid, aid, seq_num, eid, weight, numberOfReps, numberOfSets]);
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