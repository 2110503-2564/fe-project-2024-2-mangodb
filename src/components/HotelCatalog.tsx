'use client';

import { useSearchParams } from "next/navigation";
import Card from "./HotelCard";

export default function HotelCatalog({ hotels }: { hotels: HotelItem[] }) {
  const searchParams = useSearchParams();
  const locationParam = searchParams.get("location");

  const filteredHotels = locationParam
    ? hotels.filter((hotel) => hotel.address === locationParam)
    : hotels;

  return (
    <div style={{ height: "90vh", overflowY: "auto", padding: "20px" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "30px",
          padding: "40px",
        }}
      >
        {filteredHotels.map((Item: HotelItem) => (
          <Card
            key={Item._id}
            hotelName={Item.name}
            imgSrc={Item.imgSrc}
            location={Item.address}
            rating={Item.averageRating}
            hid={Item.id}
          />
        ))}
      </div>
    </div>
  );
}
