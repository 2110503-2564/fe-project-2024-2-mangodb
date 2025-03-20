const Hotel = require("../models/Hotel");
const Booking = require("../models/Booking");
const Rating = require("../models/Rating");
const Room = require("../models/Room");

//@desc     Get all hotels
//@route    GET /api/v1/hotels
//@access   Public
exports.getHotels = async (req, res, next) => {
  try {
    let query;

    //Copy req.query
    const reqQuery = { ...req.query };

    //Fields to exclude
    const removeFields = ["select", "sort", "page", "limit"];

    //Loop over removeFields and delete them from reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);
    console.log(reqQuery);

    //create query string
    let queryStr = JSON.stringify(reqQuery);

    //create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(
      /\bgt|gte|lt|lte|in\b/g,
      (match) => `$${match}`
    );

    //Finding resource
    query = Hotel.find(JSON.parse(queryStr));

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
    const total = await Hotel.countDocuments();

    query = query.skip(startIndex).limit(limit);

    //Executing query
    const hotels = await query;

    // Fetch ratings for each hotel
    const hotelsWithRatings = await Promise.all(
      hotels.map(async (hotel) => {
        const result = await Rating.aggregate([
          { $match: { hotel: hotel._id } },
          { $group: { _id: "$hotel", averageRating: { $avg: "$rating" } } },
        ]);
        hotel = hotel.toObject();
        hotel = {
          averageRating: result.length
            ? parseFloat(result[0].averageRating.toFixed(1))
            : 0,
          ...hotel,
        };
        return hotel;
      })
    );

    // Custom sorting for averageRating
    if (req.query.sort && req.query.sort.includes("averageRating")) {
      const sortOrder = req.query.sort.startsWith("-") ? -1 : 1;
      hotelsWithRatings.sort(
        (a, b) => (a.averageRating - b.averageRating) * sortOrder
      );
    }

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

    const modifiedHotels = hotelsWithRatings.map((hotel) => {
      const hotelData = { ...hotel };
      const { _id, __v, ...rest } = hotelData; // Remove _id and spread rest of the data
      return {
        id: _id.toString(),
        ...rest, // Spread the rest of the properties
      };
    });

    res.status(200).json({
      success: true,
      count: modifiedHotels.length,
      pagination,
      data: modifiedHotels,
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//@desc     Get single hotel
//@route    GET /api/v1/hotels/:hotelId
//@access   Public
exports.getHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.hotelId);

    if (!hotel) {
      return res.status(400).json({ success: false });
    }

    // Calculate average rating
    const result = await Rating.aggregate([
      { $match: { hotel: hotel._id } },
      { $group: { _id: "$hotel", averageRating: { $avg: "$rating" } } },
    ]);

    const averageRating = result.length
      ? parseFloat(result[0].averageRating.toFixed(1))
      : 0;

    const hotelData = hotel.toObject();
    delete hotelData._id;
    delete hotelData.__v;

    const response = {
      id: hotel._id.toString(),
      averageRating,
      ...hotelData,
    };

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//@desc     Create new hotel
//@route    POST /api/v1/hotels
//@access   Private
exports.createHotel = async (req, res, next) => {
  const hotel = await Hotel.create(req.body);

  const hotelData = hotel.toObject();
  delete hotelData._id;
  delete hotelData.__v;

  const response = {
    id: hotel._id.toString(),
    ...hotelData,
  };

  res.status(201).json({
    success: true,
    data: response,
  });
};

//@desc     Update hotel
//@route    PUT /api/v1/hotels/:hotelId
//@access   Private
exports.updateHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.hotelId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!hotel) {
      res.status(400).json({ success: false });
    }

    const hotelData = hotel.toObject();
    delete hotelData._id;
    delete hotelData.__v;

    const response = {
      id: hotel._id.toString(),
      ...hotelData,
    };

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
};

//@desc     Delete hotel
//@route    DELETE /api/v1/hotels/:hotelId
//@access   Private
exports.deleteHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.hotelId);

    if (!hotel) {
      res.status(404).json({
        success: false,
        msg: `Hotel not found with id ${req.params.hotelId}`,
      });
    }

    await Booking.deleteMany({ hotel: req.params.hotelId });
    await Rating.deleteMany({ hotel: req.params.hotelId });
    await Room.deleteMany({ hotel: req.params.hotelId });
    await Hotel.deleteOne({ _id: req.params.hotelId });

    res.status(200).json({ success: true, msg: "Delete Successful!!" });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};
