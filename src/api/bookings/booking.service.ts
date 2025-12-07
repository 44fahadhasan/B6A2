import { JwtPayload } from "jsonwebtoken";
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

const getAllBookings = async (user: JwtPayload) => {
  if (user.role === "admin") {
    const result = await pool.query(
      `SELECT 
        book.id,
        book.customer_id,
        book.vehicle_id,
        TO_CHAR(book.rent_start_date, 'YYYY-MM-DD') AS rent_start_date,
        TO_CHAR(book.rent_end_date, 'YYYY-MM-DD') AS rent_end_date,
        book.total_price,
        book.status,
        u.name AS customer_name, 
        u.email AS customer_email,
        v.vehicle_name, 
        v.registration_number
      FROM bookings AS book
      JOIN users AS u ON book.customer_id = u.id
      JOIN vehicles AS v ON book.vehicle_id = v.id`
    );

    const bookings = result.rows.map((row) => ({
      id: row.id,
      customer_id: row.customer_id,
      vehicle_id: row.vehicle_id,
      rent_start_date: row.rent_start_date,
      rent_end_date: row.rent_end_date,
      total_price: Number(row.total_price),
      status: row.status,
      customer: {
        name: row.customer_name,
        email: row.customer_email,
      },
      vehicle: {
        vehicle_name: row.vehicle_name,
        registration_number: row.registration_number,
      },
    }));

    return bookings;
  } else {
    const result = await pool.query(
      `SELECT 
        book.id,
        book.vehicle_id,
        book.total_price,
        book.status,
        TO_CHAR(book.rent_start_date, 'YYYY-MM-DD') AS rent_start_date,
        TO_CHAR(book.rent_end_date, 'YYYY-MM-DD') AS rent_end_date,
        v.vehicle_name, v.registration_number, v.type
      FROM bookings AS book
      JOIN vehicles AS v ON book.vehicle_id = v.id
      WHERE book.customer_id=$1`,
      [user.id]
    );

    const bookings = result.rows.map((row) => ({
      id: row.id,
      vehicle_id: row.vehicle_id,
      rent_start_date: row.rent_start_date,
      rent_end_date: row.rent_end_date,
      total_price: Number(row.total_price),
      status: row.status,
      vehicle: {
        vehicle_name: row.vehicle_name,
        registration_number: row.registration_number,
        type: row.type,
      },
    }));

    return bookings;
  }
};

const updateBooking = async (id: string, status: string, user: JwtPayload) => {
  const bookingQry = await pool.query("SELECT * FROM bookings WHERE id=$1", [
    id,
  ]);

  if (!bookingQry.rowCount) {
    throw {
      statusCode: 404,
      message: "Booking not found",
    };
  }

  const booking = bookingQry.rows[0];

  if (status === "returned") {
    if (user.role !== "admin")
      throw {
        statusCode: 403,
        message: "Only admin can mark returned",
      };

    const vehicleRes = await pool.query(
      `UPDATE vehicles SET availability_status='available' WHERE id=$1 RETURNING availability_status`,
      [booking.vehicle_id]
    );

    booking.vehicle = {
      availability_status: vehicleRes.rows[0].availability_status,
    };
  }

  if (status === "cancelled") {
    if (user.role !== "customer" || user.id !== booking.customer_id)
      throw {
        statusCode: 403,
        message: "Forbidden",
      };

    if (new Date() >= new Date(booking.rent_start_date))
      throw {
        statusCode: 400,
        message: "You cannot cancel a booking that has already started",
      };

    await pool.query(
      `UPDATE vehicles SET availability_status='available' WHERE id=$1`,
      [booking.vehicle_id]
    );
  }

  const result = await pool.query(
    `UPDATE bookings SET status=$1 WHERE id=$2 RETURNING id, customer_id, vehicle_id, rent_start_date::TEXT, rent_end_date::TEXT, total_price, status`,
    [status, id]
  );

  if (status === "returned") {
    result.rows[0].vehicle = booking.vehicle;
  }

  return result.rows[0];
};

const bookingServices = {
  createBooking,
  getAllBookings,
  updateBooking,
};

export default bookingServices;
