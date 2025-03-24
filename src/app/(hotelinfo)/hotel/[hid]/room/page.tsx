"use client";

import RoomCatalog from "@/components/RoomCatalog";
import { Suspense } from "react";
import { LinearProgress } from "@mui/material";
import getRoomsByHotel from "@/libs/getRoomsByHotel";

export default function Room({ params }: { params: { hid: string } }) {
  const rooms = getRoomsByHotel(params.hid);

  return (
    <main className="text-center p-5">
      <Suspense
        fallback={
          <p>
            Loading...
            <LinearProgress />
          </p>
        }
      >
        <RoomCatalog RoomJson={rooms} />
      </Suspense>
    </main>
  );
}
