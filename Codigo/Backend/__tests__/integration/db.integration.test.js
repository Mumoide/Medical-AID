const db = require('../../dbtest'); // Import the modified db.js

describe('Database Integration Test', () => {
    let client;

    beforeAll(async () => {
        // Explicitly connect to the database
        client = await db.connect();
        console.log('Connected to the test database');
    });

    afterAll(async () => {
        try {
            // Release the database client
            if (client) {
                client.release();
                console.log('Database client released');
            }
        } finally {
            // Ensure the pool is ended
            await db.end();
            console.log('Database connection pool closed');
        }
    });

    it('should connect to the database and execute a query', async () => {
        let result;
        try {
            result = await db.query('SELECT NOW()');
            expect(result.rows).not.toBeNull();
        } catch (error) {
            console.error('Error executing query:', error);
            throw error;
        }
    });
});
