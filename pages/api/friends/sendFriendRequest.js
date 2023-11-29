import { Pool } from 'pg';

const pool = new Pool({
    // connectionString: process.env.POSTGRES_URL
    connectionString: "postgres://default:Azy2srgWb9aU@ep-polished-cherry-55480419-pooler.us-east-1.postgres.vercel-storage.com/verceldb?sslmode=require"
});

const sendFriendRequest = `
INSERT INTO public.friend ("Sender", "Receiver", accepted)
VALUES ($1, $2, 0)
    `;

export default async (req, res) => {
    if (req.method === 'POST') {
        try {
            const { sender, receiver } = req.body;
            // Insert request 
            // const values = [`%${searchQuery}%`];
            await pool.query(sendFriendRequest, [sender, receiver]);
            res.status(200).send('Friend request data inserted successfully');
        } catch (err) {
            console.error('Error in inserting friend request data:', err);
            res.status(500).json({ error: err.message });
        }
    } else {
        res.status(405).end();  // Method Not Allowed
    }
};
