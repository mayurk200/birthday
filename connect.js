// connect.js

// Import the Pool class from the pg library
const { Pool } = require('pg');

// ❗ Paste your Neon connection string here
const connectionString ='postgresql://neondb_owner:npg_GnbEjycp8i1T@ep-frosty-meadow-aepegj8o-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

// Create a new Pool instance.
// The Pool manages a dynamic set of connections to the database.
const pool = new Pool({
    connectionString: connectionString,
});

// An async function to test the connection and run a query.
async function testConnection() {
    let client; // This will hold our connection
    try {
        console.log('Connecting to the database...');
        // Get a client from the connection pool
        client = await pool.connect(); 
        
        console.log('✅ Connection successful!');

        // Run a simple query to get the current time from the database
        const result = await client.query('SELECT NOW()');
        console.log('Current time from DB:', result.rows[0].now);

    } catch (error) {
        // If there is an error, log it to the console
        console.error('❌ Connection failed!', error.stack);
    } finally {
        // This block will always run, whether there was an error or not.
        if (client) {
            // Release the client back to the pool
            client.release();
            console.log('Client released.');
        }
        // End the pool, closing all remaining connections.
        await pool.end();
        console.log('Pool has ended.');
    }
}

// Call the function to run the test
testConnection();