"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // ✅ **Validation Check**
    if (!email || !password) {
      setError("Email and Password are required!");
      return;
    }

    setLoading(true);
    
    // 🔹 **Sign in with credentials**
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // Prevent automatic redirect for manual error handling
    });

    if (result?.error) {
      setError("Invalid email or password. Please try again."); // Display error message
    } else {
      window.location.href = "/"; // Redirect to home page on success
    }

    setLoading(false);
  };

  return (
    <div className="bg-[url(/img/bg_signin.png)] bg-cover w-screen h-screen flex-row flex">
      <div className="flex flex-col justify-center content-center ml-[22vw]">
        <div className="text-7xl mb-1 font-tiltWarp text-white">Welcome <br />Back</div>
        <div className="text-xl mb-4 font-tiltWarp text-white">Hey! Good to see you again.</div>
      </div>

      <div className="flex flex-col justify-center content-center ml-[15vw] inline-block">
        <div className="bg-gray-800 bg-opacity-50 px-10 pb-9 pt-4 rounded-3xl flex flex-col">
          
          {/* ❌ Error Message */}
          {error && <p className="text-red-500 mb-2">{error}</p>}

          <div className="font-semibold text-white">Email</div>
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border rounded-xl mb-3 pr-20"
          />

          <div className="font-semibold text-white">Password</div>
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border rounded-xl mb-6"
          />

          <button 
            onClick={handleSubmit} 
            className="text-white rounded-xl bg-[#6A8BFA] hover:bg-[#ffd60b] hover:text-gray-700 px-3 py-2 font-sans font-medium transition-all duration-200"
            disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}