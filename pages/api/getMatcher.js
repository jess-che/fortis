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
    JOIN public.user_data input_ud ON input."Uid" = input_ud.uid
    LEFT JOIN public.friend f1 ON m."Uid" = f1."Sender" AND f1."Receiver" = $1::uuid
    LEFT JOIN public.friend f2 ON m."Uid" = f2."Receiver" AND f2."Sender" = $1::uuid
    WHERE m."Uid" != $1::uuid
    AND f1."Sender" IS NULL  -- Exclude if the matched user is a friend (as sender)
    AND f2."Receiver" IS NULL  -- Exclude if the matched user is a friend (as receiver)
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
    )
    AND input.location LIKE m.location
    AND (
        (input."genderPreference" = '' OR input."genderPreference" = ud.gender)
        AND (m."genderPreference" = '' OR m."genderPreference" = input_ud.gender)
        AND (ud.gender != '' OR input."genderPreference" = '')
        AND (input_ud.gender != '' OR m."genderPreference" = '')
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
