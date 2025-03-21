export default async function getRoomsByHotel(hotelId: string) {
  const response = await fetch(
    `http://localhost:5000/api/v1/hotels/${hotelId}/rooms`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch roomsByHotel");
  }

  return await response.json();
}
