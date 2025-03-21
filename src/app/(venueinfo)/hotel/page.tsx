import CardPanel from "@/components/CardPanel";
import getVenues from "@/libs/getHotels";
import HotelCatalog from "@/components/HotelCatalog";
import { Suspense } from "react";
import { LinearProgress } from "@mui/material";

export default function Hotel() {
  const venues = getVenues();

  return (
    <main className="text-center p-5">
      <h1 className="text-xl font-medium">Hotel</h1>
      <Suspense
        fallback={
          <p>
            Loading...
            <LinearProgress />
          </p>
        }
      >
        <HotelCatalog venuesJson={venues} />
      </Suspense>
    </main>
  );
}
