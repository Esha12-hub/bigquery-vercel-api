import { BigQuery } from "@google-cloud/bigquery";

export default async function handler(req, res) {
  try {
    const { writerId } = req.query; // get writer ID from request

    if (!writerId) {
      return res.status(400).json({ error: 'writerId is required' });
    }

    const bigquery = new BigQuery({
      projectId: process.env.PROJECT_ID,
      credentials: JSON.parse(process.env.BIGQUERY_KEY),
    });

    // Use writerId in query to fetch only relevant data
    const query = `
      SELECT *
      FROM \`your-dataset.analytics_table\`
      WHERE writer_id = @writerId
      ORDER BY timestamp DESC
      LIMIT 50
    `;

    const options = {
      query: query,
      params: { writerId: writerId },
    };

    const [rows] = await bigquery.query(options);
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}

