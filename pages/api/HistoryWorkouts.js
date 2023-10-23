//   // USELESS STUFF, JUST CHECKING
// const HistoryWorkouts = async (uid, aid) => {
//     const response = await fetch('/api/HistoryActivites', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         uid: "b24e24f4-86b8-4b83-8947-b2472a43b436", 
//         aid: aid
//       }),
//     });

//     if (!response.ok) {
//       throw new Error('Failed to retrieve history');
//     }

//     const data = await response.json();
//     console.log(data)
// };


//     // END OF USELESS STUFF, JUST CHECKING


// WHen you click a button: 
//   "   HistoryWorkouts(value);    "  <-   This needs to be called.



import { Pool } from 'pg';

const pool = new Pool({
    // connectionString: process.env.POSTGRES_URL
    connectionString: "postgres://default:Azy2srgWb9aU@ep-polished-cherry-55480419-pooler.us-east-1.postgres.vercel-storage.com/verceldb?sslmode=require"
});

const History = `
    SELECT *
    FROM workouts
    WHERE workouts."Uid" = $1
    AND workouts."Aid" = $2
    ORDER BY workouts."Seq_num";
`;

export default async (req, res) => {
    if (req.method === 'POST') {
        const uid = req.body.uid;
        const aid = req.body.aid;

        try {
            const values = [uid, aid];
            console.log('Querying database');
            const results = await pool.query(History, values);
            
            res.json({ success: true, data: results });
        } catch (err) {
            console.log('Error occurred');
            console.error(err);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        res.status(405).end();  // Method Not Allowed
    }
};
