export default async function updateRoom(
  token: string,
  hotelId: string,
  roomId: string,
  roomSize: number,
  roomAdults: number,
  roomChildren: number,
  totalRooms: number,
  availableRooms: number,
  pricePerNight: number,
  imageSrc: string
) {
  const response = await fetch(
    `http://localhost:5000/api/v1/hotels/${hotelId}/rooms/${roomId}`,
    {
      method: "PUT",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        size: roomSize,
        size_description: {
          adults: roomAdults,
          children: roomChildren,
        },
        totalRooms: totalRooms,
        availableRooms: availableRooms,
        pricePerNight: pricePerNight,
        imgSrc: imageSrc,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to updateRating");
  }

  return await response.json();
}
