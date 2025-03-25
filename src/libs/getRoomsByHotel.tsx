export default async function getRoomsByHotel(hotelId: string) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/v1/hotels/${hotelId}/rooms`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch roomsByHotel");
  }

  return await response.json();
}
