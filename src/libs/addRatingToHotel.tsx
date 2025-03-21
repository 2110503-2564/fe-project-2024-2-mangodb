export default async function addRatingToHotel(
  token: string,
  hotelId: string,
  userRating: number,
  userReview: string
) {
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

  if (!response.ok) {
    throw new Error("Failed to addRatingToHotel");
  }

  return await response.json();
}
