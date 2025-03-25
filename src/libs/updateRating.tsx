export default async function updateRating(
  token: string,
  hotelId: string,
  userRating: number,
  userReview: string
) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/v1/hotels/${hotelId}/ratings`,
    {
      method: "PUT",
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
    throw new Error("Failed to updateRating");
  }

  return await response.json();
}
