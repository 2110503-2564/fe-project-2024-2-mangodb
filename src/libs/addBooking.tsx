export default async function addBooking(
  token: string,
  hotelId: string,
  roomId: string,
  userCheckInDate: Date,
  userCheckOutDate: Date
) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/v1/hotels/${hotelId}/rooms/${roomId}/bookings`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        checkInDate: userCheckInDate,
        checkOutDate: userCheckOutDate,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to addBooking");
  }

  return await response.json();
}
