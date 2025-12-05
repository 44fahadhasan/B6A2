import { pool } from "../../config/db.js";
import { compareHash, createHash } from "../../utils/hashedManager.js";
import { generateTokens } from "../../utils/token.js";

export const signup = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;

  const existUser = await pool.query(
    `SELECT email from users WHERE email = $1`,
    [email]
  );

  if (existUser.rowCount) return true;

  const hashed = await createHash(password as string);

  const result = await pool.query(
    `INSERT INTO users (name, email, password, phone, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [name, email, hashed, phone, role]
  );

  const { password: hashedPassword, ...rest } = result.rows[0];

  return rest;
};

export const login = async (payload: Record<string, unknown>) => {
  const { email, password } = payload as {
    email: string;
    password: string;
  };

  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);

  if (!result.rowCount) return null;

  const { password: hashedPassword, ...user } = result.rows[0];

  const isMatch = await compareHash(password, hashedPassword);

  if (!isMatch) return false;

  const token = generateTokens(user);

  return { token, user };
};
