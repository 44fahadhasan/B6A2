import cron from "node-cron";
import { pool } from "../config/db";

const autoReturnCron = cron.schedule("* * * * *", async () => {
  try {
    const result = await pool.query(
      `SELECT id, vehicle_id, rent_end_date FROM bookings WHERE status='active'`
    );

    if (!result.rowCount) return;

    const currentDate = new Date();

    for (const booking of result.rows) {
      if (new Date(booking.rent_end_date) < currentDate) {
        await pool.query(`UPDATE bookings SET status='returned' WHERE id=$1`, [
          booking.id,
        ]);

        await pool.query(
          `UPDATE vehicles SET availability_status='available' WHERE id=$1`,
          [booking.vehicle_id]
        );
      }
    }
  } catch (err) {
    console.error("Cron error:", err);
  }
});

export default autoReturnCron;
