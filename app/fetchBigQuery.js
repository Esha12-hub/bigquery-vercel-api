import { BigQuery } from "@google-cloud/bigquery";

export default async function handler(req, res) {
  try {
    const writerId = req.query.writerId || 'test_writer';
    const bigquery = new BigQuery({
      projectId: process.env.PROJECT_ID,
      credentials: JSON.parse(process.env.BIGQUERY_KEY),
    });

    // Get all tables in the dataset
    const [tables] = await bigquery.dataset('final-1b6f0_analytics_496706219').getTables();

    if (tables.length === 0) {
      return res.status(404).json({ error: 'No tables found' });
    }

    // Pick latest table
    const latestTable = tables
      .sort((a, b) => new Date(b.metadata.creationTime) - new Date(a.metadata.creationTime))[0];

    // Query the latest table
    const query = `
      SELECT *
      FROM \`final-1b6f0_analytics_496706219.${latestTable.id}\`
      WHERE writer_id = @writerId
      LIMIT 50
    `;
    const options = { query, params: { writerId } };
    const [rows] = await bigquery.query(options);

    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
