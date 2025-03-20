"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./banner.module.css";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function Banner() {
  const covers = [
    "/img/cover.jpg",
    "/img/cover2.jpg",
    "/img/cover3.jpg",
    "/img/cover4.jpg",
  ];
  const [index, setIndex] = useState(0);
  const router = useRouter();

  const { data: session } = useSession();

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
        <h1 className="text-4xl font-medium text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,1)]">
          where every event finds its venue
        </h1>
        <h3 className="text-xl font-medium text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,1)]">
          Finding the perfect venue has never been easier. Whether it's a
          wedding, corporate party, we connecting people to perfect place.
        </h3>
      </div>
      {session ? (
        <div className="z-30 absolute top-5 right-5 font-semibold text-white text-xl">
          Welcome {session.user?.name}
        </div>
      ) : null}
      <button
        className="bg-white text-cyan-600 border border-cyan-600 font-semibold 
        py-2 px-2 m-3 rounded z-30 absolute bottom-0 right-0 hover:bg-cyan-600
        hover:text-white hover:border-transparent"
        onClick={(e) => {
          e.stopPropagation();
          router.push("/venue");
        }}
      >
        Select Venue
      </button>
    </div>
  );
}
