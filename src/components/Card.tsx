"use client";

import Image from "next/image";
import InteractiveCard from "./InteractiveCard";
import Rating from "@mui/material/Rating";
import React from "react";
import { useState } from "react";

export default function Card({
  venueName,
  imgSrc,
  onCompare,
}: {
  venueName: string;
  imgSrc: string;
  onCompare?: Function;
}) {
  const [value, setValue] = useState<number | null>(0);

  return (
    <InteractiveCard>
      <div className="w-full h-[70%] relative rounded-t-lg">
        <Image
          src={imgSrc}
          alt="Product Picture"
          fill={true}
          className="object-cover rounded-t-lg"
        />
      </div>
      <div className="w-full h-[15%] p-[10px] font-medium">{venueName}</div>
      {onCompare ? (
        <Rating
          id={venueName}
          name={venueName}
          data-testid={venueName + " Rating"}
          className="ml-[10px]"
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
            onCompare(venueName, newValue);
          }}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        ""
      )}
    </InteractiveCard>
  );
}
