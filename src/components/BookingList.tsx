"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import getBookings from "@/libs/getBookings";
import getHotel from "@/libs/getHotel";
import getRoomsByHotel from "@/libs/getRoomsByHotel";
import dayjs from "dayjs";

export default function MyBooking() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hotelData, setHotelData] = useState<Record<string, any>>({});
  const [roomData, setRoomData] = useState<Record<string, any>>({});

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

          if (!hotelMap[hotelId]) {
            const hotelRes = await getHotel(hotelId);
            hotelMap[hotelId] = hotelRes.data;
          }

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

  return (
    <div className="h-screen overflow-y-auto bg-gray-100 px-4 py-6">
      <main className="flex flex-col items-center space-y-6">
        {bookings.map((booking) => {
          const hotel = hotelData[booking.hotel._id];
          const room = roomData[booking.room];

          return (
            <div
              key={booking._id}
              className="bg-blue-100 p-6 rounded-2xl max-w-4xl w-full flex shadow-lg"
            >
              {/* Room Picture Placeholder */}
              <div className="flex-1 flex items-center justify-center border-r border-gray-300">
                <div className="text-lg font-semibold">Room Picture</div>
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

                <div className="mt-4 flex justify-between items-center">
                  <span className="bg-yellow-300 text-black px-3 py-1 rounded-full text-sm font-bold">
                    {hotel?.averageRating?.toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-600 cursor-pointer hover:underline">
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
