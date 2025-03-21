"use client";

import { signOut } from "next-auth/react";

export default function SignOut() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Sign Out</h1>
      <p className="mb-4">Are you sure you want to sign out?</p>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
      >
        Sign Out
      </button>
    </div>
  );
}