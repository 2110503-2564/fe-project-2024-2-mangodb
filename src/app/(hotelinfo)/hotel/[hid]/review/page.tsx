"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import getRatingsByHotel from "@/libs/getRatingsByHotel";
import addRatingToHotel from "@/libs/addRatingToHotel";
import { useSession } from "next-auth/react";

export default function ReviewPage() {
  const { data: session } = useSession();
  const { hid } = useParams(); // Get hid from URL
  const [reviews, setReviews] = useState<RatingItem[]>([]);
  const [userRating, setUserRating] = useState(5);
  const [userReview, setUserReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const params = useParams();
  console.log("Params:", params);
  

  // Fetch reviews when the page loads
  useEffect(() => {
    if (!hid) return;
    
    const fetchReviews = async () => {
      try {
        const data = await getRatingsByHotel(hid as string);
        setReviews(data);
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
    <div className="p-6">
      <h1 className="text-2xl font-bold">Hotel Reviews</h1>

      {/* Display reviews */}
      {error && <p className="text-red-500">{error}</p>}
      {reviews.count > 0 ? (
        <ul className="mt-4">
          {reviews.data.map((review) => (
            <li key={review.hotel} className="p-4 border rounded-md mb-2">
              <strong>{review.user.name}</strong> - rating {review.rating}/5
              <p>{review.review}</p>
              <small className="text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </small>
            </li>
          ))}
        </ul>
      ) : (
        <p>No reviews yet.</p>
      )}

      {/* Add Review Form */}
      <form onSubmit={handleSubmit} className="mt-6 p-4 border rounded-md">
        <label className="block mb-2 font-semibold">Rating:</label>
        <select
          value={userRating}
          onChange={(e) => setUserRating(Number(e.target.value))}
          className="border p-2 rounded mb-4"
        >
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {num} Stars
            </option>
          ))}
        </select>

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
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
