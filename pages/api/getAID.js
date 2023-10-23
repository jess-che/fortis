

//   // USELESS STUFF, JUST CHECKING
//   const getAID = async (query: any) => {
//     const response = await fetch('/api/getAID', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         searchQuery: "b24e24f4-86b8-4b83-8947-b2472a43b436"
//         //query
//       }),
//     });

//     if (!response.ok) {
//       throw new Error('Failed to save query');
//     }

//     const data = await response.json();
//     console.log(data)
//     //setResults(dataName) -- For only Excercise name (changed to account for description etc.)
//   };

//     // END OF USELESS STUFF, JUST CHECKING



// WHen you click a button: 
//   "   getAID(value);    "  <-   This needs to be called.



import { Pool } from 'pg';

const pool = new Pool({
    // connectionString: process.env.POSTGRES_URL
    connectionString: "postgres://default:Azy2srgWb9aU@ep-polished-cherry-55480419-pooler.us-east-1.postgres.vercel-storage.com/verceldb?sslmode=require"
});

const getAID = `
    SELECT activity."Aid"
    FROM activity
    WHERE activity."Uid" = $1
    ORDER BY activity."Date" DESC, activity."Start_time" DESC
    LIMIT 1;
    `;

export default async (req, res) => {
    if (req.method === 'POST') {
        const searchQuery = req.body.searchQuery;

        try {
            // Insert user
            const values = [`${searchQuery}`];
            console.log('hi');
            const results = await pool.query(getAID, values);
            
            res.json({ success: true, data: results });
        } catch (err) {
            console.log('hello');
            console.error(err);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        res.status(405).end();  // Method Not Allowed
    }
};
