"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import getBookings from "@/libs/getBookings";
import getHotel from "@/libs/getHotel";
import getRoomsByHotel from "@/libs/getRoomsByHotel";
import dayjs from "dayjs";
import Image from "next/image";
import updateBooking from "@/libs/updateBooking";
import deleteBooking from "@/libs/deleteBooking";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";

export default function MyBooking() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hotelData, setHotelData] = useState<Record<string, any>>({});
  const [roomData, setRoomData] = useState<Record<string, any>>({});
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editCheckInDate, setEditCheckInDate] = useState<Date | null>(null);
  const [editCheckOutDate, setEditCheckOutDate] = useState<Date | null>(null);
  const router = useRouter();

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
    <div
      style={{ height: "95vh", overflowY: "auto" }}
      className="bg-gray-100 px-4 py-6"
    >
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
                  className="px-4 py-1.5 bg-yellow-400 text-white text-sm font-semibold rounded-md shadow-md hover:bg-yellow-500 transition-all duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(booking._id)}
                  className="px-4 py-1.5 bg-red-400 text-white text-sm font-semibold rounded-md shadow-md hover:bg-red-500 transition-all duration-200"
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
                  className="rounded-md"
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
                  <div className="mt-3 flex items-end space-x-4">
                    {/* Date Pickers */}
                    <div className="flex flex-col space-y-2">
                      <DatePicker
                        selected={editCheckInDate}
                        onChange={(date) =>
                          handleDateChange(date as Date, true)
                        }
                        dateFormat="dd/MM/yyyy"
                        className="text-sm rounded-md px-2 py-1 border border-gray-300"
                      />

                      <DatePicker
                        selected={editCheckOutDate}
                        onChange={(date) =>
                          handleDateChange(date as Date, false)
                        }
                        dateFormat="dd/MM/yyyy"
                        className="text-sm rounded-md px-2 py-1 border border-gray-300"
                      />
                    </div>

                    {/* Confirm Button */}
                    <button
                      onClick={() => handleConfirmEdit(booking._id)}
                      className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition shadow-sm hover:shadow-md"
                    >
                      <span className="mr-1">✅</span>
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

                <div className="mt-4 flex justify-between items-center relative">
                  <span className="bg-yellow-300 text-black px-3 py-1 rounded-full text-sm font-bold">
                    {hotel?.averageRating?.toFixed(1)}
                  </span>

                  <span
                    className="absolute right-0 mt-14 text-sm text-gray-600 cursor-pointer hover:underline"
                    onClick={() => {
                      router.push(`/hotel/${booking.hotel.id}/review`);
                    }}
                  >
                    view review →
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}
