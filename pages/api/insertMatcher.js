import { Pool } from 'pg';

const pool = new Pool({
    connectionString: "postgres://default:Azy2srgWb9aU@ep-polished-cherry-55480419-pooler.us-east-1.postgres.vercel-storage.com/verceldb?sslmode=require"
});

export default async (req, res) => {
  if (req.method === 'POST') {
    const { uid, workoutTypes, location, frequency, genderPreference, gymAvailability, softPreferences } = req.body;

    const insertMatcherData = `
      INSERT INTO public.matcher ("Uid", frequency, "genderPreference", "workoutTypes", location, "gymAvailability", "softPreferences")
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;

    try {
      await pool.query(insertMatcherData, [uid, frequency, genderPreference, workoutTypes, location, gymAvailability, softPreferences]);
      res.status(200).send('Matcher data inserted successfully');
    } catch (error) {
      console.error('Error in inserting matcher data:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).end();
  }
};
