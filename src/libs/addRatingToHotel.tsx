export default async function addRatingToHotel(
  token: string,
  hotelId: string,
  userRating: number,
  userReview: string
) {
  console.log("Hotel ID:", hotelId);
  console.log("Token:", token);
  console.log("Review:", { rating: userRating, review: userReview });

  const response = await fetch(
    `http://localhost:5000/api/v1/hotels/${hotelId}/ratings`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rating: userRating,
        review: userReview,
      }),
    }
  );

  const data = await response.json();
  console.log("Backend Response:", data); // Log the response

  if (!response.ok) {
    throw new Error(`Failed to addRatingToHotel: ${data.message || response.status}`);
  }

  return data;
}
