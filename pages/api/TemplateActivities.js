import { Pool } from 'pg';

const pool = new Pool({
    connectionString: "postgres://default:Azy2srgWb9aU@ep-polished-cherry-55480419-pooler.us-east-1.postgres.vercel-storage.com/verceldb?sslmode=require"
});

export default async (req, res) => {
    if (req.method === 'POST') {
      try {
        const page = parseInt(req.body.page);
        const size = parseInt(req.body.size);
        const UID = req.body.uid;
        
        if (isNaN(page) || page < 0) {
          return res.status(400).json({ success: false, message: 'Invalid page number' });
        }
        if (isNaN(size) || size <= 0) {
          return res.status(400).json({ success: false, message: 'Invalid page size' });
        }        


      // SQL query with pagination
      const OLDpaginatedHistory = `
        SELECT *
        FROM activity
        ORDER BY activity."Date" DESC
        LIMIT $2 OFFSET $1;
      `;

      const paginatedHistory = `
      SELECT a.*,
        CASE 
            WHEN f.accepted = 1 THEN ud.name
            ELSE NULL
        END as friend_name
      FROM activity a
      LEFT JOIN friend f ON (f."Sender" = a."Uid" OR f."Receiver" = a."Uid") AND (f."Sender" = $3 OR f."Receiver" = $3) AND f.accepted = 1
      LEFT JOIN user_data ud ON (a."Uid" = ud.uid)
      WHERE (a."Favorite" > 0) OR (a."Favorite" < 0 AND (f."Sender" IS NOT NULL OR f."Receiver" IS NOT NULL))
      ORDER BY a."Date" DESC
      LIMIT $2 OFFSET $1;
      `;

      // Calculate the offset
      const offset = page * size;
      console.log(`Page Number: ${page}, Page Size: ${size}, Offset: ${offset}`);

      // Execute the query
      const results = await pool.query(paginatedHistory, [offset, size, UID]);

      res.json({ success: true, data: results.rows});
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
};
