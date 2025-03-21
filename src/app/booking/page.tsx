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

// ฟังก์ชัน import getHotels และ getRoomsByHotel
import getHotels from "@/libs/getHotels";
import getRoomsByHotel from "@/libs/getRoomsByHotel";

export default function Booking() {
  const [hotel, setHotel] = useState<string>(""); // hotelId
  const [room, setRoom] = useState<string>(""); // roomId
  const [checkInDate, setCheckInDate] = useState<Dayjs | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Dayjs | null>(null);
  const [totalLength, setTotalLength] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [hotels, setHotels] = useState<any[]>([]); // สำหรับเก็บข้อมูลโรงแรม
  const [rooms, setRooms] = useState<any[]>([]); // สำหรับเก็บข้อมูลห้อง
  const [loading, setLoading] = useState<boolean>(true); // สำหรับเช็คการโหลดข้อมูล

  const dispatch = useDispatch<AppDispatch>();
  const { data: session } = useSession();

  // ดึงข้อมูลโรงแรมจาก API
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const data = await getHotels(); // เรียกฟังก์ชัน getHotels ที่ import มา
        setHotels(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching hotels:", error);
        setLoading(false);
      }
    };

    fetchHotels(); // เรียกฟังก์ชันที่ใช้ดึงข้อมูล
  }, []); // [] หมายความว่า จะดึงข้อมูลแค่ครั้งเดียวเมื่อ component ถูก render

  // ดึงข้อมูลห้องเมื่อเลือกโรงแรม
  useEffect(() => {
    if (hotel) {
      const fetchRooms = async () => {
        try {
          const data = await getRoomsByHotel(hotel);
          setRooms(data.data);
          setRoom(""); // รีเซ็ต room เมื่อเปลี่ยนโรงแรม
        } catch (error) {
          console.error("Error fetching rooms:", error);
        }
      };

      fetchRooms();
    }
  }, [hotel]); // เมื่อ `hotel` เปลี่ยน, ดึงข้อมูลห้องใหม่

  const handleDateChange = (checkIn: Dayjs | null, checkOut: Dayjs | null) => {
    if (checkIn && checkOut) {
      setCheckInDate(checkIn);
      setCheckOutDate(checkOut);
      const daysDifference = checkOut.diff(checkIn, "day");
      setTotalLength(daysDifference);
      setPrice(daysDifference * 100); // Example: Price calculation
    }
  };

  const makeBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (hotel && room && checkInDate && checkOutDate) {
      const bookingData = {
        hotelId: hotel, // hotelId
        roomId: room, // roomId
        checkInDate: checkInDate.toDate(), // ใช้ .toDate() เพื่อแปลงเป็น Date object
        checkOutDate: checkOutDate.toDate(), // ใช้ .toDate() เพื่อแปลงเป็น Date object
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
      dispatch(reduxAddBooking(bookingData)); // ส่งข้อมูลที่มีแค่ check-in, check-out ไปยัง Redux
    }
  };

  return (
    <main
      className="flex justify-center bg-gray-100"
      style={{ height: "calc(100vh - 50px)" }}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md h-[500px] mt-[120px]">
        <div className="text-2xl mb-4 text-center">Hotel Booking</div>
        <form className="space-y-4" onSubmit={makeBooking}>
          {/* Hotel Dropdown */}
          <FormControl fullWidth>
            <InputLabel>Hotel</InputLabel>
            <Select
              value={hotel} // ค่าที่เลือกใน Select ต้องสัมพันธ์กับค่าใน state
              onChange={(e) => setHotel(e.target.value)} // เมื่อเลือกโรงแรมจะอัปเดตค่าใน state
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
              value={room} // ค่าที่เลือกใน Select ต้องสัมพันธ์กับค่าใน state
              onChange={(e) => setRoom(e.target.value)} // เมื่อเลือกห้องจะอัปเดตค่าใน state
              label="Room"
              disabled={!hotel} // ปิดการเลือกห้องจนกว่าจะเลือกโรงแรม
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
            disabled
          />
          <TextField
            label="Price"
            variant="standard"
            fullWidth
            value={price}
            disabled
          />

          {/* Submit Button */}
          <Button type="submit" variant="contained" fullWidth>
            Book Now
          </Button>
        </form>
      </div>
    </main>
  );
}
