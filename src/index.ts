import "dotenv/config"
import express from "express";
import db from "./configurations/db";

const app = express();

const PORT = process.env.PORT || 3000;

// Define a route for the root URL
app.get('/', async (req, res) => {
    const { rows } = await db.query('SELECT * FROM "User"');
    res.json(rows);
});

async function main() {
    await db.connect();

    // Start the server
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

main();