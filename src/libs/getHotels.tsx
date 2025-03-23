export default async function getHotels() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/hotels`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch hotels");
  }

  return await response.json();
}
