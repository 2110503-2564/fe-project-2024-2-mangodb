const express = require("express");
const {
  getRatings,
  addRating,
  updateRating,
  deleteRating,
} = require("../controllers/ratings");

const { protect, authorize } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getRatings)
  .post(protect, authorize("admin", "user"), addRating)
  .put(protect, authorize("admin", "user"), updateRating)
  .delete(protect, authorize("admin", "user"), deleteRating);

module.exports = router;
