import getHotels from "@/libs/getHotels";
import Card from "./HotelCard";
import Link from "next/link";

export default async function HotelCatalog({
  HotelJson,
}: {
  HotelJson: Promise<HotelJson>;
}) {
  const hotelJsonReady = await getHotels();
// export default function HotelCatalog(){
  return (
    <>
      <div
        style={{
          margin: "20px",
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-around",
          alignContent: "space-around",
          padding: "20px",
        }}
      >
        {hotelJsonReady.data.map((Item: HotelItem) => (
          // <Link href={`/room/`} className="w-1/5">
            <Card hotelName={Item.data.name}
              imgSrc={Item.data.imgSrc}
              location={Item.data.address}
              rating={Item.data.averageRating}
              hid={Item.data.id} />
          /* </Link> */
        ))}
            

      </div>
    </>
  );
}
