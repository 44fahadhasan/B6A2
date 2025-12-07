import { pool } from "../../config/db.js";
import { generateId } from "../../utils/helper.js";

const createVehicle = async (payload: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  const uniqueRegNum = registration_number || generateId();

  const result = await pool.query(
    `INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`,
    [vehicle_name, type, uniqueRegNum, daily_rent_price, availability_status]
  );

  return result.rows[0];
};

const getAllVehicles = async () => {
  const result = await pool.query(`SELECT * FROM vehicles`);

  if (!result.rows.length) return result.rows;

  return result.rows;
};

const getVehicle = async (id: string) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [id]);

  if (!result.rowCount) return null;

  return result.rows[0];
};

const updateVehicle = async (id: string, payload: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  const result = await pool.query(
    `UPDATE vehicles
  SET
    vehicle_name = COALESCE($1, vehicle_name),
    type = COALESCE($2, type),
    registration_number = COALESCE($3, registration_number),
    daily_rent_price = COALESCE($4, daily_rent_price),
    availability_status = COALESCE($5, availability_status)
  WHERE id = $6
  RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
      id,
    ]
  );

  if (!result.rowCount) return null;

  return result.rows[0];
};

const deleteVehicle = async (id: string) => {
  const booking = await pool.query(
    `SELECT availability_status FROM vehicles WHERE id = $1`,
    [id]
  );

  if (booking.rowCount && booking.rows[0].availability_status === "booked") {
    return true;
  }

  if (!booking.rowCount) return null;

  const result = await pool.query(
    `DELETE FROM vehicles
    WHERE id = $1`,
    [id]
  );

  return result;
};

const vehicleServices = {
  createVehicle,
  getAllVehicles,
  getVehicle,
  updateVehicle,
  deleteVehicle,
};

export default vehicleServices;
