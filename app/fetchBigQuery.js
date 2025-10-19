import { BigQuery } from "@google-cloud/bigquery";

export default async function handler(req, res) {
  try {
    const bigquery = new BigQuery({
      projectId: process.env.PROJECT_ID,
      credentials: JSON.parse(process.env.BIGQUERY_KEY),
    });

    // Hardcoded latest table name for testing
    const query = `
      SELECT *
      FROM \`final-1b6f0_analytics_496706219.events_20251018\`
      LIMIT 5
    `;

    const [rows] = await bigquery.query(query);

    console.log("Rows fetched:", rows.length);
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
