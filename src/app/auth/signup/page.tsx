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
    <div className="bg-[url(/img/bg_signup.png)] bg-cover w-screen h-screen flex-row flex">

        <div className="flex flex-col justify-center content-center ml-[15vw]">
          <div className="text-7xl mb-1 font-tiltWarp text-white">Sign-Up</div>
          <div className="text-xl mb-4 font-tiltWarp text-white">Hello! Let's go join with us.</div>
        </div>

        <div className="flex flex-col justify-center content-center ml-[15vw] inline-block">
          <div className="bg-gray-800 bg-opacity-50 px-10 pb-9 pt-5 rounded-3xl flex flex-col ">

            <div className="font-semibold text-white">Username</div>
            <input type="text" placeholder="Username" value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="p-2 border rounded-xl mb-3 pr-20"
            />

            <div className="font-semibold text-white">Tel</div>
            <input type="text" placeholder="Tel" value={userTel}
              onChange={(e) => setUserTel(e.target.value)}
              className="p-2 border rounded-xl mb-3"
            />

            <div className="font-semibold text-white">Email</div>
            <input type="email" placeholder="Email" value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="p-2 border rounded-xl mb-3 pr-20"
            />

            <div className="font-semibold text-white">Password</div>
            <input type="password" placeholder="Password" value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              className="p-2 border rounded-xl mb-6"
            />

            <button onClick={handleSignUp} 
            className="text-white rounded-xl 'rounded-2xl bg-[#6A8BFA] 
            hover:bg-[#ffd60b] hover:text-gray-700 px-3 py-2 font-sans font-medium ">
            Sign In
            </button>
          </div>
        </div>
    </div>
  );
}