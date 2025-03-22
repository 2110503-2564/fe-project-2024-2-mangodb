import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type BookState = {
  bookItems: createAndUpdateBooking[];
};

const initialState: BookState = { bookItems: [] };

export const bookSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    addBooking: (state, action: PayloadAction<createAndUpdateBooking>) => {
      const newBooking = action.payload;
      state.bookItems.push(newBooking);
    },
    removeBooking: (state, action: PayloadAction<createAndUpdateBooking>) => {
      const remainItems = state.bookItems.filter((obj) => {
        return (
          obj.hotelId !== action.payload.hotelId ||
          obj.roomId !== action.payload.roomId ||
          obj.checkInDate !== action.payload.checkInDate ||
          obj.checkOutDate !== action.payload.checkOutDate
        );
      });
      state.bookItems = remainItems;
    },
  },
});

export const { addBooking, removeBooking } = bookSlice.actions;
export default bookSlice.reducer;
