import { Pool } from 'pg';

const pool = new Pool({
    // connectionString: process.env.POSTGRES_URL
    connectionString: "postgres://default:Azy2srgWb9aU@ep-polished-cherry-55480419-pooler.us-east-1.postgres.vercel-storage.com/verceldb?sslmode=require"
});

const acceptFriendRequestQuery = `
UPDATE public.friend 
SET accepted = 1
WHERE "Receiver" LIKE $1 AND "Sender" LIKE $2;
`;

export default async (req, res) => {
    if (req.method === 'PUT') {
        const { receiver, sender } = req.body;

        try {
            const result = await pool.query(acceptFriendRequestQuery, [receiver, sender]);
            if (result.rowCount === 0) {
                // No rows were updated, which means the request didn't exist
                return res.status(404).send('Friend request not found');
            }
            res.status(200).send('Friend request accepted successfully');
        } catch (err) {
            console.error('Error in accepting friend request:', err);
            res.status(500).json({ error: err.message });
        }
    } else {
        res.status(405).end(); // Method Not Allowed
    }
};
