"use client";

import { useAppSelector, AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { removeBooking } from "@/redux/features/bookSlice";

export default function BookingList() {
  const bookingItems = useAppSelector((state) => state.bookSlice.bookItems);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto mt-[60px]">
      <div className="text-2xl mb-10 text-center">Your Venue Bookings</div>
      {bookingItems.length === 0 ? (
        <div className="text-center text-gray-500">No Venue Booking</div>
      ) : (
        <div className="space-y-4">
          {bookingItems.map((bookingItem, index) => (
            <div key={index} className="border-b pb-4">
              <div>
                <strong>Name:</strong> {bookingItem.nameLastname}
              </div>
              <div>
                <strong>Contact Number:</strong> {bookingItem.tel}
              </div>
              <div>
                <strong>Venue:</strong> {bookingItem.venue}
              </div>
              <div>
                <strong>Booking Date:</strong> {bookingItem.bookDate}
              </div>
              <button
                className="mt-2 text-red-500 hover:text-red-700"
                onClick={() => dispatch(removeBooking(bookingItem))}
              >
                Remove Booking
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
