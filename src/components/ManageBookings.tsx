"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import getBookings from "@/libs/getBookings";
import getOtherUser from "@/libs/getOtherUser";
import getRoomsByHotel from "@/libs/getRoomsByHotel";
import updateBooking from "@/libs/updateBooking";
import deleteBooking from "@/libs/deleteBooking";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";

export default function ManageBookings() {
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState<any[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editCheckInDate, setEditCheckInDate] = useState<Date | null>(null);
  const [editCheckOutDate, setEditCheckOutDate] = useState<Date | null>(null);
  const [userOptions, setUserOptions] = useState<any[]>([]);
  const [hotelOptions, setHotelOptions] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);

  useEffect(() => {
    if (status !== "authenticated") return; // Ensure session is authenticated before fetching data

    const fetchData = async () => {
      try {
        const bookingRes = await getBookings(session!.user.token);
        const bookingsData = bookingRes.data;

        const roomMap: Record<string, any> = {};

        const updatedBookings = await Promise.all(
          bookingsData.map(async (booking: any) => {
            let username = "";
            try {
              const userRes = await getOtherUser(
                session!.user.token,
                booking.user
              );
              username = userRes.data.name;
            } catch (e) {
              console.warn("Failed to load user", e);
            }

            let adult = null;
            let children = null;
            const roomKey = `${booking.hotel._id}_${booking.room}`;
            if (!roomMap[roomKey]) {
              try {
                const roomRes = await getRoomsByHotel(booking.hotel._id);
                const matchedRoom = roomRes.data.find(
                  (r: any) => r._id === booking.room
                );
                if (matchedRoom) {
                  roomMap[roomKey] = matchedRoom;
                }
              } catch (e) {
                console.warn("Room fetch failed", e);
              }
            }

            const room = roomMap[roomKey];
            if (room) {
              adult = room.size_description?.adults ?? null;
              children = room.size_description?.children ?? null;
            }

            return { ...booking, username, adult, children };
          })
        );

        const userOpts = Array.from(
          new Set(updatedBookings.map((b) => b.username))
        ).map((name) => ({ value: name, label: name }));

        const hotelOpts = Array.from(
          new Map(
            updatedBookings.map((b) => [
              b.hotel._id,
              { value: b.hotel._id, label: b.hotel.name },
            ])
          ).values()
        );

        setUserOptions(userOpts);
        setHotelOptions(hotelOpts);
        setBookings(updatedBookings);
        setFilteredBookings(updatedBookings);
      } catch (error) {
        console.error("Error loading bookings", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, status]); // Ensure useEffect triggers when session is authenticated

  useEffect(() => {
    let filtered = [...bookings];
    if (selectedUser) {
      filtered = filtered.filter((b) => b.username === selectedUser.value);
    }
    if (selectedHotel) {
      filtered = filtered.filter((b) => b.hotel._id === selectedHotel.value);
    }
    setFilteredBookings(filtered);
  }, [selectedUser, selectedHotel, bookings]);

  const handleEdit = (id: string, inDate: Date, outDate: Date) => {
    setIsEditing(id);
    setEditCheckInDate(inDate);
    setEditCheckOutDate(outDate);
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
        setBookings((prev) =>
          prev.map((b) =>
            b._id === bookingId
              ? {
                  ...b,
                  checkInDate: editCheckInDate,
                  checkOutDate: editCheckOutDate,
                }
              : b
          )
        );
        setIsEditing(null);
      } catch (e) {
        console.error("Update failed", e);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (session?.user?.token) {
      try {
        await deleteBooking(session.user.token, id);
        setBookings((prev) => prev.filter((b) => b._id !== id));
      } catch (e) {
        console.error("Delete failed", e);
      }
    }
  };

  if (status !== "authenticated" || loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <div
      className="bg-gray-100 px-4 py-6"
      style={{ height: "95vh", overflowY: "auto" }}
    >
      <div className="w-full max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Manage Bookings</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full sm:w-1/2">
            <Select
              options={userOptions}
              onChange={setSelectedUser}
              isClearable
              placeholder="Search by Username"
            />
            <Select
              options={hotelOptions}
              onChange={setSelectedHotel}
              isClearable
              placeholder="Search by Hotel"
            />
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="text-center text-gray-500 font-semibold">
            😴 No bookings found
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-gray-50 p-6 rounded-md shadow-sm mb-4"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="text-lg font-semibold">
                  {booking.hotel.name}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() =>
                      handleEdit(
                        booking._id,
                        new Date(booking.checkInDate),
                        new Date(booking.checkOutDate)
                      )
                    }
                    className="px-4 py-2 bg-yellow-400 text-white text-sm rounded-md hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(booking._id)}
                    className="px-4 py-2 bg-red-400 text-white text-sm rounded-md hover:bg-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="text-sm text-gray-700">
                <div>
                  <strong>Username:</strong> {booking.username || "N/A"}
                </div>
                <div>
                  <strong>Room Info:</strong> Adults: {booking.adult ?? "N/A"},
                  Children: {booking.children ?? "N/A"}
                </div>
                <div>
                  <strong>Check-In:</strong>{" "}
                  {new Date(booking.checkInDate).toLocaleDateString()}
                </div>
                <div>
                  <strong>Check-Out:</strong>{" "}
                  {new Date(booking.checkOutDate).toLocaleDateString()}
                </div>
              </div>
              {isEditing === booking._id && (
                <div className="flex items-center space-x-4 mt-4">
                  <DatePicker
                    selected={editCheckInDate}
                    onChange={(date) => setEditCheckInDate(date)}
                    dateFormat="dd/MM/yyyy"
                    className="text-sm rounded-md px-2 py-1 border border-gray-300"
                  />
                  <DatePicker
                    selected={editCheckOutDate}
                    onChange={(date) => setEditCheckOutDate(date)}
                    dateFormat="dd/MM/yyyy"
                    className="text-sm rounded-md px-2 py-1 border border-gray-300"
                  />
                  <button
                    onClick={() => handleConfirmEdit(booking._id)}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
                  >
                    Confirm Edit
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
