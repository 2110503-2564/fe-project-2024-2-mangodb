"use client";

import React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import InteractiveCard from "./InteractiveCard";
import { FaLocationDot } from "react-icons/fa6";
import { useSearchParams } from "next/navigation";

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
  const router = useRouter();
  const searchParams = useSearchParams();

  const [checkInDate, setCheckInDate] = useState<string | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<string | null>(null);
  const [adult, setAdult] = useState<string | null>(null);
  const [children, setChildren] = useState<string | null>(null);

  useEffect(() => {
    // Check if parameters exist in the URL
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");
    const adultParam = searchParams.get("adult");
    const childrenParam = searchParams.get("children");

    // Only set state if parameters are found in the URL
    if (checkIn) setCheckInDate(checkIn);
    if (checkOut) setCheckOutDate(checkOut);
    if (adultParam) setAdult(adultParam);
    if (childrenParam) setChildren(childrenParam);
  }, [searchParams]);

  const checkParams = checkInDate && checkOutDate && adult && children;

  return (
    <InteractiveCard className="w-1/5 h-[300px] border border-gray-300 cursor-pointer">
      <div
        className="w-full h-full bg-[#E6EBF9] rounded-xl"
        onClick={() =>
          router.push(
            checkParams
              ? `/hotel/${hid}/room?checkIn=${checkInDate}&checkOut=${checkOutDate}&adult=${adult}&children=${children}`
              : `/hotel/${hid}/room`
          )
        }
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
            <FaLocationDot className="mr-1" /> {location}
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
