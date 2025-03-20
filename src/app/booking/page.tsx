"use client";

import DateReserve from "@/components/DateReserve";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { addBooking } from "@/redux/features/bookSlice";

export default function Booking() {
  const [nameLastname, setNameLastname] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [venue, setVenue] = useState("");
  const [bookingDate, setBookingDate] = useState<Dayjs | null>(null);

  const dispatch = useDispatch<AppDispatch>();

  const makeBooking = (e: React.FormEvent) => {
    e.preventDefault();

    if (nameLastname && contactNumber && venue && bookingDate) {
      const item: BookingItem = {
        nameLastname: nameLastname,
        tel: contactNumber,
        venue: venue,
        bookDate: dayjs(bookingDate).format("YYYY/MM/DD"),
      };
      dispatch(addBooking(item));
    }
  };

  return (
    <main
      className="flex justify-center bg-gray-100"
      style={{ height: "calc(100vh - 50px)" }}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md h-[420px] mt-[120px]">
        <div className="text-2xl mb-4 text-center">Venue Booking</div>
        <form className="space-y-4">
          <TextField
            name="Name-Lastname"
            label="Name-Lastname"
            variant="standard"
            fullWidth
            value={nameLastname}
            onChange={(e) => {
              setNameLastname(e.target.value);
            }}
          />

          <TextField
            name="Contact-Number"
            label="Contact-Number"
            variant="standard"
            fullWidth
            value={contactNumber}
            onChange={(e) => {
              setContactNumber(e.target.value);
            }}
          />

          <FormControl fullWidth>
            <InputLabel>Venue</InputLabel>
            <Select
              id="venue"
              label="Venue"
              value={venue}
              onChange={(e) => {
                setVenue(e.target.value as string);
              }}
            >
              <MenuItem value="Bloom">The Bloom Pavilion</MenuItem>
              <MenuItem value="Spark">Spark Space</MenuItem>
              <MenuItem value="GrandTable">The Grand Table</MenuItem>
            </Select>
          </FormControl>

          <DateReserve
            onDateChange={(value: Dayjs) => {
              setBookingDate(value);
            }}
          />

          <Button
            type="submit"
            name="Book Venue"
            variant="contained"
            fullWidth
            onClick={makeBooking}
          >
            Book Venue
          </Button>
        </form>
      </div>
    </main>
  );
}
