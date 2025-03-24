"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { addBooking as reduxAddBooking } from "@/redux/features/bookSlice";
import addBooking from "@/libs/addBooking";
import dayjs from "dayjs";
import Image from "next/image";
import { Button } from "@mui/material";
import { toast } from "react-toastify";

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
  const hotelImg = params.get("hotelImg");
  const roomImg = params.get("roomImg");

  const formattedCheckIn = checkIn ? dayjs(checkIn).format("ddd DD MMM") : "";
  const formattedCheckOut = checkOut
    ? dayjs(checkOut).format("ddd DD MMM")
    : "";

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

      toast.success("Booking confirmed!");
      router.push("/mybooking");
    } catch (error) {
      console.error("Booking failed:", error);
    }
  };

  return (
    <main className="flex flex-col md:flex-row items-center justify-center gap-12 bg-white min-h-screen">
      <div className="border border-gray-400 w-[450px] h-[300px]">
        <Image
          src={roomImg || "/img/fallback.jpg"}
          alt="Room Image"
          width={300}
          height={300}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="bg-[#EFEFEF] p-6 rounded-3xl border border-gray-400 shadow-md max-w-md w-full text-gray-800">
        <h1 className="text-3xl font-extrabold mb-1">{hotelName}</h1>
        <p className="text-gray-500 text-md font-semibold flex items-center mb-2">
          <img
            src="/img/location-pin.svg"
            alt="Location Icon"
            className="w-4 h-4 mr-1"
          />
          {hotelLocation}
        </p>

        <p className="text-sm text-[#456DF2] font-semibold">
          adult: <span className="font-extrabold text-lg">{adult}</span>,
          children: <span className="font-extrabold text-lg">{children}</span>
        </p>

        <p className="text-sm font-semibold text-[#456DF2] mb-2">
          Total length of stay:{" "}
          <span className="font-extrabold text-lg">{nights} nights</span>
        </p>

        <div className="flex gap-8 mt-3">
          <div className="border-r-2 border-gray-300 pr-8">
            <p className="text-sm text-[#456DF2] font-extrabold">check-in</p>
            <p className="text-lg font-extrabold text-[#456DF2]">
              {formattedCheckIn}
            </p>
          </div>
          <div>
            <p className="text-sm text-[#456DF2] font-extrabold">check-out</p>
            <p className="text-lg font-extrabold text-[#456DF2]">
              {formattedCheckOut}
            </p>
          </div>
        </div>

        <hr className="my-4 border-gray-300" />

        <p className="text-md text-[#456DF2] font-semibold mb-2">
          Price: <span className="font-extrabold text-2xl">THB {price}</span>
        </p>

        <Button
          onClick={handleConfirm}
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: "#456DF2",
            color: "white",
            fontWeight: "bold",
            borderRadius: "12px",
            padding: "10px 0",
            "&:hover": {
              backgroundColor: "#FFEE00",
            },
          }}
        >
          Confirm
        </Button>
      </div>
    </main>
  );
}
