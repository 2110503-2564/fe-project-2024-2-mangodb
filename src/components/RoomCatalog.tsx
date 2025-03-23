import RoomCard from "./RoomCard";

export default async function RoomCatalog({
  RoomJson,
}: {
    RoomJson: Promise<RoomJson>;
}) {
  const roomJsonReady = await RoomJson;
  return (
    <div style={{
      height: "90vh",
      overflowY: "auto",
      padding: "20px",
    }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "30px",
          padding: "40px",
        }}
      >
        {roomJsonReady.data.map((Item: RoomItem) => (
          // <Link href={`/room/`} className="w-1/5">
          <RoomCard
            pricePerNight={Item.pricePerNight}
            imgSrc={Item.imgSrc}
            hid={Item.hotel}
            size={Item.size}
            adult={Item.size_description.adults}
            children={Item.size_description.children}
          />
          /* </Link> */
        ))}
      </div>
    </div>
  );
}
