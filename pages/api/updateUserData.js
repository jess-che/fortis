import { Pool } from 'pg';

const pool = new Pool({
    // connectionString: process.env.POSTGRES_URL
    connectionString: "postgres://default:Azy2srgWb9aU@ep-polished-cherry-55480419-pooler.us-east-1.postgres.vercel-storage.com/verceldb?sslmode=require"
});

const updateUser = `
UPDATE user_data
SET
  name = $2,
  age = $3,
  height = $4,
  weight = $5,
  gender = $6,
  unit = $7,
  privacy = $8,
  about = $9
WHERE uid = $1
`;

export default async (req, res) => {
    if (req.method === 'POST') {
        const { uid, name, age, height, weight, gender, units, privacy, about } = req.body;

        try {
            const values = [uid, name, age, height, weight, gender, units, privacy, about];
            await pool.query(updateUser, values);
            
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
