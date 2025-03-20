import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type BookState = {
  bookItems: BookingItem[];
};

const initialState: BookState = { bookItems: [] };

export const bookSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    addBooking: (state, action: PayloadAction<BookingItem>) => {
      const newBooking = action.payload;
      let isUpdated = false;

      for (let i = 0; i < state.bookItems.length; i++) {
        const item = state.bookItems[i];

        if (
          item.data.hotel._id === newBooking.data.hotel._id &&
          item.data.checkInDate === newBooking.data.checkInDate &&
          item.data.user === newBooking.data.user
        ) {
          state.bookItems[i] = newBooking;
          isUpdated = true;
          break;
        }
      }

      if (!isUpdated) {
        state.bookItems.push(newBooking);
      }
    },
    removeBooking: (state, action: PayloadAction<BookingItem>) => {
      const remainItems = state.bookItems.filter((obj) => {
        return (
          obj.data.user !== action.payload.data.user ||
          obj.data.hotel._id !== action.payload.data.hotel._id ||
          obj.data.checkInDate !== action.payload.data.checkInDate ||
          obj.data.createdAt !== action.payload.data.createdAt
        );
      });
      state.bookItems = remainItems;
    },
  },
});

export const { addBooking, removeBooking } = bookSlice.actions;
export default bookSlice.reducer;
