"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@mui/material";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { addBooking as reduxAddBooking } from "@/redux/features/bookSlice";
import addBooking from "@/libs/addBooking";

export default function ConfirmPage() {
  const params = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { data: session } = useSession();

  const hotelId = params.get("hotelId");
  const hotelName = params.get("hotelName");
  const hotelLocation = params.get("hotelLocation");
  const adult = params.get("adult");
  const children = params.get("children");
  const checkIn = params.get("checkIn");
  const checkOut = params.get("checkOut");
  const nights = params.get("nights");
  const price = params.get("price");
  const roomId = params.get("roomId");

  const handleConfirm = async () => {
    if (!session?.user?.token || !hotelId || !roomId || !checkIn || !checkOut) {
      console.error("Missing booking data or session");
      return;
    }

    try {
      await addBooking(
        session.user.token,
        hotelId,
        roomId,
        new Date(checkIn),
        new Date(checkOut)
      );

      dispatch(
        reduxAddBooking({
          hotelId,
          roomId,
          checkInDate: checkIn,
          checkOutDate: checkOut,
        })
      );

      alert("Booking confirmed!");
      router.push("/mybooking");
    } catch (error) {
      console.error("Booking failed:", error);
    }
  };

  return (
    <main className="px-10 pt-16 text-gray-800">
      <h1 className="text-4xl font-extrabold mb-2">{hotelName}</h1>
      <p className="text-gray-500 text-lg mb-1 font-extrabold flex items-center">
        <img
        src="/img/location-pin.svg"
        alt="Location Icon"
        className="w-4 h-4 mr-1"
        />{" "} {hotelLocation}</p>

      <p className="text-md text-[#456DF2] font-semibold font-medium mb-1">
        adult: <span className="font-extrabold text-2xl">{adult}</span>, children: <span className="font-bold text-2xl">{children}</span>
      </p>

      <p className="text-md font-semibold text-[#456DF2]">
        Total length of stay: <span className="font-extrabold text-2xl">{nights} nights</span>
      </p>

      <div className="flex gap-10 mt-3">
        <div>
          <p className="text-sm text-[#456DF2] font-extrabold">check-in</p>
          <p className="text-lg font-extrabold text-[#456DF2]">{checkIn}</p>
        </div>
        <div>
          <p className="text-sm text-[#456DF2] font-extrabold">check-out</p>
          <p className="text-lg font-extrabold text-[#456DF2]">{checkOut}</p>
        </div>
      </div>

      <hr className="my-4 border-gray-300" />

      <p className="text-md font-medium text-gray-700">
        Price: <span className="text-[#456DF2] font-extrabold">THB {price}</span>
      </p>

      <Button
        variant="contained"
        className="mt-5 bg-blue-600 text-white px-6 py-2 rounded-lg"
        onClick={handleConfirm}
      >
        Confirm
      </Button>
    </main>
  );
}