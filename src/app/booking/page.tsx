"use client";

import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { addBooking as reduxAddBooking } from "@/redux/features/bookSlice";
import { Dayjs } from "dayjs";
import DateReserve from "@/components/DateReserve";
import addBooking from "@/libs/addBooking";
import { useSession } from "next-auth/react";

import getHotels from "@/libs/getHotels";
import getRoomsByHotel from "@/libs/getRoomsByHotel";

export default function Booking() {
  const [hotel, setHotel] = useState<string>("");
  const [room, setRoom] = useState<string>("");
  const [checkInDate, setCheckInDate] = useState<Dayjs | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Dayjs | null>(null);
  const [totalLength, setTotalLength] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [hotels, setHotels] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const dispatch = useDispatch<AppDispatch>();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const data = await getHotels();
        setHotels(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching hotels:", error);
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  useEffect(() => {
    if (hotel) {
      const fetchRooms = async () => {
        try {
          const data = await getRoomsByHotel(hotel);
          setRooms(data.data);
          setRoom("");
        } catch (error) {
          console.error("Error fetching rooms:", error);
        }
      };

      fetchRooms();
    }
  }, [hotel]);

  const handleDateChange = (checkIn: Dayjs | null, checkOut: Dayjs | null) => {
    if (checkIn && checkOut) {
      setCheckInDate(checkIn);
      setCheckOutDate(checkOut);
      const daysDifference = checkOut.diff(checkIn, "day");
      setTotalLength(daysDifference);
      setPrice(daysDifference * 100);
    }
  };

  const makeBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (hotel && room && checkInDate && checkOutDate) {
      const bookingData = {
        hotelId: hotel, // hotelId
        roomId: room, // roomId
        checkInDate: checkInDate.toDate(),
        checkOutDate: checkOutDate.toDate(),
      };

      if (!session?.user?.token) {
        console.error("Token not available");
        return;
      }

      await addBooking(
        session?.user.token,
        hotel,
        room,
        checkInDate.toDate(),
        checkOutDate.toDate()
      );
      dispatch(reduxAddBooking(bookingData));
    }
  };

  return (
    <main
      className="flex justify-center bg-gray-100"
      style={{ height: "calc(100vh - 50px)" }}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md h-[550px] mt-[100px]">
        <div
          className="text-2xl mb-4 text-center"
          style={{ marginTop: "-7px", marginBottom: "25px" }}
        >
          Hotel Booking
        </div>
        <form className="space-y-4" onSubmit={makeBooking}>
          {/* Hotel Dropdown */}
          <FormControl fullWidth>
            <InputLabel>Hotel</InputLabel>
            <Select
              value={hotel}
              onChange={(e) => setHotel(e.target.value)}
              label="Hotel"
            >
              {loading ? (
                <MenuItem value="">Loading...</MenuItem>
              ) : (
                hotels.map((hotel) => (
                  <MenuItem key={hotel.id} value={hotel.id}>
                    {hotel.name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          {/* Room Dropdown */}
          <FormControl fullWidth>
            <InputLabel>Room</InputLabel>
            <Select
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              label="Room"
              disabled={!hotel}
            >
              {rooms.map((room) => (
                <MenuItem key={room._id} value={room._id}>
                  {room.size_description.adults} Adults,{" "}
                  {room.size_description.children} Children
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Check-in and Check-out Date */}
          <DateReserve onDateChange={handleDateChange} />

          {/* Total Length of Stay and Price */}
          <TextField
            label="Total Length of Stay (Days)"
            variant="standard"
            fullWidth
            value={totalLength}
            inputProps={{ readOnly: true }}
          />
          <TextField
            label="Price"
            variant="standard"
            fullWidth
            value={price}
            inputProps={{ readOnly: true }}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            style={{ marginTop: "25px" }}
          >
            Book Now
          </Button>
        </form>
      </div>
    </main>
  );
}
