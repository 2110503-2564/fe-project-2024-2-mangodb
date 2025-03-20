const Booking = require("../models/Booking");
const Hotel = require("../models/Hotel");
const Room = require("../models/Room");

//@desc     Get all bookings
//@route    GET /api/v1/bookings
//@access   Public
exports.getBookings = async (req, res, next) => {
  try {
    if (req.params.hotelId) {
      // First check if there is a hotel.
      const hotel = await Hotel.findById(req.params.hotelId);
      if (!hotel) {
        return res.status(404).json({
          success: false,
          msg: `No hotel found with ID ${req.params.hotelId}`,
        });
      }
    }

    let query;

    //Copy req.query
    const reqQuery = { ...req.query };

    //Fields to exclude
    const removeFields = ["select", "sort", "page", "limit"];

    //Loop over removeFields and delete them from reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);
    console.log(reqQuery);

    //Create query string
    let queryStr = JSON.stringify(reqQuery);

    //Convert operators ($gt, $gte, etc.)
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    //Finding resource
    if (req.user.role !== "admin") {
      query = Booking.find({
        user: req.user.id,
        ...JSON.parse(queryStr),
      }).populate({
        path: "hotel",
        select: "name tel",
      });
    } else {
      if (req.params.hotelId) {
        query = Booking.find({
          hotel: req.params.hotelId,
          ...JSON.parse(queryStr),
        }).populate({
          path: "hotel",
          select: "name tel",
        });
      } else {
        query = Booking.find(JSON.parse(queryStr)).populate({
          path: "hotel",
          select: "name tel",
        });
      }
    }

    //Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      query = query.select(fields);
    }

    //Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    //Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Booking.countDocuments();

    query = query.skip(startIndex).limit(limit);

    //Executing query
    const bookings = await query;

    //Pagination result
    const pagination = {};
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: bookings.length,
      pagination,
      data: bookings,
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//@desc     Get single booking
//@route    GET /api/v1/bookings/:id
//@access   Public
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate({
      path: "hotel",
      select: "name tel",
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        msg: `No booking with the id of ${req.params.id}`,
      });
    }

    // Check if the booking belongs to the logged-in user
    if (req.user.role !== "admin" && booking.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        msg: "You are not authorized to view this booking",
      });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, msg: "Cannot find Booking" });
  }
};

//@desc     Add booking
//@route    POST /api/v1/hotels/:hotelId/rooms/:roomId/bookings
//@access   Private
exports.addBooking = async (req, res, next) => {
  try {
    const { hotelId, roomId } = req.params;
    const { checkInDate, checkOutDate } = req.body;
    const userId = req.user.id;

    req.body.hotel = hotelId;
    req.body.room = roomId;
    req.body.user = userId;

    // Find the room and hotel
    const hotel = await Hotel.findById(hotelId);
    const room = await Room.findById(roomId);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        msg: `No hotel with the id of ${hotelId}`,
      });
    }

    if (!room) {
      return res.status(404).json({
        success: false,
        msg: `No room with the id of ${roomId}`,
      });
    }

    // Ensure the room belongs to the hotel
    if (room.hotel.toString() !== hotelId) {
      return res.status(403).json({
        success: false,
        msg: "Room does not belong to this hotel",
      });
    }

    if (req.user.role !== "admin") {
      // Prevent booking for past dates
      if (new Date(checkInDate) < new Date()) {
        return res.status(400).json({
          success: false,
          msg: "Cannot book past dates.",
        });
      }
    }

    // Ensure check-out is later than check-in
    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      return res.status(400).json({
        success: false,
        msg: "checkOutDate must be later than checkInDate",
      });
    }

    // If the user is not an admin, they can only bookings up to 3 nights
    if (req.user.role !== "admin") {
      const nights =
        (new Date(checkOutDate) - new Date(checkInDate)) /
        (24 * 60 * 60 * 1000);

      if (nights > 3) {
        return res.status(400).json({
          success: false,
          msg: "Booking denied. You can only book up to 3 nights.",
        });
      }
    }

    // Check if the room has available slots
    const updatedRoom = await Room.findOneAndUpdate(
      { _id: roomId, availableRooms: { $gt: 0 } }, // Ensure rooms are available
      { $inc: { availableRooms: -1 } }, // Decrease availability atomically
      { new: true }
    );

    if (!updatedRoom) {
      return res
        .status(400)
        .json({ success: false, msg: "No available rooms for this category." });
    }

    // Create booking
    const booking = await Booking.create(req.body);

    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, msg: "Cannot create Booking" });
  }
};

//@desc     Update booking
//@route    PUT /api/v1/bookings/:id
//@access   Private
exports.updateBooking = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        msg: `No booking with the id of ${req.params.id}`,
      });
    }

    //Make sure user is the booking owner
    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        msg: `User ${req.user.id} is not authorized to update this booking`,
      });
    }

    const now = new Date();
    let { checkInDate, checkOutDate } = req.body;

    if (checkInDate || checkOutDate) {
      checkInDate = checkInDate
        ? new Date(checkInDate)
        : new Date(booking.checkInDate);
      checkOutDate = checkOutDate
        ? new Date(checkOutDate)
        : new Date(booking.checkOutDate);

      // Check if update booking is before checkInDate
      if (req.user.role !== "admin" && checkInDate < now) {
        return res.status(400).json({
          succes: false,
          message: "User can only delete booking before check in",
        });
      }

      // Ensure check-out is later than check-in
      if (checkOutDate <= checkInDate) {
        return res.status(400).json({
          success: false,
          msg: "checkOutDate must be later than checkInDate",
        });
      }

      // If the user is not an admin, they can only bookings up to 3 nights.
      if (req.user.role !== "admin") {
        const nights = (checkOutDate - checkInDate) / (24 * 60 * 60 * 1000);
        if (nights > 3) {
          return res.status(400).json({
            success: false,
            msg: "Booking denied. You can only book up to 3 nights.",
          });
        }
      }
    }

    booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, msg: "Cannot update Booking" });
  }
};

//@desc     Delete booking
//@route    DELETE /api/v1/bookings/:id
//@access   Private
exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        msg: `No booking with the id of ${req.params.id}`,
      });
    }

    //Make sure user is the booking owner
    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        msg: `User ${req.user.id} is not authorized to delete this booking`,
      });
    }

    // Check if delete booking is before checkInDate
    if (req.user.role !== "admin") {
      if (new Date() > new Date(booking.checkInDate)) {
        return res.status(400).json({
          succes: false,
          message: "User can only delete booking before check in",
        });
      }
    }

    // If this booking being deleted, we increase the number of available room by 1
    const room = await Room.findById(booking.room);

    if (room) {
      room.availableRooms += 1;
      await room.save();
    }

    await booking.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, msg: "Cannot delete Booking" });
  }
};
