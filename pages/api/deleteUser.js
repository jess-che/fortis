// delete user
import { Pool } from 'pg';

const pool = new Pool({
    // connectionString: process.env.POSTGRES_URL
    connectionString: "postgres://default:Azy2srgWb9aU@ep-polished-cherry-55480419-pooler.us-east-1.postgres.vercel-storage.com/verceldb?sslmode=require"
});

const deleteFriend = `
    DELETE FROM friend
    WHERE "Sender" = $1 OR "Receiver" = $1
`;

const deleteMatcher = `
    DELETE FROM matcher
    WHERE "Uid" = $1
`;

const deleteWorkouts = `
    DELETE FROM workouts
    WHERE "Uid" = $1
`;

const deleteActivity = `
    DELETE FROM activity
    WHERE "Uid" = $1
`;

const deleteUserData = `
    DELETE FROM user_data
    WHERE "uid" = $1
`;

const deleteUser = `
    DELETE FROM users
    WHERE "uid" = $1
`;

export default async (req, res) => {
    if (req.method === 'POST') {
        const { uid } = req.body;

        try {
            const values = [uid];
            await pool.query(deleteFriend, values);
            await pool.query(deleteMatcher, values);
            await pool.query(deleteWorkouts, values);
            await pool.query(deleteActivity, values);
            await pool.query(deleteUserData, values);
            await pool.query(deleteUser, values);


            res.status(200).send('Deleted user successfully');
        } catch (err) {
            console.log('Error in Delete User');
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    } else {
        res.status(405).end();  // Method Not Allowed
    }
};
