import styles from "./topmenu.module.css";
import Image from "next/image";
import TopMenuItem from "./TopMenuItem";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { signOut } from "next-auth/react";
import { FaCircleUser } from "react-icons/fa6";
import Link from "next/link";

export default async function TopMenu() {
  const session = await getServerSession(authOptions);

  return (
    <nav
      className={`flex items-center justify-between px-8 py-2 bg-white shadow-md fixed top-0 right-0 left-0 z-40`}
    >
      {/* Left Section: Logo & Main Menu */}
      <div className="flex items-center space-x-10">
        <Image
          src="/img/mango-31-512.png"
          width={48}
          height={48}
          alt="MangoHotel"
        />

        <div className="hidden md:flex space-x-6">
          <TopMenuItem
            title="MangoHotel"
            pageRef="/"
            className="text-lg font-bold text-indigo-500"
          />
          <TopMenuItem
            title="Select Hotel"
            pageRef="/hotel"
            className="text-base font-semibold text-indigo-500 hover:text-indigo-700 "
          />
          <TopMenuItem
            title="Booking"
            pageRef="/booking"
            className="text-base font-semibold text-indigo-500 hover:text-indigo-700"
          />
        </div>
      </div>

      {/* Right Section: User Authentication & Profile */}
      <div className="flex items-center space-x-7">
        <TopMenuItem
          title="My Booking"
          pageRef="/mybooking"
          className="text-base font-semibold text-indigo-500 hover:text-indigo-700"
        />

        {session ? (
          <div className="flex items-center space-x-5 border-2 p1-2 border-indigo-500 rounded-full">
            <TopMenuItem
              title="Sign Out"
              pageRef="/auth/signout"
              className="text-base font-semibold text-white bg-indigo-500 py-1 px-3 hover:bg-indigo-700 ml-2 rounded-full"
            />
            <Link href={"/profile"}>
              <FaCircleUser className="text-4xl text-indigo-500 m-1" />
            </Link>
          </div>
        ) : (
          <div className="flex space-x-4">
            <TopMenuItem
              title="Sign Up"
              pageRef="/auth/signup"
              className="text-base font-semibold text-indigo-500 border border-indigo-500 rounded-full px-4 py-1 hover:bg-gray-200"
            />
            <TopMenuItem
              title="Login"
              pageRef="/api/auth/signin"
              className="text-base font-semibold text-white bg-indigo-500 rounded-full px-6 py-1 hover:bg-indigo-700"
            />
          </div>
        )}
      </div>
    </nav>
  );
}
