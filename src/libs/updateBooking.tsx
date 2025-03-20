export default async function updateBooking(
  token: string,
  bookingId: string,
  userCheckInDate: Date,
  userCheckOutDate: Date
) {
  const response = await fetch(
    `http://localhost:6000/api/v1/bookings/${bookingId}`,
    {
      method: "PUT",
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
    throw new Error("Failed to updateBooking");
  }

  return await response.json();
}
