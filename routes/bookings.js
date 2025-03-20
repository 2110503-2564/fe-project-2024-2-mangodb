const express = require("express");
const {
  getBookings,
  getBooking,
  addBooking,
  updateBooking,
  deleteBooking,
} = require("../controllers/bookings");

const router = express.Router({ mergeParams: true });

const { protect, authorize, checkHotelAdmin } = require("../middleware/auth");

router
  .route("/")
  .get(protect, authorize("admin", "user", "admin hotel"), getBookings)
  .post(
    protect,
    checkHotelAdmin,
    authorize("admin", "user", "admin hotel"),
    addBooking
  );
router
  .route("/:id")
  .get(protect, getBooking)
  .put(
    protect,
    checkHotelAdmin,
    authorize("admin", "user", "admin hotel"),
    updateBooking
  )
  .delete(
    protect,
    checkHotelAdmin,
    authorize("admin", "user", "admin hotel"),
    deleteBooking
  );

module.exports = router;
