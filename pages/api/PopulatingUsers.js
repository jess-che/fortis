// Add this code to wherever you want to add stuff from:

// const saveUser = async () => {
//     const response = await fetch('/api/PopulatingUsers', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//       }),
//     });
//     console.log("your mother");
    
//     if (!response.ok) {
//         throw new Error('Failed to save user');
//       }
//   };

//   saveExc();



import { Pool } from 'pg';

const pool = new Pool({
    // connectionString: process.env.POSTGRES_URL
    connectionString: "postgres://default:Azy2srgWb9aU@ep-polished-cherry-55480419-pooler.us-east-1.postgres.vercel-storage.com/verceldb?sslmode=require"
});

const insertUser = `

-- Inserting data into "users" table and returning the generated UIDs
WITH inserted_users AS (
    INSERT INTO "users" (Email)
    VALUES
        ('john.doe@example.com'),
        ('jane.doe@example.com'),
        ('jim.bean@example.com'),
        ('jack.daniels@example.com'),
        ('johnny.walker@example.com'),
        ('jameson.irish@example.com'),
        ('old.forester@example.com'),
        ('wild.turkey@example.com'),
        ('evan.williams@example.com'),
        ('henry.mckenna@example.com')
    ON CONFLICT (Email) DO NOTHING
    RETURNING uid
)
-- Inserting data into user_data table using the returned UIDs
INSERT INTO user_data (uid, name, gym)
SELECT uid, name, gym
FROM inserted_users, 
     UNNEST(ARRAY['John Doe', 'Jane Doe', 'Jim Bean', 'Jack Daniels', 'Johnny Walker', 'Jameson Irish', 'Old Forester', 'Wild Turkey', 'Evan Williams', 'Henry McKenna']) AS name,
     UNNEST(ARRAY[1, 2, 3, 1, 2, 3, 1, 2, 3, 1]) AS gym
ON CONFLICT (uid) DO NOTHING;

    `;

export default async (req, res) => {
    if (req.method === 'POST') {

        try {
            // Insert user
            console.log('hi');
            await pool.query(insertUser);
            
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