import CardPanel from "@/components/CardPanel";
import getVenues from "@/libs/getHotels";
import VenueCatalog from "@/components/VenueCatalog";
import { Suspense } from "react";
import { LinearProgress } from "@mui/material";

export default function Venue() {
  const venues = getVenues();

  return (
    <main className="text-center p-5">
      <h1 className="text-xl font-medium">Select Your Event Venue</h1>
      <Suspense
        fallback={
          <p>
            Loading...
            <LinearProgress />
          </p>
        }
      >
        <VenueCatalog venuesJson={venues} />
      </Suspense>
    </main>
  );
}
