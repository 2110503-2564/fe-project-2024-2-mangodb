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
import { Dayjs } from "dayjs";
import DateReserve from "@/components/DateReserve";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

import getHotels from "@/libs/getHotels";
import getRoomsByHotel from "@/libs/getRoomsByHotel";

export default function Booking() {
  const searchParams = useSearchParams();
  const hotelId = searchParams.get("hotelId");
  const roomId = searchParams.get("roomId");
  const [hotel, setHotel] = useState<string>(hotelId || "");
  const [room, setRoom] = useState<string>(roomId || "");
  const [checkInDate, setCheckInDate] = useState<Dayjs | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Dayjs | null>(null);
  const [totalLength, setTotalLength] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [hotels, setHotels] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRoom, setSelectedRoom] = useState<any>(null); // เก็บข้อมูลห้องที่เลือก

  const router = useRouter();

  // Fetch hotels
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
    if (room && rooms.length > 0) {
      const foundRoom = rooms.find((r) => r._id === room);
      if (foundRoom) {
        setSelectedRoom(foundRoom);
      }
    }
  }, [room, rooms]);

  // Fetch rooms when hotel is selected
  useEffect(() => {
    if (hotel) {
      const fetchRooms = async () => {
        try {
          const data = await getRoomsByHotel(hotel);
          setRooms(data.data);
        } catch (error) {
          console.error("Error fetching rooms:", error);
        }
      };
      fetchRooms();
    }
  }, [hotel]);

  useEffect(() => {
    if (hotelId) {
      setHotel(hotelId);
    }
    if (roomId) {
      setRoom(roomId);
    }
  }, [hotelId, roomId]);

  const handleDateChange = (checkIn: Dayjs | null, checkOut: Dayjs | null) => {
    if (checkIn && checkOut) {
      setCheckInDate(checkIn);
      setCheckOutDate(checkOut);
      const daysDifference = checkOut.diff(checkIn, "day");
      setTotalLength(daysDifference);
      setPrice(daysDifference * 100);
    }
  };

  const handleRoomChange = (roomId: string) => {
    const selectedRoom = rooms.find((room) => room._id === roomId);
    setRoom(roomId);
    setSelectedRoom(selectedRoom);
  };

  const makeBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (hotel && room && checkInDate && checkOutDate && selectedRoom) {
      const checkInStr = checkInDate.toISOString();
      const checkOutStr = checkOutDate.toISOString();
      const hotelObj = hotels.find((h) => h.id === hotel);
      const hotelName = hotelObj?.name || "Hotel";
      const hotelLocation = hotelObj?.address || "Bangkok, Thailand";
      const adult = selectedRoom.size_description.adults;
      const children = selectedRoom.size_description.children;

      router.push(
        `/confirm?hotelId=${hotel}&roomId=${room}&hotelName=${encodeURIComponent(
          hotelName
        )}&hotelLocation=${encodeURIComponent(
          hotelLocation
        )}&adult=${adult}&children=${children}&checkIn=${checkInStr}&checkOut=${checkOutStr}&nights=${totalLength}&price=${price}`
      );
    }
  };

  return (
    <main
      className="flex justify-center bg-gray-100"
      style={{ height: "calc(100vh - 50px)" }}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md h-[560px] mt-[100px]">
        <div
          className="text-2xl mb-4 text-center"
          style={{ marginTop: "-2px", marginBottom: "28px" }}
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
              onChange={(e) => handleRoomChange(e.target.value)} // Update room and selectedRoom when user changes room
              label="Room"
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
