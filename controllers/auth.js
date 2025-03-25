const User = require("../models/User");
const mongoose = require("mongoose");

// @desc    Register a user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, tel, email, password, role, hotelId } = req.body;

    if (role === "admin hotel" && !hotelId) {
      return res.status(400).json({
        success: false,
        msg: "Hotel ID is required for admin hotel",
      });
    }

    const convertedHotelId =
      role === "admin hotel" ? new mongoose.Types.ObjectId(hotelId) : undefined;

    // ✅ ตรวจสอบว่า email ซ้ำหรือไม่
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        msg: "This Email is already exist.",
      });
    }

    // ✅ ตรวจสอบว่า username ซ้ำหรือไม่
    const existingUsername = await User.findOne({ name });
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        msg: "This Username is already exist.",
      });
    }

    // ✅ Create user ถ้าไม่มีซ้ำ
    const user = await User.create({
      name,
      tel,
      email,
      password,
      role,
      hotelId: convertedHotelId,
    });

    // ✅ ส่ง token กลับ
    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ success: false, msg: "Server Error" });
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //Validate email & password
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, msg: "Please provide email and password" });
    }

    //Check for user
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      res.status(400).json({ success: false, msg: "Invalid credentials" });
    }

    //Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      res.status(400).json({ success: false, msg: "Invalid credentials" });
    }

    //Create token
    // const token = user.getSignedJwtToken();
    // res.status(200).json({ success: true, token });
    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(401).json({
      success: false,
      msg: "Cannot convert email or password to string",
    });
  }
};

//Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  //Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};

//@desc     Get current logged in user
//@route    GET /api/v1/auth/me
//@access   Private
exports.getMe = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, data: user });
};

// @desc    Log user out / clear cookie
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ success: true, msg: "Logout Successful!!" });
};

//@desc     Get other user
//@route    GET /api/v1/auth/:id
//@access   Private
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.log(error);
  }
};

// @desc    Update Me
// @route   PATCH /api/v1/auth/me
// @access  Private
exports.updateMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    const fieldsToUpdate = {};

    if (req.body.name !== null && req.body.name !== undefined) {
      const nameExists = await User.findOne({ name: req.body.name });
      if (nameExists && nameExists._id.toString() !== req.user.id) {
        return res.status(400).json({
          success: false,
          msg: "The name you entered is already taken. Please choose a different name.",
        });
      }
      fieldsToUpdate.name = req.body.name;
    } else {
      fieldsToUpdate.name = user.name;
    }

    if (req.body.tel !== null && req.body.tel !== undefined) {
      const telExists = await User.findOne({ tel: req.body.tel });
      if (telExists && telExists._id.toString() !== req.user.id) {
        return res.status(400).json({
          success: false,
          msg: "The phone number you entered is already taken. Please choose a different phone number.",
        });
      }
      fieldsToUpdate.tel = req.body.tel;
    } else {
      fieldsToUpdate.tel = user.tel;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    res.status(400).json({ success: false, msg: "Unable to update profile" });
    console.log(error);
  }
};
