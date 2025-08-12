// netlify/functions/birthdays.js

const { Pool } = require('pg');

// Use the DATABASE_URL from Netlify's environment variables
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
});

// This is the main function Netlify will run
exports.handler = async (event, context) => {
  // Determine the HTTP method (GET, POST, DELETE)
  const httpMethod = event.httpMethod;
  // Get the ID from the path, if it exists (e.g., /api/birthdays/123)
  const id = event.path.split('/').pop();

  // --- HANDLE GET REQUESTS ---
  if (httpMethod === 'GET') {
    try {
      const { rows } = await pool.query('SELECT * FROM birthdays ORDER BY name;');
      return {
        statusCode: 200,
        body: JSON.stringify(rows),
      };
    } catch (error) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Failed to fetch birthdays' }) };
    }
  }

  // --- HANDLE POST REQUESTS ---
  if (httpMethod === 'POST') {
    try {
      const { name, email, date } = JSON.parse(event.body);
      const query = 'INSERT INTO birthdays (name, email, date) VALUES ($1, $2, $3) RETURNING *;';
      const { rows } = await pool.query(query, [name, email, date]);
      return {
        statusCode: 201, // 201 Created
        body: JSON.stringify(rows[0]),
      };
    } catch (error) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Failed to create birthday' }) };
    }
  }

  // --- HANDLE DELETE REQUESTS ---
  if (httpMethod === 'DELETE') {
    try {
      // Ensure we have an ID to delete
      if (!id || id === 'birthdays') {
        return { statusCode: 400, body: JSON.stringify({ error: 'Missing birthday ID' }) };
      }
      const query = 'DELETE FROM birthdays WHERE id = $1;';
      await pool.query(query, [id]);
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Birthday deleted' }),
      };
    } catch (error) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Failed to delete birthday' }) };
    }
  }

  // If the method is not supported
  return {
    statusCode: 405,
    body: JSON.stringify({ error: 'Method Not Allowed' }),
  };
};
// --- HANDLE POST REQUESTS ---
if (httpMethod === 'POST') {
  try {
    const { name, email, date } = JSON.parse(event.body);

    // ✅ VERIFY THIS LINE IS EXACTLY CORRECT
    const query = 'INSERT INTO birthdays (name, email, date) VALUES ($1, $2, $3) RETURNING *;';

    const { rows } = await pool.query(query, [name, email, date]);
    return {
      statusCode: 201, // 201 Created
      body: JSON.stringify(rows[0]),
    };
  } catch (error) {
    // The real error will be logged in Netlify
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to create birthday' }) };
  }
}