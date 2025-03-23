export default async function deleteRating(token: string, hotelId: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/hotels/${hotelId}/ratings`,
    {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to deleteRating");
  }

  return await response.json();
}
