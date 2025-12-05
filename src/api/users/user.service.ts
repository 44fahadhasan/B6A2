import { JwtPayload } from "jsonwebtoken";
import { pool } from "../../config/db.js";

const getAllUsers = async () => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role FROM users`
  );

  return result.rows;
};

const updateUser = async (
  id: string,
  user: JwtPayload,
  payload: Record<string, unknown>
) => {
  const columns: string[] = [];
  const values: unknown[] = [];

  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined) continue;

    switch (key) {
      case "name":
      case "email":
      case "phone":
        columns.push(`${key} = $${columns.length + 1}`);
        values.push(value);
        break;

      case "role":
        if (user.role === "admin") {
          columns.push(`role = $${columns.length + 1}`);
          values.push(value);
        }
        break;

      default:
        break;
    }
  }

  if (!columns.length) return false;

  values.push(id);
  const idParam = `$${values.length}`;

  const result = await pool.query(
    `UPDATE users
     SET ${columns.join(", ")}
     WHERE id = ${idParam}
     RETURNING id, name, email, phone, role`,
    values
  );

  if (!result.rowCount) return null;

  return result.rows[0];
};

// todo: only if no active bookings exist
const deleteUser = async (id: string) => {
  const result = await pool.query(
    `DELETE FROM users
    WHERE id = $1`,
    [id]
  );

  if (!result.rowCount) return null;

  return result;
};

const userServices = {
  getAllUsers,
  updateUser,
  deleteUser,
};

export default userServices;
