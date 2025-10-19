import { BigQuery } from "@google-cloud/bigquery";

export default async function handler(req, res) {
  try {
    const bigquery = new BigQuery({
      projectId: process.env.PROJECT_ID,
      credentials: JSON.parse(process.env.BIGQUERY_KEY),
    });

    const [tables] = await bigquery.dataset('final-1b6f0_analytics_496706219').getTables();
    console.log("Tables:", tables.map(t => t.id));

    res.status(200).json({ tables: tables.map(t => t.id) });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
}
