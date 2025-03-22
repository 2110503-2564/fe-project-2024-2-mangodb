"use client";

import React from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import InteractiveCard from './InteractiveCard'

export default async function RoomCard({
  pricePerNight,
  imgSrc,
  location,
  size,
  amoutOfPeople,
  hid,
}: {
  pricePerNight: string;
  imgSrc: string;
  location: string;
  size: number;
  hid: string;
  amoutOfPeople: number
}) {
  const [value, setValue] = useState<number | null>(0);
  const router = useRouter();
  return (
    <InteractiveCard className="w-1/6 h-[300px] ">
      <div
      className="w-full h-full bg-[#E6EBF9] rounded-lg"
      style={{
        fontFamily: "sans-serif",
      }}
      >
      <div className="relative w-full h-1/2">
        <Image
          src={imgSrc}
          alt="Product Picture"
          fill={true}
          className="object-cover rounded-t-lg"
        />
      </div>
      <div className="px-4 pt-2">
        <div className="flex items-center text-[22px] font-bold text-black">
          ${pricePerNight} <span className="text-sm font-normal text-gray-700">/night</span>
        </div>

        <div className="flex items-center text-sm text-gray-700 mt-1">
          <img
            src="/img/location-pin.svg"
            alt="Location Icon"
            className="w-4 h-4 mr-1"
          />{" "}
            {location}
        </div>
      </div>

      <hr className="border-gray-300 my-2 mx-4" />

      {/* Size + People */}
      <div className="flex justify-between px-4 pb-3 text-sm text-gray-500">
        <div className="flex items-center">
          <img
            src="/img/ruler.svg"
            alt="Location Icon"
            className="w-4 h-4 mr-1"
          />{" "}
          {size} sqft
        </div>
        <div className="flex items-center">
          <img
            src="/img/user.png"
            alt="Location Icon"
            className="w-4 h-4 mr-1"
          />{" "}
          5 people
        </div>
      </div>
    </div>
    </InteractiveCard>
  );
}
