//   // USELESS STUFF, JUST CHECKING
//   const getUID = async (query: any) => {
//     const response = await fetch('/api/getUIDfromEmail', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         searchQuery: query
//       }),
//     });

//     if (!response.ok) {
//       throw new Error('Failed to save query');
//     }

//     const data = await response.json();
//     console.log(data)
//   };

//     // END OF USELESS STUFF, JUST CHECKING



// WHen you click a button: 
//   "   getUIDfromEmail(value);    "  <-   This needs to be called.


import { Pool } from 'pg';

const pool = new Pool({
    // connectionString: process.env.POSTGRES_URL
    connectionString: "postgres://default:Azy2srgWb9aU@ep-polished-cherry-55480419-pooler.us-east-1.postgres.vercel-storage.com/verceldb?sslmode=require"
});

const searchUserEmail = `
    SELECT * FROM users
    WHERE email LIKE $1
    `;

export default async (req, res) => {
    if (req.method === 'POST') {
        const searchQuery = req.body.searchQuery;
        console.log(searchQuery);

        try {
            const values = [`%${searchQuery}%`];
            const results = await pool.query(searchUserEmail, values);

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
