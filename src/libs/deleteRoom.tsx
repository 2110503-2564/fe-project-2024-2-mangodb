export default async function deleteRoom(
  token: string,
  hotelId: string,
  roomId: string
) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/v1/hotels/${hotelId}/rooms/${roomId}`,
    {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to deleteRoom");
  }

  return await response.json();
}
//
