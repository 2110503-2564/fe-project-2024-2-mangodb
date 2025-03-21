"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/", // Redirect after login
    });
  };

  return (
    <div className="bg-[url(/img/bg_signin.png)] bg-cover w-screen h-screen flex-row flex">

        <div className="flex flex-col justify-center content-center ml-[15vw]">
          <div className="text-7xl mb-1 font-tiltWarp text-white">Welcome <br />Back</div>
          <div className="text-xl mb-4 font-tiltWarp text-white">Hey! Good to see you again.</div>
        </div>

        <div className="flex flex-col justify-center content-center ml-[15vw] inline-block">
          <div className="bg-gray-800 bg-opacity-50 px-10 pb-9 pt-4 rounded-3xl flex flex-col ">

            <div className="font-semibold text-white">Email</div>
            <input type="email" placeholder="Email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 border rounded-xl mb-3 pr-20"
            />

            <div className="font-semibold text-white">Password</div>
            <input type="password" placeholder="Password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 border rounded-xl mb-6"
            />

            <button onClick={handleSubmit} 
            className="text-white rounded-xl 'rounded-2xl bg-[#6A8BFA] 
            hover:bg-[#ffd60b] hover:text-gray-700 px-3 py-2 font-sans font-medium ">
            Sign In
            </button>
          </div>
        </div>
    </div>
  );
}