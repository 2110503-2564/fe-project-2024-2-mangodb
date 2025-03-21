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
      <Image src={"/img/mango-31-512.png"} width={64} height={0} alt="MangoHotel" className="flex absolute left-[160px]"/>
      <div className="flex flex-row absolute left-0 h-full ml-5">
        
        <TopMenuItem title="MangoHotel" pageRef="/" 
        className="mx-3 my-auto font-verdana text-[15pt] font-bold text-indigo-500 absolute left-[10px] top-[14px]"/>
        <TopMenuItem title="Select Hotel" pageRef="/hotel" 
        className="mx-3 my-3 font-verdana font-semibold text-indigo-500 text-base absolute left-[220px] top-[4px] whitespace-nowrap
        hover:text-indigo-700"/>
        <TopMenuItem title="Booking" pageRef="/booking" 
        className="mx-3 my-3 font-verdana font-semibold text-indigo-500 text-base absolute left-[350px] top-[4px] 
        hover:text-indigo-700"/>
      </div>

      <div className="flex flex-row absolute right-0 h-full ml-5 ">
        <TopMenuItem title="My Booking" pageRef="/mybooking" 
        className="mx-3 my-3 font-verdana font-semibold text-indigo-500 text-base absolute right-[270px] top-[4px] whitespace-nowrap
        hover:text-indigo-700"/>
        {
          session? 
          /* If user already log in */
        <div className="mx-3 my-auto font-verdana font-semibold text-indigo-500">
          <TopMenuItem title="Logout" pageRef="/booking" 
          className="mx-3 my-auto font-verdana font-semibold text-indigo-500 absolute right-[130px] top-[10px]"/>
          <Image src={'/img/logo.png'} className={styles.logoimg} alt='logo'
          width={0} height={0} sizes="5vh"/>
        </div>
        :
        /* If user did not log in */
        <div className="mx-3 my-auto font-verdana font-semibold text-indigo-500">
            <TopMenuItem title="Sign Up" pageRef="auth/signup" 
        className="mx-3 my-auto font-verdana font-semibold text-indigo-500 border border-indigo-500 rounded-3xl px-7 py-2 absolute right-[130px]
        hover:bg-gray-200 whitespace-nowrap top-[8px]"/>
        <TopMenuItem title="Login" pageRef="/api/auth/signin" 
        className="mx-3 my-auto font-verdana font-semibold text-indigo-500 text-white bg-indigo-500 rounded-3xl px-8 py-2 absolute right-[10px]
        hover:border-indigo-500 hover:bg-indigo-700 top-[8px]"/>
          </div>
        }
      </div>
    </div>
  );
}
