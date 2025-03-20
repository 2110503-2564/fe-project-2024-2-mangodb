const mongoose = require("mongoose");
const Rating = require("../models/Rating");
const Hotel = require("../models/Hotel");
const Booking = require("../models/Booking");

// @desc     Get ratings for a hotel
// @route    GET /api/v1/hotels/:hotelId/ratings
// @access   Public
exports.getRatings = async (req, res) => {
  try {
    // First check if there is a hotel.
    const hotel = await Hotel.findById(req.params.hotelId);
    if (!hotel) {
      return res.status(404).json({
        success: false,
        msg: `No hotel found with ID ${req.params.hotelId}`,
      });
    }

    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude from query
    const removeFields = ["select", "sort", "page", "limit"];
    removeFields.forEach((param) => delete reqQuery[param]);

    // Create query string and replace MongoDB operators
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(
      /\bgt|gte|lt|lte|in\b/g,
      (match) => `$${match}`
    );

    // Create base query (filter by hotelId)
    query = Rating.find({ hotel: req.params.hotelId, ...JSON.parse(queryStr) })
      .populate("user", "name")
      .sort("-createdAt");

    // Select specific fields
    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      query = query.select(fields);
    }

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Rating.countDocuments({ hotel: req.params.hotelId });

    query = query.skip(startIndex).limit(limit);

    // Execute query
    const ratings = await query;

    // Calculate average rating using aggregation
    const result = await Rating.aggregate([
      { $match: { hotel: new mongoose.mongo.ObjectId(req.params.hotelId) } },
      { $group: { _id: "$hotel", averageRating: { $avg: "$rating" } } },
    ]);

    const averageRating = result.length
      ? parseFloat(result[0].averageRating.toFixed(1))
      : 0;

    // Pagination result
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
      count: ratings.length,
      averageRating,
      pagination,
      data: ratings,
    });
  } catch (err) {
    console.error("Error in getRatings:", err);
    res.status(500).json({ success: false, msg: "Cannot fetch ratings" });
  }
};

// @desc     Add rating to hotel
// @route    POST /api/v1/hotels/:hotelId/ratings
// @access   Private
exports.addRating = async (req, res) => {
  try {
    req.body.hotel = req.params.hotelId;
    req.body.user = req.user.id;

    // Check if the hotel exists
    const hotel = await Hotel.findById(req.params.hotelId);
    if (!hotel) {
      return res.status(404).json({ success: false, msg: "Hotel not found" });
    }

    // Check if the user has a completed booking for this hotel
    const booking = await Booking.findOne({
      hotel: req.params.hotelId,
      user: req.user.id,
      checkOutDate: { $lt: new Date() }, // Ensures booking is in the past
    });

    if (!booking) {
      return res.status(403).json({
        success: false,
        msg: "You can only review a hotel after your stay",
      });
    }

    // Check if the user has already rated this hotel
    const existingRating = await Rating.findOne({
      hotel: req.params.hotelId,
      user: req.user.id,
    });

    if (existingRating) {
      return res.status(400).json({
        success: false,
        msg: "You have already rated this hotel. Use update instead.",
      });
    }

    // Create a new rating
    const rating = await Rating.create(req.body);

    res.status(201).json({ success: true, data: rating });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Cannot add rating" });
  }
};

// @desc     Update rating for a hotel
// @route    PUT /api/v1/hotels/:hotelId/ratings
// @access   Private
exports.updateRating = async (req, res) => {
  try {
    // Find if the user has already rated this hotel
    let rating = await Rating.findOne({
      hotel: req.params.hotelId,
      user: req.user.id,
    });

    if (!rating) {
      return res.status(404).json({
        success: false,
        msg: "No rating found for this hotel by this user",
      });
    }

    // Update the rating and review
    rating.rating = req.body.rating || rating.rating;
    rating.review = req.body.review || rating.review;
    await rating.save();

    res.status(200).json({
      success: true,
      data: rating,
      msg: "Rating updated successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Cannot update rating" });
  }
};

// @desc     Delete rating
// @route    DELETE /api/v1/hotels/:hotelId/ratings
// @access   Private
exports.deleteRating = async (req, res) => {
  try {
    const rating = await Rating.findOne({
      hotel: req.params.hotelId,
      user: req.user.id,
    });

    if (!rating) {
      return res.status(404).json({ success: false, msg: "Rating not found" });
    }

    await rating.deleteOne();
    res.status(200).json({ success: true, msg: "Rating deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Cannot delete rating" });
  }
};
