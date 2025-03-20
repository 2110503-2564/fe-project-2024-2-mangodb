import Card from "./Card";
import Link from "next/link";

export default async function VenueCatalog({
  venuesJson,
}: {
  venuesJson: Promise<VenueJson>;
}) {
  const venueJsonReady = await venuesJson;

  return (
    <>
      Explore {venueJsonReady.count} venues in our catalog
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
        {venueJsonReady.data.map((venueItem: VenueItem) => (
          <Link href={`/venue/${venueItem.id}`} className="w-1/5">
            <Card venueName={venueItem.name} imgSrc={venueItem.picture} />
          </Link>
        ))}
      </div>
    </>
  );
}
