export default async function updateMe(
  token: string,
  userName: string | null,
  userTel: string | null
) {
  const response = await fetch(`${process.env.BACKEND_URL}/api/v1/auth/me`, {
    method: "PATCH",
    headers: {
      authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: userName,
      tel: userTel,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.msg || "Failed to updateMe");
  }

  return await response.json();
}
