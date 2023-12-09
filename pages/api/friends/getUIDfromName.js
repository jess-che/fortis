// get uid from the person's name
import { Pool } from 'pg';

const pool = new Pool({
    // connectionString: process.env.POSTGRES_URL
    connectionString: "postgres://default:Azy2srgWb9aU@ep-polished-cherry-55480419-pooler.us-east-1.postgres.vercel-storage.com/verceldb?sslmode=require"
});

const searchUserUID = `
    SELECT user_data."uid"
    FROM user_data
    WHERE user_data."name" LIKE $1
    LIMIT 1;
    `;

export default async (req, res) => {
    console.log("api is called at getUIDfromName");
    if (req.method === 'POST') {
        try {
            const name = req.body.name;
            // console.log(name);
            const values = [`%${name}%`];
            // console.log(values);
            const result = await pool.query(searchUserUID, values);
            if (result.rows.length > 0) {
                res.status(200).json({ uid: result.rows[0].uid });
            } else {
                res.status(404).send('User not found');
            }
        } catch (err) {
            console.error('Error in getting UID, problem in API:', err);
            res.status(500).json({ error: err.message });
        }
    } else {
        res.status(405).end();  // Method Not Allowed
    }
};
