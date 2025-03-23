export default async function updateMe(
  token: string,
  userName: string | null,
  userTel: string | null
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/me`,
    {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: userName,
        tel: userTel,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to updateMe");
  }

  return await response.json();
}
