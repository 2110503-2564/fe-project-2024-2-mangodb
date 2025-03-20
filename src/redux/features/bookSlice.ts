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
          item.venue === newBooking.venue &&
          item.bookDate === newBooking.bookDate
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
          obj.nameLastname !== action.payload.nameLastname ||
          obj.tel !== action.payload.tel ||
          obj.venue !== action.payload.venue ||
          obj.bookDate !== action.payload.bookDate
        );
      });
      state.bookItems = remainItems;
    },
  },
});

export const { addBooking, removeBooking } = bookSlice.actions;
export default bookSlice.reducer;
