"use client";

import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useSearchParams } from "next/navigation";

export default function DateReserve({
  onDateChange,
}: {
  onDateChange: (checkIn: Dayjs | null, checkOut: Dayjs | null) => void;
}) {
  const searchParams = useSearchParams();

  const [checkInDate, setCheckInDate] = useState<Dayjs | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Dayjs | null>(null);

  useEffect(() => {
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");

    if (checkIn && checkOut) {
      const checkInDayjs = dayjs(checkIn);
      const checkOutDayjs = dayjs(checkOut);

      // Set initial dates only if they haven't been set before
      if (!checkInDate && !checkOutDate) {
        setCheckInDate(checkInDayjs);
        setCheckOutDate(checkOutDayjs);

        // Call onDateChange only once to prevent infinite loop
        onDateChange(checkInDayjs, checkOutDayjs);
      }
    }
  }, [searchParams, checkInDate, checkOutDate]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="space-y-4">
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
