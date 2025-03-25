"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignOut() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Sign Out</h1>
      <p className="mb-6 text-gray-600">Are you sure you want to sign out?</p>
      <div className="flex space-x-4 mb-32">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-700 transition-all duration-300"
        >
          Sign Out
        </button>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition-all duration-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
