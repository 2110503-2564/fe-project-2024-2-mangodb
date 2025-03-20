const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Hotel = require("../models/Hotel");
const Room = require("../models/Room");

//Protect routes
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  //Make sure token exists
  if (!token || token === "null") {
    return res
      .status(401)
      .json({ success: false, msg: "Not authorized to access this route" });
  }

  try {
    //Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decoded);

    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    console.error(err.stack);
    return res
      .status(401)
      .json({ success: false, msg: "Not authorized to access this route" });
  }
};

//Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        msg: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
  };
};

exports.checkHotelAdmin = async (req, res, next) => {
  try {
    // If the user is "admin hotel", then check if the hotelId matches
    if (req.user.role === "admin hotel") {
      // Ensure user and hotelId are defined
      if (!req.user || !req.user.hotelId) {
        return res.status(400).json({
          success: false,
          msg: "Hotel ID not available for this user",
        });
      }

      const adminHotelId = req.user.hotelId;
      const targetHotelId = req.params.hotelId;

      if (!targetHotelId) {
        return res
          .status(400)
          .json({ success: false, msg: "Missing hotel ID" });
      }

      // Check if the user's hotelId value matches the hotelId value you want to edit.
      if (adminHotelId.toString() !== targetHotelId.toString()) {
        console.log(adminHotelId);
        return res.status(403).json({
          success: false,
          msg: "Access denied: You are not the admin of this hotel",
        });
      }
    }

    next(); // Passed the inspection and can continue.
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};
