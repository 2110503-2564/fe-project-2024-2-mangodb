export default async function getBooking(token: string, bookingId: string) {
  const response = await fetch(
    `http://localhost:5000/api/v1/bookings/${bookingId}`,
    {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch booking");
  }

  return await response.json();
}
