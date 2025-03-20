const Room = require("../models/Room");
const Hotel = require("../models/Hotel");

//@desc     Create rooms for a hotel
//@route    POST /api/v1/hotels/:hotelId/rooms
//@access   Private
exports.createRoom = async (req, res) => {
  try {
    req.body.hotel = req.params.hotelId;

    // Check if hotel exists
    const hotel = await Hotel.findById(req.params.hotelId);
    if (!hotel) {
      return res.status(404).json({ success: false, msg: "Hotel not found" });
    }

    // Create new room
    const room = await Room.create(req.body);

    res.status(201).json({
      success: true,
      data: room,
    });
  } catch (err) {
    res.status(400).json({ success: false, msg: err.message });
  }
};

//@desc     Get all rooms for a hotel
//@route    GET /api/v1/hotels/:hotelId/rooms
//@access   Public
exports.getRoomsByHotel = async (req, res) => {
  try {
    // First check if there is a hotel.
    const hotel = await Hotel.findById(req.params.hotelId);
    if (!hotel) {
      return res.status(404).json({
        success: false,
        msg: `No hotel found with ID ${req.params.hotelId}`,
      });
    }

    const rooms = await Room.find({ hotel: req.params.hotelId });

    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms,
    });
  } catch (err) {
    res.status(400).json({ success: false, msg: err.message });
  }
};



//@desc     Get rooms by query
//@route    GET /api/v1/hotels/rooms/capacity
//@access   Public
exports.getRoomsByCapacity = async (req, res) => {
  try {
    const { adults, children } = req.query;

    const adultCount = Number(adults) || 1; // Default at least 1 adult
    const childrenCount = Number(children) || 0; // Default 0 children

    if (
      isNaN(adultCount) ||
      isNaN(childrenCount) ||
      adultCount < 1 ||
      childrenCount < 0
    ) {
      return res
        .status(400)
        .json({ success: false, msg: "Invalid parameters" });
    }

    const rooms = await Room.find({
      "size_description.adults": { $gte: adultCount },
      "size_description.children": { $gte: childrenCount },
    }).populate({
      path: "hotel",
      select: "name", // Only select name and exclude _id
    });

    // Formatted to show hotel first
    const formattedRooms = rooms.map((room) => {
      return {
        hotel: {
          _id: room.hotel._id, // Keep the _id
          name: room.hotel.name, // Keep the name
        },
        ...room.toObject(),
      };
    });

    res.status(200).json({
      success: true,
      count: formattedRooms.length,
      data: formattedRooms,
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

//@desc     Update a room for a hotel
//@route    UPDATE /api/v1/hotels/:hotelId/rooms/:id
//@access   Private
exports.updateRoom = async (req, res, next) => {
  try {
    let room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ success: false, msg: "Room not found" });
    }

    // Ensure the room belongs to the correct hotel
    if (room.hotel.toString() !== req.params.hotelId) {
      return res.status(403).json({
        success: false,
        msg: "Room does not belong to this hotel",
      });
    }

    // Validate 'availableRooms' before updating
    if (req.body.availableRooms !== undefined) {
      if (req.body.availableRooms > room.totalRooms) {
        res.status(400).json({
          success: false,
          msg: "availableRooms must be less than or equal to totalRooms",
        });
      }
    }

    // Update the room
    room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: room });
  } catch (err) {
    res.status(400).json({ success: false, msg: err.message });
  }
};

//@desc     Delete a room for a hotel
//@route    DELETE /api/v1/hotels/:hotelId/rooms/:id
//@access   Private
exports.deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res
        .status(404)
        .json({ success: false, message: "Cannot find room to delete" });
    }

    // Ensure the room belongs to the correct hotel
    if (room.hotel.toString() !== req.params.hotelId) {
      return res.status(403).json({
        success: false,
        msg: "Room does not belong to this hotel",
      });
    }

    await Room.deleteOne({ _id: req.params.id });

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    return res.status(400).json({ success: false });
  }
};

