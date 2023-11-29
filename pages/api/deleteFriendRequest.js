import { Pool } from 'pg';

const pool = new Pool({
    // connectionString: process.env.POSTGRES_URL
    connectionString: "postgres://default:Azy2srgWb9aU@ep-polished-cherry-55480419-pooler.us-east-1.postgres.vercel-storage.com/verceldb?sslmode=require"
});

const deleteFriendRequestQuery = `
DELETE FROM public.friend 
WHERE "Sender" = $1 AND "Receiver" = $2;
`;

export default async (req, res) => {
    if (req.method === 'DELETE') {
        const { sender, receiver } = req.body;

        try {
            await pool.query(deleteFriendRequestQuery, [sender, receiver]);
            res.status(200).send('Friend request deleted successfully');
        } catch (err) {
            console.error('Error in deleting friend request:', err);
            res.status(500).json({ error: err.message });
        }
    } else {
        res.status(405).end(); // Method Not Allowed
    }
};
