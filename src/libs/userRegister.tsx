export default async function userRegister(
  userName: string,
  userTel: string,
  userEmail: string,
  userRole: string,
  userPassword: string
) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/v1/auth/register`,
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

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.msg || "Registration failed");
  }

  return data;
}
