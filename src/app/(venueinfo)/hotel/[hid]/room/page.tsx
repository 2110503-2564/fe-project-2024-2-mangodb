import RoomCatalog from "@/components/RoomCatalog";
import { Suspense } from "react";
import { LinearProgress } from "@mui/material";
import getHotels from "@/libs/getHotels";

export default function Room() {
  return (
    <main className="text-center p-5">
      <h1 className="text-xl font-medium">Room</h1>
      <Suspense
        fallback={
          <p>
            Loading...
            <LinearProgress />
          </p>
        }
      >
        <RoomCatalog/>
      </Suspense>
    </main>
  );
}
