"use client";
import { useState } from "react";
import userRegister from "@/libs/userRegister"; // Import your function

export default function SignUp() {
  const [userName, setUserName] = useState("");
  const [userTel, setUserTel] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("user"); // Default role
  const [userPassword, setUserPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await userRegister(userName, userTel, userEmail, userRole, userPassword);
      alert("Registration successful! You can now log in.");
    } catch (error) {
      alert("Failed to register. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSignUp} className="p-6 bg-white rounded-lg shadow-lg w-96">
        <input type="text" placeholder="Full Name" value={userName} onChange={(e) => setUserName(e.target.value)} className="p-2 border rounded mb-4 w-full" />
        <input type="tel" placeholder="Phone Number" value={userTel} onChange={(e) => setUserTel(e.target.value)} className="p-2 border rounded mb-4 w-full" />
        <input type="email" placeholder="Email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} className="p-2 border rounded mb-4 w-full" />
        <input type="password" placeholder="Password" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} className="p-2 border rounded mb-4 w-full" />
        <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-500 text-white rounded w-full">
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
