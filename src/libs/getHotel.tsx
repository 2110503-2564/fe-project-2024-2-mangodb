export default async function getHotel(hotelId: string) {
  const response = await fetch(`http://localhost:5000/api/v1/${hotelId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch hotel");
  }

  return await response.json();
}
