"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import getBookings from "@/libs/getBookings";
import updateBooking from "@/libs/updateBooking";
import deleteBooking from "@/libs/deleteBooking";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function ManageBookings() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editCheckInDate, setEditCheckInDate] = useState<Date | null>(null);
  const [editCheckOutDate, setEditCheckOutDate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.token) return;

      try {
        const bookingRes = await getBookings(session.user.token);
        const bookingsData = bookingRes.data;
        setBookings(bookingsData);
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
        😴 No bookings found
      </div>
    );
  }

  const handleEdit = (
    bookingId: string,
    checkInDate: Date,
    checkOutDate: Date
  ) => {
    setIsEditing(bookingId);
    setEditCheckInDate(checkInDate);
    setEditCheckOutDate(checkOutDate);
  };

  const handleDateChange = (date: Date | null, isCheckIn: boolean) => {
    if (isCheckIn) {
      setEditCheckInDate(date);
    } else {
      setEditCheckOutDate(date);
    }
  };

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
        setIsEditing(null);
      } catch (error) {
        console.error("Error updating booking:", error);
      }
    }
  };

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
      className="bg-gray-100 px-4 py-6"
      style={{ height: "95vh", overflowY: "auto" }}
    >
      <div className="w-full max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Manage Bookings
        </h1>

        {bookings.map((booking) => {
          const hotel = booking.hotel;

          if (!hotel) return null;

          return (
            <div
              key={booking._id}
              className="bg-gray-50 p-6 rounded-md shadow-sm mb-4"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="text-lg font-semibold">{hotel.name}</div>{" "}
                <div className="flex space-x-3">
                  <button
                    onClick={() =>
                      handleEdit(
                        booking._id,
                        new Date(booking.checkInDate),
                        new Date(booking.checkOutDate)
                      )
                    }
                    className="px-4 py-2 bg-yellow-400 text-white text-sm rounded-md hover:bg-yellow-500 transition-all duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(booking._id)}
                    className="px-4 py-2 bg-red-400 text-white text-sm rounded-md hover:bg-red-500 transition-all duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="flex flex-col space-y-2 mb-4">
                <div className="text-sm text-gray-700">
                  <strong>Room ID:</strong> {booking.room}
                </div>
                <div className="text-sm text-gray-700">
                  <strong>User ID:</strong> {booking.user}
                </div>
                <div className="text-sm text-gray-700">
                  <strong>Check-In:</strong>{" "}
                  {new Date(booking.checkInDate).toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-700">
                  <strong>Check-Out:</strong>{" "}
                  {new Date(booking.checkOutDate).toLocaleDateString()}
                </div>
              </div>

              {isEditing === booking._id && (
                <div className="flex items-center space-x-4">
                  <DatePicker
                    selected={editCheckInDate}
                    onChange={(date) => handleDateChange(date as Date, true)}
                    dateFormat="dd/MM/yyyy"
                    className="text-sm rounded-md px-2 py-1 border border-gray-300"
                  />
                  <DatePicker
                    selected={editCheckOutDate}
                    onChange={(date) => handleDateChange(date as Date, false)}
                    dateFormat="dd/MM/yyyy"
                    className="text-sm rounded-md px-2 py-1 border border-gray-300"
                  />
                  <button
                    onClick={() => handleConfirmEdit(booking._id)}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition shadow-sm hover:shadow-md"
                  >
                    Confirm Edit
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
