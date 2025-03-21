export default async function deleteHotel(token: string, hotelId: string) {
  const response = await fetch(
    `http://localhost:5000/api/v1/hotels/${hotelId}`,
    {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to deleteHotel");
  }

  return await response.json();
}
