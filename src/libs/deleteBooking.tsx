export default async function deleteBooking(token: string, bookingId: string) {
  const response = await fetch(
    `http://localhost:6000/api/v1/bookings/${bookingId}`,
    {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to deleteBooking");
  }

  return await response.json();
}
