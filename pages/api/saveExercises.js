import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

export default async (req, res) => {
    if (req.method === 'POST') {
        const exercises = req.body;

        // Check if exercises is an array
        if (!Array.isArray(exercises)) {
            return res.status(400).json({ error: 'Exercises data must be an array' });
        }

        try {
            await pool.query('BEGIN');

            for (let exercise of exercises) {
                // Check if exercise has all necessary properties
                if (!exercise.Uid || !exercise.Aid || !exercise.Seq_num || !exercise.Eid || exercise.Weight === undefined || exercise.Rep === undefined || exercise.Set === undefined) {
                    await pool.query('ROLLBACK');
                    return res.status(400).json({ error: 'Each exercise must have a Uid, Aid, Seq_num, Eid, Weight, Rep, and Set' });
                }

                const { Uid, Aid, Seq_num, Eid, Weight, Rep, Set } = exercise;
                const insertQuery = `
                    INSERT INTO public.workouts (Uid, Aid, Seq_num, Eid, Weight, Rep, Set)
                    VALUES ($1, $2, $3, $4, $5, $6, $7);
                `;
                await pool.query(insertQuery, [Uid, Aid, Seq_num, Eid, Weight, Rep, Set]);
            }

            await pool.query('COMMIT');
            res.status(200).json({ message: 'Exercises saved successfully' });
        } catch (err) {
            await pool.query('ROLLBACK');
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    } else {
        res.status(405).end();  // Method Not Allowed
    }
};