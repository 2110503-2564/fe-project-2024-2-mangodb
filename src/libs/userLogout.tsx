export default async function userLogout() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/logout`
  );

  if (!response.ok) {
    throw new Error("Failed to logout");
  }

  return await response.json();
}
