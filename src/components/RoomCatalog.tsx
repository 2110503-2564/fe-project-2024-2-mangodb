"use client";

import RoomCard from "./RoomCard";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function RoomCatalog({
  RoomJson,
}: {
  RoomJson: Promise<RoomJson>;
}) {
  const [Rooms, setRooms] = useState<RoomItem[]>([]);

  const searchParams = useSearchParams();

  const [checkInDate, setCheckInDate] = useState<string | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<string | null>(null);
  const [adult, setAdult] = useState<any>(null);
  const [children, setChildren] = useState<any>(null);

  useEffect(() => {
    // Check if parameters exist in the URL
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");
    const adultParam = searchParams.get("adult");
    const childrenParam = searchParams.get("children");

    // Only set state if parameters are found in the URL
    if (checkIn) setCheckInDate(checkIn);
    if (checkOut) setCheckOutDate(checkOut);
    if (adultParam) setAdult(adultParam);
    if (childrenParam) setChildren(childrenParam);
  }, [searchParams]);

  useEffect(() => {
    const setAvailableRooms = async () => {
      const roomJsonReady = await RoomJson;

      const availableRooms = roomJsonReady.data.filter((room: RoomItem) => {
        return room.availableRooms > 0;
      });
      setRooms(availableRooms);
    };

    setAvailableRooms();
  }, []);

  return (
    <div
      style={{
        height: "90vh",
        overflowY: "auto",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "30px",
          padding: "40px",
        }}
      >
        {Rooms.filter((Item: RoomItem) => {
          if (adult && children) {
            return (
              Item.size_description.adults >= adult &&
              Item.size_description.children >= children
            );
          }
          return true;
        }).map((Item: RoomItem) => (
          <RoomCard
            pricePerNight={Item.pricePerNight}
            imgSrc={Item.imgSrc}
            hid={Item.hotel}
            size={Item.size}
            adult={Item.size_description.adults}
            children={Item.size_description.children}
            key={Item._id}
            checkInDate={checkInDate || ""}
            checkOutDate={checkOutDate || ""}
          />
        ))}
      </div>
    </div>
  );
}
