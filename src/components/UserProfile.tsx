"use client";
import { useSession } from "next-auth/react";
import getUserProfile from "@/libs/getUserProfile";
import { useState, useEffect } from "react";
import updateMe from "@/libs/updateMe";
import { toast } from "react-toastify";

export default function UserProfile() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<any>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingTel, setIsEditingTel] = useState(false);
  const [editName, setEditName] = useState("");
  const [editTel, setEditTel] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (session?.user.token) {
          const userData = await getUserProfile(session.user.token);
          setUser(userData.data);
          setEditName(userData.data.name);
          setEditTel(userData.data.tel);
        }
      } catch (err) {
        console.error("Failed to load user:", err);
      }
    };

    if (session?.user.token) {
      fetchUser();
    }
  }, [session]);

  const handleSaveName = async () => {
    try {
      if (session?.user.token == null) return;
      const updatedUser = await updateMe(session.user.token, editName, null);

      if (updatedUser.data?.name) {
        setUser((prevUser: any) => ({
          ...prevUser,
          name: updatedUser.data.name,
        }));
      }

      toast.success("Name updated successfully!");
      setIsEditingName(false);
    } catch (error: any) {
      toast.error(error.message);
      console.error("Error updating name:", error);
    }
  };

  const handleSaveTel = async () => {
    try {
      if (session?.user.token == null) return;
      const updatedUser = await updateMe(session.user.token, null, editTel);

      if (updatedUser.data?.tel) {
        setUser((prevUser: any) => ({
          ...prevUser,
          tel: updatedUser.data.tel,
        }));
      }

      toast.success("Phone number updated successfully!");
      setIsEditingTel(false);
    } catch (error: any) {
      toast.error(error.message);
      console.error("Error updating tel:", error);
    }
  };

  if (status === "loading" || !user) {
    return <div className="mt-20 ml-20 text-lg">Loading...</div>;
  }

  return (
    <main className="bg-gray-200 bg-cover h-[100vh]">
      <div className="pt-[15vh] max-w-xl ml-20 px-4">
        <h1 className="text-[48px] font-bold text-black mb-10">User Profile</h1>

        {/* Username */}
        <div className="mb-8">
          <p className="text-[18px] font-bold text-[#456DF2]">Username</p>
          <div className="flex justify-between items-center">
            {isEditingName ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="text-[30px] text-[#456DF2] font-bold"
              />
            ) : (
              <p className="text-[30px] text-[#456DF2] font-bold">
                {user?.name || "N/A"}
              </p>
            )}
            <button
              className="text-[18px] text-[#456DF2] font-semibold hover:underline"
              onClick={() => setIsEditingName(true)}
            >
              Edit
            </button>
          </div>
          <hr className="mt-2 border-gray-300" />
        </div>

        {/* Save Button สำหรับ Name */}
        {isEditingName && (
          <button
            onClick={handleSaveName}
            className="mb-8 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 active:bg-blue-700 transition-colors duration-300"
            style={{ transform: "translateY(-16px)" }}
          >
            Save
          </button>
        )}

        {/* Email */}
        <div className="mb-6">
          <p className="text-[18px] font-bold text-[#456DF2]">Email</p>
          <p className="text-[30px] text-[#456DF2] font-bold">
            {user?.email || "N/A"}
          </p>
          <hr className="mt-2 bordser-gray-300" />
        </div>

        {/* Telephone */}
        <div>
          <p className="text-[18px] font-bold text-[#456DF2]">Telephone</p>
          <div className="flex justify-between items-center">
            {isEditingTel ? (
              <input
                type="tel"
                value={editTel}
                onChange={(e) => setEditTel(e.target.value)}
                className="text-[30px] text-[#456DF2] font-bold"
              />
            ) : (
              <p className="text-[30px] text-[#456DF2] font-bold">
                {user?.tel || "N/A"}
              </p>
            )}
            <button
              className="text-[18px] text-[#456DF2] font-semibold hover:underline"
              onClick={() => setIsEditingTel(true)}
            >
              Edit
            </button>
          </div>
          <hr className="mt-2 border-gray-300" />
        </div>

        {/* Save Button สำหรับ Tel */}
        {isEditingTel && (
          <button
            onClick={handleSaveTel}
            className="mt-4 px-4 py-2 bg-blue-500 rounded-xl text-white rounded hover:bg-blue-600 active:bg-blue-700 transition-colors duration-300"
          >
            Save
          </button>
        )}
      </div>
    </main>
  );
}
