import Card from "./HotelCard";
import Link from "next/link";

// export default async function HotelCatalog({
//   venuesJson,
// }: {
//   venuesJson: Promise<HotelJson>;
// }) {
//   const venueJsonReady = await venuesJson;
export default function HotelCatalog(){

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
        {/* {venueJsonReady.data.map((venueItem: HotelItem) => (
          <Link href={`/room/`} className="w-1/5">
            <Card venueName="Bangkok Hotel"
              imgSrc="your-image-url.jpg"
              location="Bangkok, Thailand"
              rating={5.0}
              hid="12345" />
          </Link>
        ))} */}
            <Card hotelName="Bangkok Hotel"
              imgSrc="/img/grandtable.jpg"
              location="Bangkok, Thailand"
              rating={5.0}
              hid="12345" />

      </div>
    </>
  );
}
