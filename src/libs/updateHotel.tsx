export default async function updateHotel(
  token: string,
  hotelId: string,
  hotelName: Date,
  hotelAddress: Date,
  hotelTel: string
) {
  const response = await fetch(
    `http://localhost:6000/api/v1/hotels/${hotelId}`,
    {
      method: "PUT",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: hotelName,
        address: hotelAddress,
        tel: hotelTel,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to updateHotel");
  }

  return await response.json();
}
