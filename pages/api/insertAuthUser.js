import { Pool } from 'pg';

const pool = new Pool({
    // connectionString: process.env.POSTGRES_URL
    connectionString: "postgres://default:Azy2srgWb9aU@ep-polished-cherry-55480419-pooler.us-east-1.postgres.vercel-storage.com/verceldb?sslmode=require"
});

const insertUser = `
    INSERT INTO "users" (Uid, Email)
    VALUES (DEFAULT, $1)
`;

export default async (req, res) => {
    if (req.method === 'POST') {
        const { email } = req.body;

        try {
            // Insert user
            console.log('Success! InsertAuthUser');
            await pool.query(insertUser, [email]);
            
            res.status(200).send('Data saved successfully');
        } catch (err) {
            console.log('Error in InsertAuthUser');
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    } else {
        res.status(405).end();  // Method Not Allowed
    }
};
