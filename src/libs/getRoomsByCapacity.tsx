export default async function getRoomsByCapacity(
  adults: number,
  children: number
) {
  const response = await fetch(
    `http://localhost:5000/api/v1/hotels/rooms/capacity?adults=${adults}&children=${children}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch roomsByCapacity");
  }

  return await response.json();
}
