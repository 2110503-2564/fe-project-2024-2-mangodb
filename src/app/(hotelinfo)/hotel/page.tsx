import HotelCatalog from "@/components/HotelCatalog";
import { Suspense } from "react";
import { LinearProgress } from "@mui/material";
import getHotels from "@/libs/getHotels";

export default async function Hotel() {
  // ดึงข้อมูลที่นี่ บน Server
  const hotelResponse = await getHotels();

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
        <HotelCatalog hotels={hotelResponse.data} />
      </Suspense>
    </main>
  );
}
