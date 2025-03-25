export default async function userLogout() {
  const response = await fetch(`${process.env.BACKEND_URL}/api/v1/auth/logout`);

  if (!response.ok) {
    throw new Error("Failed to logout");
  }

  return await response.json();
}
