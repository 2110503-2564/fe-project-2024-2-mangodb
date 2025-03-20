export default async function userLogout() {
  const response = await fetch("http://localhost:6000/api/v1/auth/logout");

  if (!response.ok) {
    throw new Error("Failed to logout");
  }

  return await response.json();
}
