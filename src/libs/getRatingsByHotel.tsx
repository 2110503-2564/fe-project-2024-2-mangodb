export default async function getRatingsByHotel(hotelId: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/hotels/${hotelId}/ratings`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch ratingsByHotel");
  }

  return await response.json();
}
