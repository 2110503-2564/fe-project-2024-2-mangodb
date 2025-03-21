"use client";

import React from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Card({
  venueName,
  imgSrc,
  location,
  rating,
  hid,
}: {
  venueName: string;
  imgSrc: string;
  location: string;
  rating: number;
  hid: string;
}) {
  const [value, setValue] = useState<number | null>(0);

  return (
    <div className="w-64 bg-[#E6EBF9] rounded-2xl overflow-hidden shadow-md">
      {/* รูปภาพ */}
      <div className="w-full h-40 bg-gray-300 flex items-center justify-center">
        <span className="text-gray-500">Picture</span>
      </div>

      {/* ข้อมูลโรงแรม */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-left">{venueName}</h3>
        <p className="text-sm text-gray-500 flex items-center">
        <img
          src="/img/location-pin.svg"
          alt="Location Icon"
          className="w-4 h-4 mr-1"
        /> {location}
        </p>

        {/* Rating และ View Review */}
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-bold bg-yellow-300 px-2 py-1 rounded-md text-black">
            {rating.toFixed(1)}
          </span>
          <Link href={`/${hid}/review`} className="text-sm text-gray-500 flex items-center">
            view review →
          </Link>
        </div>
      </div>
    </div>
  );
}
