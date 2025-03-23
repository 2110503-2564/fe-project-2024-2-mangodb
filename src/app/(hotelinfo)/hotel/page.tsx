import HotelCatalog from "@/components/HotelCatalog";
import { Suspense } from "react";
import { LinearProgress } from "@mui/material";
import getHotels from "@/libs/getHotels";

export default function Hotel() {
  const hotels = getHotels();

  return (
    <main className="text-center p-5">
      <div className="text-3xl font-medium font-tiltWarp sticky mt-5">Hotel</div>
      <Suspense
        fallback={
          <p>
            Loading...
            <LinearProgress />
          </p>
        }
      >
        <HotelCatalog HotelJson={hotels} />
      </Suspense>
    </main>
  );
}
