import { Pool } from 'pg';

const pool = new Pool({
    // connectionString: process.env.POSTGRES_URL
    connectionString: "postgres://default:Azy2srgWb9aU@ep-polished-cherry-55480419-pooler.us-east-1.postgres.vercel-storage.com/verceldb"
});

const insertUser = `
    INSERT INTO "users" (Uuid, Email)
    VALUES (DEFAULT, $1)
`;

export default async (req, res) => {
    if (req.method === 'POST') {
        const { email } = req.body;

        try {
            // Insert user
            console.log('hi');
            await pool.query(insertUser, [email]);
            
            res.status(200).send('Data saved successfully');
        } catch (err) {
            console.log('hello');
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    } else {
        res.status(405).end();  // Method Not Allowed
    }
};
