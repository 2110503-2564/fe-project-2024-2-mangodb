// "use client";

// import Link from "next/link";
// import Card from "./HotelCard";
// import { useReducer } from "react";

// export default function CardPanel() {
//   let defaultVenue = new Map<string, number>([
//     ["The Bloom Pavilion", 0],
//     ["Spark Space", 0],
//     ["The Grand Table", 0],
//   ]);

//   const compareReducer = (
//     venueList: Map<string, number>,
//     action: { type: string; venueName: string; rating?: number }
//   ) => {
//     switch (action.type) {
//       case "add":
//         venueList.set(action.venueName, action.rating ?? 0);
//         return new Map(venueList);
//       case "remove":
//         venueList.delete(action.venueName);
//         return new Map(venueList);
//       default:
//         return venueList;
//     }
//   };

//   const [venueList, dispatchCompare] = useReducer(compareReducer, defaultVenue);

//   /**
//    * Mock Data for Demontration Only
//    */
//   const mockVenueData = [
//     { vid: "001", venueName: "The Bloom Pavilion", image: "/img/bloom.jpg" },
//     { vid: "002", venueName: "Spark Space", image: "/img/sparkspace.jpg" },
//     { vid: "003", venueName: "The Grand Table", image: "/img/grandtable.jpg" },
//   ];

//   return (
//     <div>
//       <div
//         style={{
//           margin: "20px",
//           display: "flex",
//           flexDirection: "row",
//           flexWrap: "wrap",
//           justifyContent: "space-around",
//           alignContent: "space-around",
//           padding: "20px",
//         }}
//       >
//         {mockVenueData.map((venueItem) => (
//           <Link href={`/venue/${venueItem.vid}`} className="w-1/5">
//             <Card
//               venueName={venueItem.venueName}
//               imgSrc={venueItem.image}
//               onCompare={(venueName: string, rating: number) =>
//                 dispatchCompare({ type: "add", venueName, rating })
//               }
//             />
//           </Link>
//         ))}
//       </div>
//       {/* Venue List With Rating */}
//       <div className="my-[50px]">
//         <div className="w-full text-xl font-medium">
//           Venue List with Ratings : {venueList.size}
//         </div>
//         {Array.from(venueList).map(([venueName, rating]) => (
//           <div
//             key={venueName}
//             data-testid={venueName}
//             onClick={() => dispatchCompare({ type: "remove", venueName })}
//           >
//             {venueName}: {rating}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
