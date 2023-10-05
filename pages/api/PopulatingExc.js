// Add this code to wherever you want to add stuff from:

// const saveExc = async () => {
//     const response = await fetch('/api/PopulatingExc', {
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

const insertExc = `
    INSERT INTO exercise (eid, name, type, muscle_group, popularity, favorite)
    VALUES
        (1, 'Push-up', 'Bodyweight', 'Chest', 100, true),
        (2, 'Bench Press', 'Strength', 'Chest', 90, false),
        (3, 'Squat', 'Strength', 'Legs', 95, true),
        (4, 'Deadlift', 'Strength', 'Back', 90, false),
        (5, 'Pull-up', 'Bodyweight', 'Back', 85, true),
        (6, 'Plank', 'Core', 'Abs', 80, false);
    `;

export default async (req, res) => {
    if (req.method === 'POST') {

        try {
            // Insert user
            console.log('hi');
            await pool.query(insertExc);
            
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