"use client";

import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState } from "react";
import { Dayjs } from "dayjs";

export default function DateReserve({
  onDateChange,
}: {
  onDateChange: Function;
}) {
  const [bookingDate, setBookingDate] = useState<Dayjs | null>(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        className="bg-white w-full"
        value={bookingDate}
        onChange={(newValue) => {
          setBookingDate(newValue);
          onDateChange(newValue);
        }}
      />
    </LocalizationProvider>
  );
}
