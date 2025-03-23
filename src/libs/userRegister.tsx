export default async function userRegister(
  userName: string,
  userTel: string,
  userEmail: string,
  userRole: string,
  userPassword: string
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: userName,
        tel: userTel,
        email: userEmail,
        role: userRole,
        password: userPassword,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to register");
  }

  return await response.json();
}
