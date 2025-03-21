"use client";

import React from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import InteractiveCard from './InteractiveCard'

export default function RoomCard({
  hotelName,
  imgSrc,
  location,
  PricePerNight,
  hid,
}: {
  hotelName: string;
  imgSrc: string;
  location: string;
  PricePerNight: number;
  hid: string;
}) {
  const [value, setValue] = useState<number | null>(0);
  const router = useRouter();

  return (
    <InteractiveCard>
      <div className="w-64 h-80 bg-[#E6EBF9] rounded-lg"
      onClick={() => router.push(`/hotel/${hid}/room`)}>
        <div className="relative w-full h-40">
        <Image src={imgSrc}
                alt='Product Picture'
                fill={true}
                className='object-cover rounded-t-lg'/>
        </div>
        <div className="p-4 bg-[#E6EBF9]">
          <h3 className="text-lg font-semibold text-left">{hotelName}</h3>
          <p className="text-sm text-gray-500 flex items-center">
          <img
            src="/img/location-pin.svg"
            alt="Location Icon"
            className="w-4 h-4 mr-1"
          /> {location}
          </p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-bold bg-yellow-300 px-2 py-1 rounded-md text-black">
              {/* {rating.toFixed(1)} */}
            </span>
            <Link 
            href={`/${hid}/review`} 
            className="text-sm text-gray-500 flex items-center hover:text-gray-700"
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
