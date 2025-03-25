export default async function createRoomByHotel(
  token: string,
  hotelId: string,
  roomSize: number,
  roomAdults: number,
  roomChildren: number,
  totalRooms: number,
  availableRooms: number,
  pricePerNight: number,
  imageSrc: string
) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/v1/hotels/${hotelId}/rooms`,
    {
      method: "POST",
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
    throw new Error("Failed to createRoomByHotel");
  }

  return await response.json();
}
