"use client";

import React from "react";
import { useState } from "react";

export default function Card({
  venueName,
  imgSrc,
  onCompare,
}: {
  venueName: string;
  imgSrc: string;
  onCompare?: Function;
}) {
  const [value, setValue] = useState<number | null>(0);

  return (
    <div className="w-64 bg-gray-100 rounded-2xl overflow-hidden shadow-md">
      {/* รูปภาพ */}
      <div className="w-full h-40 bg-gray-300 flex items-center justify-center">
        <span className="text-gray-500">Picture</span>
      </div>

      {/* ข้อมูลโรงแรม */}
      <div className="p-4">
        <h3 className="text-lg font-semibold">{venueName}</h3>
        <p className="text-sm text-gray-500 flex items-center">
          📍 {location}
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
