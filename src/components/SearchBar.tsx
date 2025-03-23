import { FaLocationDot, FaUser, FaArrowRight } from "react-icons/fa6";
import { useState } from "react";
import { TextField, ClickAwayListener } from "@mui/material";

export default function SearchBar() {
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guestDropdownOpen, setGuestDropdownOpen] = useState(false);
  const [adult, setAdult] = useState(2);
  const [children, setChildren] = useState(0);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between bg-white shadow-md rounded-full p-4 sm:p-2 max-w-full sm:max-w-[49rem] mx-auto z-30 relative">
      {/* Location */}
      <div className="flex items-center gap-2 sm:gap-3 px-2 w-full sm:w-auto">
        <FaLocationDot className="text-gray-500" />
        <div className="flex flex-col text-sm w-full">
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

      {/* Divider */}
      <div className="hidden sm:block border-l border-gray-300 h-10"></div>

      {/* Check-in */}
      <div className="flex flex-col px-2 sm:px-4 w-full sm:w-auto">
        <span className="font-semibold">Check-in</span>
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className="outline-none text-gray-500 text-sm bg-transparent w-full"
        />
      </div>

      {/* Divider */}
      <div className="hidden sm:block border-l border-gray-300 h-10"></div>

      {/* Check-out */}
      <div className="flex flex-col px-2 sm:px-4 w-full sm:w-auto">
        <span className="font-semibold">Check-out</span>
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="outline-none text-gray-500 text-sm bg-transparent w-full"
        />
      </div>

      {/* Divider */}
      <div className="hidden sm:block border-l border-gray-300 h-10"></div>

      {/* Guests with dropdown */}
      <ClickAwayListener onClickAway={() => setGuestDropdownOpen(false)}>
        <div className="relative w-full sm:w-auto">
          <div
            onClick={() => setGuestDropdownOpen(!guestDropdownOpen)}
            className="flex items-center gap-2 px-2 sm:px-4 cursor-pointer"
          >
            <FaUser className="text-gray-500" />
            <div className="flex flex-col w-full">
              <span className="font-semibold whitespace-nowrap">Guests</span>
              <span className="text-gray-500 text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                Adult: {adult}, Children: {children}
              </span>
            </div>
          </div>

          {/* Dropdown */}
          {guestDropdownOpen && (
            <div className="absolute bg-white border border-gray-200 shadow-lg rounded-xl p-4 mt-2 w-64 z-40">
              <div className="mb-4">
              <TextField
                id="adult"
                label="Adults"
                type="number"
                value={adult}
                onChange={(e) => setAdult(Math.max(0, Number(e.target.value)))}
                fullWidth
                size="small"
                inputProps={{ min: 0 }}
                InputLabelProps={{ shrink: true }}
              />
              </div>
              <div>
              <TextField
                id="children"
                label="Children"
                type="number"
                value={children}
                onChange={(e) => setChildren(Math.max(0, Number(e.target.value)))}
                fullWidth
                size="small"
                inputProps={{ min: 0 }}
                InputLabelProps={{ shrink: true }}
              />
              </div>
            </div>
          )}
        </div>
      </ClickAwayListener>

      {/* Search Button */}
      <button className="bg-blue-500 text-white p-3 rounded-full mt-2 sm:mt-0 sm:ml-2 w-full sm:w-auto">
        <FaArrowRight />
      </button>
    </div>
  );
}
