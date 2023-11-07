import { Pool } from 'pg';

const pool = new Pool({
    // connectionString: process.env.POSTGRES_URL
    connectionString: "postgres://default:Azy2srgWb9aU@ep-polished-cherry-55480419-pooler.us-east-1.postgres.vercel-storage.com/verceldb?sslmode=require"
});

const insertQuery = `
INSERT INTO workouts ("Uid", "Aid", "Seq_num", "Eid", "Weight", "Rep", "Set")
VALUES ($1, $2, DEFAULT, $3, $4, $5, $6);
`;

// ... rest of your imports and setup ...

export default async (req, res) => {
    if (req.method === 'POST') {
        const exercises = req.body;
        console.log(exercises);

        // Check if exercises is an array
        if (!Array.isArray(exercises)) {
            return res.status(400).json({ error: 'Exercises data must be an array' });
        }

        try {
            await pool.connect(); // Start a new connection to the database
            await pool.query('BEGIN'); // Begin a transaction

            for (let exercise of exercises) {
                const { aid, eid, exerciseName, numberOfReps, numberOfSets, uid, weight } = exercise;
                console.log(exercise);
                await pool.query(insertQuery, [uid, aid, eid, weight, numberOfReps, numberOfSets]);
            }

            await pool.query('COMMIT'); // Commit the transaction
            res.status(200).json({ message: 'Exercises saved successfully' });
        } catch (err) {
            await pool.query('ROLLBACK'); // Roll back the transaction on error
            console.error(err);
            res.status(500).json({ error: err.message });
        } finally {
            pool.end(); // Close the database connection
        }
    } else {
        res.status(405).end(); // Method Not Allowed
    }
};
