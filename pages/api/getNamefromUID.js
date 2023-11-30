import { Pool } from 'pg';

const pool = new Pool({
    // connectionString: process.env.POSTGRES_URL
    connectionString: "postgres://default:Azy2srgWb9aU@ep-polished-cherry-55480419-pooler.us-east-1.postgres.vercel-storage.com/verceldb?sslmode=require"
});

const searchUserName = `
    SELECT * FROM user_data
    WHERE user_data.uid = $1
    `;

export default async (req, res) => {
    if (req.method === 'POST') {
        const searchQuery = req.body.searchQuery;
        console.log(searchQuery);

        try {
            const values = [`%${searchQuery}%`];
            const results = await pool.query(searchUserName, values);

            console.log('Success! GetUIDfromEmail');
            res.json({ success: true, data: results });
        } catch (err) {
            console.log('Error in GetUIDfromEmail');
            console.error(err);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        res.status(405).end();  // Method Not Allowed
    }
};
