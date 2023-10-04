import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

const insertUser = `
    INSERT INTO "Users" (email)
    VALUES ($1)
`;

// const insertUserData = `
//     INSERT INTO user_data (uid, name, gym)
//     VALUES (
//         (SELECT uid FROM "Users" WHERE email = $1),
//         $2,
//         (SELECT G.gid FROM gym G
//          JOIN user_data UD ON G.uid = UD.uid
//          WHERE UD.name = $3
//          LIMIT 1)
//     )
// `;


export default async (req, res) => {
    if (req.method === 'POST') {
        const { email, name } = req.body;

        try {
            // Insert user
            await pool.query(insertUser, [email]);

            // Insert user data
            // await pool.query(insertUserData, [email, name, gymName]);

            res.status(200).send('Data saved successfully');
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    } else {
        res.status(405).end();  // Method Not Allowed
    }
};
