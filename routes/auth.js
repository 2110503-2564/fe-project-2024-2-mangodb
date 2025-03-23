const express = require("express");

const {
  register,
  login,
  getMe,
  logout,
  getUser,
  updateMe,
} = require("../controllers/auth");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.get("/logout", logout);
router.get("/:id", protect, authorize("admin"), getUser);
router.patch("/me", protect, updateMe);

module.exports = router;
