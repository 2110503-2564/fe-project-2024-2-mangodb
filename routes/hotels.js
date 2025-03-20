const express = require("express");
const {
  getHotels,
  getHotel,
  createHotel,
  updateHotel,
  deleteHotel,
} = require("../controllers/hotels.js");

//Include other resource routers
const bookingRouter = require("./bookings");
const ratingRouter = require("./ratings");
const roomRouter = require("./rooms");

const router = express.Router();

const { protect, authorize, checkHotelAdmin } = require("../middleware/auth");

//Re-route into other resource routers
router.use("/:hotelId/rooms/:roomId/bookings", bookingRouter);
router.use("/:hotelId/bookings", bookingRouter);
router.use("/:hotelId/ratings", ratingRouter);
router.use("/:hotelId/rooms", roomRouter);
router.use("/rooms", roomRouter);

router.route("/").get(getHotels).post(protect, authorize("admin"), createHotel);
router
  .route("/:hotelId")
  .get(getHotel)
  .put(protect, checkHotelAdmin, authorize("admin", "admin hotel"), updateHotel)
  .delete(protect, authorize("admin"), deleteHotel);

module.exports = router;
