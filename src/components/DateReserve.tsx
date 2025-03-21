"use client";

import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState } from "react";
import { Dayjs } from "dayjs";

export default function DateReserve({
  onDateChange,
}: {
  onDateChange: (checkIn: Dayjs | null, checkOut: Dayjs | null) => void;
}) {
  const [checkInDate, setCheckInDate] = useState<Dayjs | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Dayjs | null>(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
        <DatePicker
          label="Check-in Date"
          value={checkInDate}
          onChange={(newValue) => {
            setCheckInDate(newValue);
            onDateChange(newValue, checkOutDate);
          }}
        />
        <DatePicker
          label="Check-out Date"
          value={checkOutDate}
          onChange={(newValue) => {
            setCheckOutDate(newValue);
            onDateChange(checkInDate, newValue);
          }}
        />
      </div>
    </LocalizationProvider>
  );
}
