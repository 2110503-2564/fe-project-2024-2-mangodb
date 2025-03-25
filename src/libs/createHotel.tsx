export default async function createHotel(
  token: string,
  hotelName: string,
  hotelAddress: string,
  hoetelTel: string,
  imageSrc: string
) {
  const response = await fetch(`${process.env.BACKEND_URL}/api/v1/hotels`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: hotelName,
      address: hotelAddress,
      tel: hoetelTel,
      imgSrc: imageSrc,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to createHotel");
  }

  return await response.json();
}
