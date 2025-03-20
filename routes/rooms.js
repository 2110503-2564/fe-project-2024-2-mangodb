const express = require("express");
const {
  getRoomsByHotel,
  createRoom,
  getRoomsByCapacity,
  deleteRoom,
  updateRoom,
} = require("../controllers/rooms");

const router = express.Router({ mergeParams: true });

const { protect, authorize, checkHotelAdmin } = require("../middleware/auth");

router
  .route("/")
  .get(getRoomsByHotel)
  .post(protect, checkHotelAdmin, authorize("admin", "admin hotel"), createRoom);
router.route("/capacity").get(getRoomsByCapacity);
router
  .route("/:id")
  .delete(protect, checkHotelAdmin, authorize("admin", "admin hotel"), deleteRoom)
  .put(protect, checkHotelAdmin, authorize("admin", "admin hotel"), updateRoom);

module.exports = router;
