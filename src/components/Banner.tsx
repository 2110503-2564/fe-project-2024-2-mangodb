"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./banner.module.css";
import Image from "next/image";
import { useSession } from "next-auth/react";
import SearchBar from "./SearchBar";

export default function Banner() {
  const covers = [
    "/img/Banner-2.png",
    "/img/Banner-2.png",
    "/img/Banner-2.png",
    "/img/Banner-2.png",
  ];
  const [index, setIndex] = useState(0);

  return (
    <div className={styles.banner} onClick={() => setIndex(index + 1)}>
      <Image
        src={covers[index % 4]}
        alt="concert event"
        fill={true}
        objectFit="cover"
        className={styles.image}
      />
      <div className={styles.bannerText}>
        <h1 className="text-4xl font-medium text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,1)] font-tiltWarp text-2xl">
          Find your dream stay-
          <br />
          easy
        </h1>
        <h3
          className="text-xl font-medium text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,1)] font-tiltWarp text-base 
         mb-10"
        >
          bookingbest rates, exceptional service.
        </h3>

        <SearchBar />
      </div>
    </div>
  );
}
