

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
//   };

//     // END OF USELESS STUFF, JUST CHECKING



// WHen you click a button: 
//   "   getAID(value);    "  <-   This needs to be called.



import { Pool } from 'pg';

const pool = new Pool({
    // connectionString: process.env.POSTGRES_URL
    connectionString: "postgres://default:Azy2srgWb9aU@ep-polished-cherry-55480419-pooler.us-east-1.postgres.vercel-storage.com/verceldb?sslmode=require"
});

const matchyboo = `
    SELECT m.*, ud.*
    FROM public.matcher m
    JOIN public.user_data ud ON m."Uid" = ud.uid
    JOIN public.matcher input ON input."Uid" = $1::uuid
    WHERE m."Uid" != $1::uuid
    AND EXISTS (
        SELECT 1
        FROM unnest(string_to_array(trim(both '{}' from input.frequency), ',')) AS input_day
        JOIN unnest(string_to_array(trim(both '{}' from m.frequency), ',')) AS m_day ON input_day = m_day
    )
    AND EXISTS (
        SELECT 1
        FROM unnest(string_to_array(trim(both '{}' from replace(input."gymAvailability", '"', '')), ',')) WITH ORDINALITY AS input_avail(value, ord)
        JOIN unnest(string_to_array(trim(both '{}' from replace(m."gymAvailability", '"', '')), ',')) WITH ORDINALITY AS m_avail(value, ord) 
        ON input_avail.ord = m_avail.ord AND input_avail.value::boolean AND m_avail.value::boolean
    );
    `;

export default async (req, res) => {
    if (req.method === 'POST') {
        const searchQuery = req.body.searchQuery;

        try {
            // Insert user
            const values = [`${searchQuery}`];
            console.log('please work');
            const results = await pool.query(matchyboo, values);

            res.json({ success: true, data: results });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        res.status(405).end();  // Method Not Allowed
    }
};
