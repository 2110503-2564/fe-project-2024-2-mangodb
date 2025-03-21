import Card from "./HotelCard";

export default async function HotelCatalog({
  HotelJson,
}: {
  HotelJson: Promise<HotelJson>;
}) {
  const hotelJsonReady = await HotelJson;
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
          <Card
            hotelName={Item.name}
            imgSrc={Item.imgSrc}
            location={Item.address}
            rating={Item.averageRating}
            hid={Item.id}
          />
          /* </Link> */
        ))}
      </div>
    </>
  );
}
