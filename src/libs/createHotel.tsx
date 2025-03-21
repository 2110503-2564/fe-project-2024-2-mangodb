export default async function createHotel(
  token: string,
  hotelName: string,
  hotelAddress: string,
  hoetelTel: string
) {
  const response = await fetch(`http://localhost:5000/api/v1/hotels`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: hotelName,
      address: hotelAddress,
      tel: hoetelTel,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to createHotel");
  }

  return await response.json();
}
