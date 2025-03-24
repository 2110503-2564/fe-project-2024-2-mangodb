"use client";

import React from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import InteractiveCard from "./InteractiveCard";
import { FaLocationDot } from "react-icons/fa6";

export default function Card({
  hotelName,
  imgSrc,
  location,
  rating,
  hid,
}: {
  hotelName: string;
  imgSrc: string;
  location: string;
  rating: number;
  hid: string;
}) {
  const [value, setValue] = useState<number | null>(0);
  const router = useRouter();

  return (
    <InteractiveCard className="w-1/5 h-[300px] border border-gray-300 cursor-pointer">
      <div
        className="w-full h-full bg-[#E6EBF9] rounded-xl"
        onClick={() => router.push(`/hotel/${hid}/room`)}
      >
        <div className="relative w-full h-40">
          <Image
            src={imgSrc}
            alt="Product Picture"
            fill={true}
            className="object-cover rounded-t-lg"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-left">{hotelName}</h3>
          <p className="text-sm text-gray-500 flex items-center">
          <FaLocationDot className="mr-1"/>{" "}
            {location}
          </p>
          <div className="flex items-center justify-between mt-9">
            <span className="text-sm font-bold bg-yellow-300 px-2 py-1 rounded-md text-black">
              {rating.toFixed(1)}
            </span>
            <Link
              href={`/${hid}/review`}
              className="text-sm text-gray-500 flex items-center hover:text-indigo-500 transition-all duration-200"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                router.push(`hotel/${hid}/review`);
              }}
            >
              view review →
            </Link>
          </div>
        </div>
      </div>
    </InteractiveCard>
  );
}
