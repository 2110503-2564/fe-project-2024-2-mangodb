import styles from "./topmenu.module.css";
import Image from "next/image";
import TopMenuItem from "./TopMenuItem";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { Link } from "@mui/material";

export default async function TopMenu() {
  const session = await getServerSession(authOptions);

  return (
    <div className={styles.menucontainer}>
      <div className="flex flex-row absolute left-0 h-full ml-5">
        <TopMenuItem title="MangoHotel" pageRef="/" 
        className="mx-3 my-auto font-verdana text-[15pt] font-bold text-indigo-500"/>
        <TopMenuItem title="Select Hotel" pageRef="/hotel" 
        className="mx-3 my-auto font-verdana font-semibold text-indigo-500"/>
        <TopMenuItem title="Booking" pageRef="/booking" 
        className="mx-3 my-auto font-verdana font-semibold text-indigo-500"/>
      </div>

      <div className="flex flex-row absolute right-0 h-full ml-5">
        <TopMenuItem title="My Booking" pageRef="/mybooking" 
        className="mx-3 my-auto font-verdana font-semibold text-indigo-500"/>
        {
          session? 
          /* If user did not log in */
          <div className="mx-3 my-auto font-verdana font-semibold text-indigo-500 flex flex-row">
          <TopMenuItem title="Logout" pageRef="/booking" 
        className="mx-3 my-auto font-verdana font-semibold text-indigo-500"/>
          <Image src={'/img/logo.png'} className={styles.logoimg} alt='logo'
        width={0} height={0} sizes="5vh"/>
        </div>
        :
        /* If user already log in */
        <div className="mx-3 my-auto font-verdana font-semibold text-indigo-500">
            <TopMenuItem title="Sign up" pageRef="" 
        className="mx-3 my-auto font-verdana font-semibold text-indigo-500"/>
        <TopMenuItem title="Log in" pageRef="/api/auth/signin" 
        className="mx-3 my-auto font-verdana font-semibold text-indigo-500"/>
          </div>
        }
      </div>
    </div>
  );
}
