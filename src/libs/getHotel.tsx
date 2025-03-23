export default async function getHotel(hotelId: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/hotels/${hotelId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch hotel");
  }

  return await response.json();
}
