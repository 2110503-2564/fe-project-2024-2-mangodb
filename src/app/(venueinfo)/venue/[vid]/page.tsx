import Image from "next/image";
import getVenue from "@/libs/getVenue";

export default async function VenueDetailPage({
  params,
}: {
  params: { vid: string };
}) {
  const venueDetail = await getVenue(params.vid);
  /**
   * Mock Data for Demontration Only
   */
  /*
  const mockVenueData = new Map();
  mockVenueData.set("001", {
    name: "The Bloom Pavilion",
    image: "/img/bloom.jpg",
  });
  mockVenueData.set("002", {
    name: "Spark Space",
    image: "/img/sparkspace.jpg",
  });
  mockVenueData.set("003", {
    name: "The Grand Table",
    image: "/img/grandtable.jpg",
  });
  */

  return (
    <main className="text-center p-5">
      <h1 className="text-lg font-medium mb-16">{venueDetail.data.name}</h1>
      <div className="flex flex-row my-5">
        <Image
          src={venueDetail.data.picture}
          alt="Car Image"
          width={0}
          height={0}
          sizes="100vw"
          className="rounded-lg w-[30%]"
        />
        <div className="text-medium mx-5 text-left mt-5">
          <div className="text-md mx-5">Name: {venueDetail.data.name}</div>
          <div className="text-md mx-5">
            Address: {venueDetail.data.address}
          </div>
          <div className="text-md mx-5">
            District: {venueDetail.data.district}
          </div>
          <div className="text-md mx-5">
            Province: {venueDetail.data.province}
          </div>
          <div className="text-md mx-5">
            Postalcode: {venueDetail.data.postalcode}
          </div>
          <div className="text-md mx-5">Tel: {venueDetail.data.tel}</div>
          <div className="text-md mx-5">
            Dailyrate: {venueDetail.data.dailyrate}
          </div>
        </div>
      </div>
    </main>
  );
}

/*
export async function generateStaticParams() {
  return [
    { params: { vid: "001" } },
    { params: { vid: "002" } },
    { params: { vid: "003" } },
  ];
}
*/
