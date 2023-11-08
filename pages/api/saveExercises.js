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
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const exercises = req.body;

    if (!Array.isArray(exercises)) {
        return res.status(400).json({ error: 'Exercises data must be an array' });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        for (let exercise of exercises) {
            const { aid, eid, exerciseName, numberOfReps, numberOfSets, uid, weight } = exercise;
            await client.query(insertQuery, [uid, aid, eid, weight, numberOfReps, numberOfSets]);
        }

        await client.query('COMMIT');
        res.status(200).json({ message: 'Exercises saved successfully' });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error during the transaction', err);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        client.release();
    }
};
