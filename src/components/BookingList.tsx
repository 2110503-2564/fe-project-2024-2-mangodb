"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import getBookings from "@/libs/getBookings";
import getHotel from "@/libs/getHotel";
import getRoomsByHotel from "@/libs/getRoomsByHotel";
import dayjs from "dayjs";
import Image from "next/image";
import updateBooking from "@/libs/updateBooking"; // Import your updateBooking function
import deleteBooking from "@/libs/deleteBooking"; // Import your deleteBooking function
import DatePicker from "react-datepicker"; // Import the date picker
import "react-datepicker/dist/react-datepicker.css"; // Import date picker styles

export default function MyBooking() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hotelData, setHotelData] = useState<Record<string, any>>({});
  const [roomData, setRoomData] = useState<Record<string, any>>({});
  const [isEditing, setIsEditing] = useState<string | null>(null); // Track which booking is being edited
  const [editCheckInDate, setEditCheckInDate] = useState<Date | null>(null);
  const [editCheckOutDate, setEditCheckOutDate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.token) return;

      try {
        const bookingRes = await getBookings(session.user.token);
        const bookingsData = bookingRes.data;
        setBookings(bookingsData);

        // Fetch hotel & room info
        const hotelMap: Record<string, any> = {};
        const roomMap: Record<string, any> = {};

        for (const booking of bookingsData) {
          const hotelId = booking.hotel._id;
          const roomId = booking.room;

          // Fetch hotel only if not already fetched
          if (!hotelMap[hotelId]) {
            const hotelRes = await getHotel(hotelId);
            hotelMap[hotelId] = hotelRes.data;
          }

          // Fetch room only if not already fetched
          if (!roomMap[roomId]) {
            const roomsRes = await getRoomsByHotel(hotelId);
            const matchedRoom = roomsRes.data.find(
              (r: any) => r._id === roomId
            );
            roomMap[roomId] = matchedRoom;
          }
        }

        setHotelData(hotelMap);
        setRoomData(roomMap);
      } catch (error) {
        console.error("Error fetching bookings or related data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  if (loading) {
    return (
      <div className="text-center mt-20 text-lg text-gray-500">Loading...</div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center mt-20 text-xl text-gray-500 font-semibold">
        😴 You have no bookings yet
      </div>
    );
  }

  // Function to handle the update of booking dates
  const handleEdit = (
    bookingId: string,
    checkInDate: Date,
    checkOutDate: Date
  ) => {
    setIsEditing(bookingId); // Start editing the booking
    setEditCheckInDate(checkInDate); // Set the initial check-in date
    setEditCheckOutDate(checkOutDate); // Set the initial check-out date
  };

  // Handle date change
  const handleDateChange = (date: Date | null, isCheckIn: boolean) => {
    if (isCheckIn) {
      setEditCheckInDate(date);
    } else {
      setEditCheckOutDate(date);
    }
  };

  // Function to confirm the booking update
  const handleConfirmEdit = async (bookingId: string) => {
    if (session?.user?.token && editCheckInDate && editCheckOutDate) {
      try {
        await updateBooking(
          session.user.token,
          bookingId,
          editCheckInDate,
          editCheckOutDate
        );
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking._id === bookingId
              ? {
                  ...booking,
                  checkInDate: editCheckInDate,
                  checkOutDate: editCheckOutDate,
                }
              : booking
          )
        );
        setIsEditing(null); // Close the edit mode
      } catch (error) {
        console.error("Error updating booking:", error);
      }
    }
  };

  // Function to handle deleting the booking
  const handleDelete = async (bookingId: string) => {
    if (session?.user?.token) {
      try {
        await deleteBooking(session.user.token, bookingId);
        setBookings((prevBookings) =>
          prevBookings.filter((booking) => booking._id !== bookingId)
        );
      } catch (error) {
        console.error("Error deleting booking:", error);
      }
    }
  };

  return (
    <div className="h-screen overflow-y-auto bg-gray-100 px-4 py-6">
      <main className="flex flex-col items-center space-y-6">
        {bookings.map((booking) => {
          const hotel = hotelData[booking.hotel._id];
          const room = roomData[booking.room];

          if (!hotel || !room) {
            return null; // In case hotel or room is missing
          }

          return (
            <div
              key={booking._id}
              className="bg-blue-100 p-6 rounded-2xl max-w-4xl w-full flex shadow-lg mt-5 relative"
            >
              {/* Edit and Delete Buttons */}
              <div className="absolute top-4 right-6 flex space-x-2">
                <button
                  onClick={() =>
                    handleEdit(
                      booking._id,
                      new Date(booking.checkInDate),
                      new Date(booking.checkOutDate)
                    )
                  }
                  className="px-4 py-2 bg-yellow-400 text-white rounded-full hover:bg-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(booking._id)}
                  className="px-4 py-2 bg-red-400 text-white rounded-full hover:bg-red-500"
                >
                  Delete
                </button>
              </div>

              {/* Room Picture Placeholder */}
              <div className="flex-1 flex items-center justify-center border-r border-gray-300 pr-8 mr-2">
                <Image
                  src={room.imgSrc}
                  alt="Room Picture"
                  width={400}
                  height={300}
                  objectFit="cover"
                  className="rounded"
                />
              </div>

              {/* Booking Details */}
              <div className="flex-1 p-6">
                <div className="text-xl font-bold mb-2">{hotel?.name}</div>
                <div className="text-sm text-gray-600 mb-1">
                  📍 {hotel?.address}
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  📞 {hotel?.tel}
                </div>

                {room && (
                  <>
                    <div className="text-sm text-gray-700 mt-2">
                      🛏️ {room.size} sqft
                    </div>
                    <div className="text-sm text-gray-700">
                      👥 {room.size_description.adults} adults,{" "}
                      {room.size_description.children} children
                    </div>
                  </>
                )}

                {isEditing === booking._id ? (
                  <div className="mt-3">
                    {/* Date Picker for Check-in */}
                    <DatePicker
                      selected={editCheckInDate}
                      onChange={(date) => handleDateChange(date, true)}
                      className="mb-2"
                      dateFormat="dd/MM/yyyy"
                    />
                    {/* Date Picker for Check-out */}
                    <DatePicker
                      selected={editCheckOutDate}
                      onChange={(date) => handleDateChange(date, false)}
                      className="mb-2"
                      dateFormat="dd/MM/yyyy"
                    />
                    <button
                      onClick={() => handleConfirmEdit(booking._id)}
                      className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-full"
                    >
                      Confirm Edit
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mt-3 text-sm">
                      🗓️ Check-In Date:{" "}
                      <span className="font-medium">
                        {dayjs(booking.checkInDate).format("DD/MM/YYYY")}
                      </span>
                    </div>
                    <div className="text-sm">
                      🗓️ Check-Out Date:{" "}
                      <span className="font-medium">
                        {dayjs(booking.checkOutDate).format("DD/MM/YYYY")}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}
