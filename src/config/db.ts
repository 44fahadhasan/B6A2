import { Pool } from "pg";
import config from ".";

export const pool = new Pool({
  connectionString: config.connection_string,
});

const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL CHECK (email = LOWER(email)),
      password VARCHAR(200) NOT NULL CHECK (LENGTH(password) >= 6),
      phone VARCHAR(11) NOT NULL,
      role VARCHAR(10) NOT NULL CHECK (role IN ('admin', 'customer'))
    );
  `);
};

export default initDB;
