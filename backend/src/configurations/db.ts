import { Client } from 'pg';

// PostgreSQL connection configuration
// DATABASE_URL = "postgres://<username>:<password>@localhost:5432/<database_name>"
const db = new Client(process.env.DATABASE_URL);

export default db;
