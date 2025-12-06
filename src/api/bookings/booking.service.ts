import { pool } from "../../config/db";

const createBooking = async (payload: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  const start = new Date(rent_start_date as string);
  const end = new Date(rent_end_date as string);

  if (end <= start) {
    throw {
      statusCode: 400,
      message: "End date must be after start date",
    };
  }

  const customerQry = await pool.query(`SELECT id FROM users WHERE id = $1`, [
    customer_id,
  ]);

  if (!customerQry.rowCount) {
    throw {
      statusCode: 404,
      message: "Customer not found",
    };
  }

  const vehicleQry = await pool.query(
    `SELECT vehicle_name, daily_rent_price, availability_status FROM vehicles WHERE id = $1`,
    [vehicle_id]
  );

  if (!vehicleQry.rowCount) {
    throw {
      statusCode: 404,
      message: "Vehicle not found",
    };
  }

  const vehicle = vehicleQry.rows[0];

  if (vehicle.availability_status !== "available") {
    throw {
      statusCode: 400,
      message: "Vehicle is not available for booking",
    };
  }

  const duration = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );

  const totalPrice = duration * Number(vehicle.daily_rent_price);

  const result = await pool.query(
    `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES ($1, $2, $3, $4, $5, 'active') RETURNING id, customer_id, vehicle_id, rent_start_date::TEXT, rent_end_date::TEXT, total_price, status`,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, totalPrice]
  );

  await pool.query(
    `UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`,
    [vehicle_id]
  );

  const booking = result.rows[0];

  return {
    id: booking.id,
    customer_id: booking.customer_id,
    vehicle_id: booking.vehicle_id,
    rent_start_date: booking.rent_start_date,
    rent_end_date: booking.rent_end_date,
    total_price: Number(booking.total_price),
    status: booking.status,
    vehicle: {
      vehicle_name: vehicle.vehicle_name,
      daily_rent_price: Number(vehicle.daily_rent_price),
    },
  };
};

const bookingServices = { createBooking };

export default bookingServices;
