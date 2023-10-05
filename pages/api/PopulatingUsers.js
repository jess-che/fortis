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

//   saveUsers();



import { Pool } from 'pg';

const pool = new Pool({
    // connectionString: process.env.POSTGRES_URL
    connectionString: "postgres://default:Azy2srgWb9aU@ep-polished-cherry-55480419-pooler.us-east-1.postgres.vercel-storage.com/verceldb?sslmode=require"
});

const insertUser = `
DELETE FROM user_data;
DELETE FROM "users";

    -- Inserting data into "Users" table
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
    ON CONFLICT (Email) DO NOTHING;

    -- Inserting data into user_data table
    INSERT INTO user_data (uid, name, gym)
    VALUES
        ((SELECT uid FROM "users" WHERE Email = 'john.doe@example.com'), 'John Doe', 1),
        ((SELECT uid FROM "users" WHERE Email = 'jane.doe@example.com'), 'Jane Doe', 2),
        ((SELECT uid FROM "users" WHERE Email = 'jim.bean@example.com'), 'Jim Bean', 3),
        ((SELECT uid FROM "users" WHERE Email = 'jack.daniels@example.com'), 'Jack Daniels', 1),
        ((SELECT uid FROM "users" WHERE Email = 'johnny.walker@example.com'), 'Johnny Walker', 2),
        ((SELECT uid FROM "users" WHERE Email = 'jameson.irish@example.com'), 'Jameson Irish', 3),
        ((SELECT uid FROM "users" WHERE Email = 'old.forester@example.com'), 'Old Forester', 1),
        ((SELECT uid FROM "users" WHERE Email = 'wild.turkey@example.com'), 'Wild Turkey', 2),
        ((SELECT uid FROM "users" WHERE Email = 'evan.williams@example.com'), 'Evan Williams', 3),
        ((SELECT uid FROM "users" WHERE Email = 'henry.mckenna@example.com'), 'Henry McKenna', 1)
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