"use client";

import { FaLocationDot, FaUser, FaArrowRight } from "react-icons/fa6";
import { useState, useEffect } from "react";
import {
  TextField,
  ClickAwayListener,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import getHotels from "@/libs/getHotels";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import getUserProfile from "@/libs/getUserProfile";

export default function SearchBar() {
  const [hotels, setHotels] = useState<HotelItem[]>([]);
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guestDropdownOpen, setGuestDropdownOpen] = useState(false);
  const [adult, setAdult] = useState(1);
  const [children, setChildren] = useState(0);
  const router = useRouter();
  const [maxCheckOut, setMaxCheckOut] = useState("");
  const [minDate, setMinDate] = useState(new Date().toISOString().split("T")[0]);
  const { data: session, status } = useSession();

  const token = session?.user.token;

  const handleSearch = () => {
    if (!location || !checkIn || !checkOut) {
      alert("Please complete all fields");
      return;
    }

    const queryParams = new URLSearchParams({
      location,
      checkIn,
      checkOut,
      adult: adult.toString(),
      children: children.toString(),
    });

    router.push(`/hotel?${queryParams.toString()}`);
  };

  useEffect(() => {
    async function fetchHotels() {
      const result = await getHotels();
      setHotels(result.data);
    }

    async function fetchUserRole() {
      const user = await getUserProfile(token as string);
      if (user.data.role === 'admin') {
        setMinDate(Date())
      }
    }

    fetchHotels();
    fetchUserRole();
  }, []);
  const uniqueHotels = hotels.reduce((acc: HotelItem[], curr) => {
    if (!acc.find((h) => h.address === curr.address)) {
      acc.push(curr);
    }
    return acc;
  }, []);

  async function handleSetCheckOut(k:string) {
    const user = await getUserProfile(token as string)
    if (user.data.role === 'admin'){
      setMaxCheckOut(Date());
    } else {
      setMaxCheckOut(k);
    }
    console.log(k);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between bg-white shadow-md rounded-full p-4 sm:p-2 max-w-full sm:max-w-[72rem] mx-auto z-30 relative">
      {/* Location */}
      <div className="flex items-center gap-2 sm:gap-3 px-2 flex-grow min-w-[10rem]">
        <FaLocationDot className="text-gray-500" />
        <FormControl fullWidth size="small" variant="outlined">
          <InputLabel id="location-label" sx={{ fontWeight: 600 }}>
            Location
          </InputLabel>
          <Select
            labelId="location-label"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            label="Location"
            renderValue={(selected) => {
              const selectedHotel = uniqueHotels.find(
                (h) => h.address === selected
              );
              return selectedHotel ? selectedHotel.address : "Select a hotel";
            }}
            sx={{
              backgroundColor: "transparent",
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              color: "#6b7280",
            }}
          >
            <MenuItem value="" disabled>
              Select a hotel
            </MenuItem>
            {uniqueHotels.map((hotel) => (
              <MenuItem key={hotel.address} value={hotel.address}>
                {hotel.address}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* Divider */}
      <div className="hidden sm:block border-l border-gray-300 h-10"></div>

      {/* Check-in */}
      <div className="flex flex-col px-2 sm:px-4 w-full sm:w-auto">
        <span className="font-semibold">Check-in</span>
        <input
          type="date"
          value={checkIn}
          onChange={(e) => {
            setCheckIn(e.target.value);
            const maxDate = new Date(e.target.value);
            maxDate.setDate(maxDate.getDate() + 3);
            setCheckOut(""); // Reset checkOut if checkIn changes
            handleSetCheckOut(maxDate.toISOString().split("T")[0]);
          }}
          min={minDate}
          className="outline-none text-gray-500 text-sm bg-transparent w-full hover:cursor-pointer hover:bg-gray-100 transition-colors duration-200 rounded"
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
          min={checkIn}
          max={maxCheckOut}
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

          {guestDropdownOpen && (
            <div className="absolute bg-white border border-gray-200 shadow-lg rounded-xl p-4 mt-2 w-64 z-40">
              <div className="mb-4">
                <TextField
                  id="adult"
                  label="Adults"
                  type="number"
                  value={adult}
                  onChange={(e) =>
                    setAdult(Math.max(0, Number(e.target.value)))
                  }
                  fullWidth
                  size="small"
                  inputProps={{ min: 1 }}
                  InputLabelProps={{ shrink: true }}
                />
              </div>
              <div>
                <TextField
                  id="children"
                  label="Children"
                  type="number"
                  value={children}
                  onChange={(e) =>
                    setChildren(Math.max(0, Number(e.target.value)))
                  }
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
      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white p-3 rounded-full mt-2 sm:mt-0 sm:ml-2 w-full sm:w-auto hover:bg-indigo-500 trasition-all duration-200"
      >
        <FaArrowRight />
      </button>
    </div>
  );
}
