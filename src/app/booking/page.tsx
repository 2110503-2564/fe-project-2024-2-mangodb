"use client";

import {
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
  const [selectedRoom, setSelectedRoom] = useState<any>(null);

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
    if (roomId) {
      setRoom(roomId);
      const foundRoom = rooms.find((r) => r._id === roomId);
      if (foundRoom) {
        setSelectedRoom(foundRoom);
      }
    }
  }, [roomId, rooms]);

  // Fetch rooms when hotel is selected
  useEffect(() => {
    if (hotel) {
      const fetchRooms = async () => {
        try {
          const data = await getRoomsByHotel(hotel);

          const availableRooms = data.data.filter((room: any) => {
            return room.availableRooms > 0;
          });

          setRooms(availableRooms);
        } catch (error) {
          console.error("Error fetching rooms:", error);
        }
      };
      fetchRooms();
    }
  }, [hotel, searchParams]);

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
      setPrice(daysDifference * (selectedRoom?.pricePerNight || 0));
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
      const roomImg = selectedRoom?.imgSrc || "";

      router.push(
        `/confirm?hotelId=${hotel}&roomId=${room}&hotelName=${encodeURIComponent(
          hotelName
        )}&hotelLocation=${encodeURIComponent(
          hotelLocation
        )}&adult=${adult}&children=${children}&checkIn=${checkInStr}&checkOut=${checkOutStr}&nights=${totalLength}&price=${price}&roomImg=${encodeURIComponent(
          roomImg
        )}`
      );
    }
  };

  return (
    <main
      className="flex justify-center bg-[url(/img/bg_booking.png)]"
      style={{ height: "calc(100vh - 50px)" }}
    >
      <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md h-auto mt-[13vh] absolute">
        <div
          className="text-2xl mb-4 text-center font-semibold text-gray-700"
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
                  {room.size} sqm, {room.size_description.adults} Adults{" "}
                  {room.size_description.children} Children
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Check-in and Check-out Date */}
          <DateReserve onDateChange={handleDateChange} />

          {/* Total Length of Stay and Price */}
          <div className="font-base text-gray-600 p-2 bg-indigo-200 inline-block rounded-xl">
            Total {totalLength} Days, {price} ฿
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              marginTop: "15px",
              backgroundColor: "#6A8BFA", // Custom primary color
              color: "white",
              fontWeight: "bold",
              padding: "12px 20px",
              borderRadius: "8px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Adds shadow
              "&:hover": {
                backgroundColor: "#ffd60b", // Yellow on hover
                color: "#333",
              },
            }}
          >
            Book Now
          </Button>
        </form>
      </div>
    </main>
  );
}
