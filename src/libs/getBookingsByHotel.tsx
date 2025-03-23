export default async function getBookingsByHotel(
  token: string,
  hotelId: string
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/hotels/${hotelId}/bookings`,
    {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch bookingsByHotel");
  }

  return await response.json();
}
