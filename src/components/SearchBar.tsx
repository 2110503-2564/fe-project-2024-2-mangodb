import { FaLocationDot, FaUser, FaArrowRight } from "react-icons/fa6";
import { useState } from "react";

export default function SearchBar() {
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("");

  return (
    <div className="flex items-center justify-between bg-white shadow-md rounded-full p-2 max-w-[49rem] mx-auto">
      {/* Location */}
      <div className="flex items-center gap-3 px-2">
        <FaLocationDot className="text-gray-500" />
        <div className="flex flex-col text-base">
          <span className="font-semibold">Location</span>
          <input
            type="text"
            placeholder="Where are you going?"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="outline-none text-gray-500 text-sm bg-transparent w-full"
          />
        </div>
      </div>

      {/* Check-in */}
      <div className="border-l border-gray-300 h-10"></div>
      <div className="flex flex-col px-4">
        <span className="font-semibold">Check-in</span>
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className="outline-none text-gray-500 text-sm bg-transparent"
        />
      </div>

      {/* Check-out */}
      <div className="border-l border-gray-300 h-10"></div>
      <div className="flex flex-col px-4">
        <span className="font-semibold">Check-out</span>
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="outline-none text-gray-500 text-sm bg-transparent"
        />
      </div>

      {/* Guests */}
      <div className="border-l border-gray-300 h-10"></div>
      <div className="flex items-center gap-2 px-4">
        <FaUser className="text-gray-500" />
        <div className="flex flex-col">
          <span className="font-semibold">Guests</span>
          <input
            type="text"
            placeholder="adults, children"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="outline-none text-gray-500 text-sm bg-transparent w-full"
          />
        </div>
      </div>

      {/* Search Button */}
      <button className="bg-blue-500 text-white p-3 rounded-full ml-2">
        <FaArrowRight />
      </button>
    </div>
  );
}
