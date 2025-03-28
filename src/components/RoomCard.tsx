"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import InteractiveCard from "./InteractiveCard";
import getRoomsByHotel from "@/libs/getRoomsByHotel";
import { FaUserAlt } from "react-icons/fa";
import { FaRulerHorizontal } from "react-icons/fa6";

export default function RoomCard({
  pricePerNight,
  imgSrc,
  size,
  adult,
  children,
  hid,
  checkInDate,
  checkOutDate,
}: {
  pricePerNight: number;
  imgSrc: string;
  size: number;
  hid: string;
  adult: number;
  children: number;
  checkInDate: string;
  checkOutDate: string;
}) {
  const router = useRouter();

  const handleBookClick = async () => {
    try {
      const rooms = await getRoomsByHotel(hid);

      const matchedRoom = rooms.data.find(
        (room: {
          size_description: { adults: number; children: number };
          size: number;
        }) =>
          room.size_description.adults === adult &&
          room.size_description.children === children &&
          room.size === size
      );

      if (matchedRoom) {
        checkInDate != "" && checkOutDate != ""
          ? router.push(
              `/booking?hotelId=${hid}&roomId=${matchedRoom._id}&checkIn=${checkInDate}&checkOut=${checkOutDate}`
            )
          : router.push(`/booking?hotelId=${hid}&roomId=${matchedRoom._id}`);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  return (
    <InteractiveCard className="w-1/5 h-[375px] border border-gray-300">
      <div
        className="w-full h-full bg-[#E6EBF9] rounded-lg"
        style={{
          fontFamily: "sans-serif",
        }}
      >
        <div className="relative w-full h-3/5">
          <Image
            src={imgSrc}
            alt="Product Picture"
            fill={true}
            className="object-cover rounded-t-lg"
          />
        </div>
        <div className="px-6 pt-2">
          <div className="flex items-center text-[26px] font-bold text-black mx-2">
            ฿{pricePerNight}{" "}
            <span className="text-sm font-normal text-black mt-1">/night</span>
          </div>
          <hr className="mt-1 border-gray-300 border-[1px]" />
        </div>

        <div className="flex flex-col justify-between mt-2 px-8 text-[14px] text-gray-500 ">
          <div className="flex items-center font-semibold">
            <FaRulerHorizontal className="w-4 h-4 mr-1" />{" "}
            <span className="text-gray-700 mr-1 font-semibold">{size}</span>sqft
          </div>
          <div className="flex items-center font-semibold">
            <FaUserAlt className="w-4 h-4 mr-1" /> adult:{" "}
            <span className="text-gray-700 mr-1 ml-1 font-semibold">
              {adult}
            </span>{" "}
            children:{" "}
            <span className="text-gray-700 mr-1 ml-1 font-semibold">
              {children}
            </span>
          </div>
        </div>
        <button
          onClick={handleBookClick}
          className="center px-[90px] self-start mt-3 bg-indigo-500  hover:bg-[#FBED2C] text-white text-sm py-1 rounded-md transition-all hover:text-indigo-500 duration-200"
        >
          Book
        </button>
      </div>
    </InteractiveCard>
  );
}
