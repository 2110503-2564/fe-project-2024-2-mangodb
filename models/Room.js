const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  size_description: {
    adults: {
      type: Number,
      required: true,
      min: 1,
    },
    children: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  totalRooms: {
    type: Number,
    required: true,
    min: 1,
  },
  availableRooms: {
    type: Number,
    required: true,
    min: 0,
  },
  pricePerNight: {
    type: Number,
    required: true,
  },
  imgSrc: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Room", RoomSchema);
