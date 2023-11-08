//   // USELESS STUFF, JUST CHECKING
//   const HistoryActivities = async (query: any) => {
//     const response = await fetch('/api/HistoryActivites', {
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
//   };

//     // END OF USELESS STUFF, JUST CHECKING



// WHen you click a button: 
//   "   HistoryActivities(value);    "  <-   This needs to be called.



import { Pool } from 'pg';

const pool = new Pool({
    // connectionString: process.env.POSTGRES_URL
    connectionString: "postgres://default:Azy2srgWb9aU@ep-polished-cherry-55480419-pooler.us-east-1.postgres.vercel-storage.com/verceldb?sslmode=require"
});

const History = `
    SELECT * FROM exercise
    WHERE EID = $1;
    `;

export default async (req, res) => {
    if (req.method === 'POST') {
        const searchQuery = req.body.searchQuery;

        try {
            const values = [`${searchQuery}`];
            const results = await pool.query(History, values);
            
            console.log('Success! ExcDatafromEID');
            res.json({ success: true, data: results });
        } catch (err) {
            console.log('error in ExcDatafromEID');
            console.error(err);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        res.status(405).end();  // Method Not Allowed
    }
};
