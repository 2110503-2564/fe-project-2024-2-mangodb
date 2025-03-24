import HotelCatalog from "@/components/HotelCatalog";
import { Suspense } from "react";
import { LinearProgress } from "@mui/material";
import getHotels from "@/libs/getHotels";

export default async function Hotel() {
  const hotelResponse = await getHotels();

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
        <HotelCatalog hotels={hotelResponse.data} />
      </Suspense>
    </main>
  );
}
