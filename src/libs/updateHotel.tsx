export default async function updateHotel(
  token: string,
  hotelId: string,
  hotelName: Date,
  hotelAddress: Date,
  hotelTel: string,
  imageSrc: string,
) {
  const response = await fetch(
    `http://localhost:5000/api/v1/hotels/${hotelId}`,
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
        imgSrc: imageSrc,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to updateHotel");
  }

  return await response.json();
}
