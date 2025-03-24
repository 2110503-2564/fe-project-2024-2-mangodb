"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import getRatingsByHotel from "@/libs/getRatingsByHotel";
import addRatingToHotel from "@/libs/addRatingToHotel";
import getHotel from "@/libs/getHotel";
import { useSession } from "next-auth/react";
import Rating from '@mui/material/Rating';
import * as React from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { styled } from '@mui/material/styles';
import Image from "next/image";

export default function ReviewPage() {
  const { data: session } = useSession();
  const { hid } = useParams(); // Get hid from URL
  const [reviews, setReviews] = useState<RatingJson>();
  const [hotel, setHotel] = useState<oneHotelJson>();
  const [userRating, setUserRating] = useState(5);
  const [userReview, setUserReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const params = useParams();
  
  const StyledRating = styled(Rating)({
    '& .MuiRating-iconFilled': {
      color: '#ff6d75',
    },
    '& .MuiRating-iconHover': {
      color: '#ff3d47',
    },
  });
  

  // Fetch reviews when the page loads
  useEffect(() => {
    if (!hid) return;
    
    const fetchReviews = async () => {
      try {
        const rating = await getRatingsByHotel(hid as string);
        const hotel = await getHotel(hid as string);
        console.log(JSON.stringify(hotel, null, 2))
        setReviews(rating);
        setHotel(hotel);
      } catch (err) {
        setError("Failed to load reviews.");
      }
    };

    fetchReviews();
  }, [hid]);

  // Handle review submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = session?.user.token; // Retrieve user token from storage
    if (!token) {
      setError("You must be logged in to submit a review.");
      setLoading(false);
      return;
    }

    try {
      const data = await addRatingToHotel(token, hid as string, userRating, userReview);
      setUserReview(""); // Clear input
      setUserRating(5); // Reset rating

      // Refresh reviews after submission
      alert("Review Success!!");
      const updatedReviews = await getRatingsByHotel(hid as string);
      setReviews(updatedReviews);
    } catch (err) {
      setError("Failed to submit review.");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-row justify-center pt-[2%] bg-gray-100">
      <div className="p-6 border rounded-md shadow-md w-[30vw] bg-white">
        {hotel ? (
          <>
            <Image src={hotel.data.imgSrc} alt={hotel.data.name} className="w-full h-[80%] object-cover rounded-md" width={1000} height={1000}/>
            <h2 className="text-xl font-bold mt-2">{hotel.data.name}</h2>
            <p className="text-gray-600">{hotel.data.address}</p>
            <p className="text-gray-600">Tel: {hotel.data.tel}</p>
            <p className="font-semibold mt-1">Average Rating: {hotel.data.averageRating} ❤️</p>
          </>
        ) : (
          <p>Loading hotel info...</p>
        )}
      </div>
      
      <div className="p-6">
        <h1 className="text-2xl font-bold">Hotel Reviews</h1>

        {/* Display reviews */}
        {error && <p className="text-red-500">{error}</p>}
        {reviews && reviews.count > 0 ? (
          <div className="mt-4 max-h-[50vh] overflow-y-auto">
            <ul>
              {reviews.data.map((review) => (
                <li key={review._id} className="p-4 border rounded-md mb-2 w-full bg-white">
                  <p className="inline-block font-semibold text-lg">{review.user.name}</p> 
                  <StyledRating
                    name="customized-color"
                    defaultValue={review.rating}
                    getLabelText={(value: number) => `${value} Heart${value !== 1 ? 's' : ''}`}
                    icon={<FavoriteIcon fontSize="inherit" />}
                    emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
                    readOnly
                  />
                  <p className="text-gray-700">{review.review}</p>
                  <small className="text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </small>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No reviews yet.</p>
        )}


        {/* Add Review Form */}
        <form onSubmit={handleSubmit} className="mt-6 p-4 border rounded-md bg-white">
          <label className="block mb-2 font-semibold">Rating:</label>
          <StyledRating
          name="customized-color"
          defaultValue={userRating}
          getLabelText={(value: number) => `${value} Heart${value !== 1 ? 's' : ''}`}
          icon={<FavoriteIcon fontSize="inherit" />}
          emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
          onChange={(e, newValue)=>{setUserRating(newValue as number)}}
        />

          <label className="block mb-2 font-semibold">Review:</label>
          <textarea
            value={userReview}
            onChange={(e) => setUserReview(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Write your review..."
          />

          <button
            type="submit"
            disabled={loading}
            className="text-white rounded-xl bg-indigo-600 hover:bg-[#ffd60b] hover:text-gray-700 px-3 py-2 font-sans font-medium mt-2"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
    </div>
  </div>
  );
}
