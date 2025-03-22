'use client'

import { useSession } from "next-auth/react";

export default function UserProfile() {

    const { data: session, status } = useSession()

    return (
      <div className="mt-20 max-w-xl ml-20 px-4">
        <h1 className="text-[48px] font-bold text-black mb-10">User Profile</h1>
        <div className="mb-6">
        <p className="text-[18px] font-bold text-[#456DF2]">Username</p>
          <div className="flex justify-between items-center">
        {
            session? <p className="text-[30px] text-[#456DF2] font-bold">{session.user.name}</p>:null
        }
          <button className="text-[18px] text-[#456DF2] font-semibold hover:underline ">Edit</button>
          </div>
          <hr className="mt-2 border-gray-300" />
        </div>
  
        <div className="mb-6">
          <p className="text-[18px] font-bold text-[#456DF2]">Email</p>
        {
            session? <p className="text-[30px] text-[#456DF2] font-bold">{session.user.email}
            </p>:null
        }
          <hr className="mt-2 border-gray-300" />
        </div>

        <div>
          <p className="text-[18px] font-bold text-[#456DF2]">Telephone</p>
        {
            session? <p className="text-[30px] text-[#456DF2] font-bold">{session.user.tel}</p>:null
        }
          
          <hr className="mt-2 border-gray-300" />
        </div>
      </div>
    );
  }