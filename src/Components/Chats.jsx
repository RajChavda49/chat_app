import React, { memo, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import {
  AiOutlineBell,
  AiOutlineNotification,
  AiOutlinePlus,
  AiOutlineSearch,
  AiOutlineUser,
} from "react-icons/ai";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import SkeletonLoading from "./SkeletonLoading";
import { useDispatch, useSelector } from "react-redux";
import { handleChangeUser } from "../Redux/AuthSlice";
import { auth, db } from "../firebase/firebase";
import {
  collection,
  where,
  query,
  getDocs,
  setDoc,
  updateDoc,
  serverTimestamp,
  doc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { IoIosSearch } from "react-icons/io";

const Chats = ({ setSelectedChat }) => {
  const [chats, setChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [searchUserData, setSearchUserData] = useState(null);
  const [showNotificationDropdown, setShowNotificationDropdown] =
    useState(false);

  const { user } = useSelector((s) => s.auth);

  const dispacth = useDispatch();

  const navigate = useNavigate();

  const dropDownref = useRef(null);
  const searchRef = useRef(null);

  const handleLogout = async () => {
    try {
      toast.loading("Logout...");
      await auth.signOut();
      setShowProfileDropdown(false);
      setTimeout(() => {
        toast.remove();
        window.localStorage.clear();
        dispacth(handleChangeUser(null));
        navigate("/auth");
      }, 2000);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSearchUser = async () => {
    toast.remove();
    if (searchTerm === "") {
      searchRef.current.focus();
      return toast.error("enter word");
    }
    setSearchLoading(true);
    const q = query(
      collection(db, "users"),
      where("displayName", "==", searchTerm)
    );
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setSearchUserData(doc.data());
      });
      if (querySnapshot.size == 0) {
        toast.error("User not found.");
        setSearchUserData(null);
      }
      setSearchLoading(false);
    } catch (err) {
      setSearchLoading(false);
      console.log(err);
    }
  };

  const handleSelect = async () => {
    //check whether the group(chats in firestore) exists, if not create
    const combinedId =
      user.uid > searchUserData.uid
        ? user.uid + searchUserData.uid
        : searchUserData.uid + user.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));
      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        //create user chats
        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: searchUserData.uid,
            displayName: searchUserData.displayName,
            photoURL: searchUserData.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", searchUserData.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        toast.remove();
      }
    } catch (err) {
      toast.remove();
      toast.error(err.message, { style: { wordBreak: "break-all" } });
      console.log(err.message);
    }
    setSearchUserData(null);
    setSearchTerm("");
  };

  useEffect(() => {
    setLoading(true);
    const unsub = onSnapshot(doc(db, "userChats", user?.uid), (doc) => {
      if (doc.data()) {
        setChats(Object.entries(doc.data()));
      }
      setLoading(false);
    });

    return () => {
      unsub();
    };
  }, [user?.uid]);

  // console.log(loading, searchLoading);
  // console.log(searchUserData);
  // console.log(chats);

  return (
    <>
      <ProfileModal
        showProfileModal={showProfileModal}
        setShowProfileModal={setShowProfileModal}
      />

      <div className="lg:w-1/3 lg:block hidden min-h-[90vh] max-h-[90vh] space-y-4">
        <div className="sticky top-0 space-y-4 bg-white pb-1">
          <div className="flex items-center justify-between">
            <h2 className="font-medium text-3xl sticky top-0">Chats</h2>
            {/* profile */}
            <div className="relative flex items-center gap-2">
              {/* notificaion dropdown */}
              <div
                ref={dropDownref}
                className={`absolute -bottom-24 z-10 right-12 select-none space-y-3 p-2 w-40  rounded-xl bg-gray-300 shadow-2xl text-white font-semibold transition duration-300 ease-out origin-top-right ${
                  showNotificationDropdown ? "scale-100" : "scale-0"
                }`}
              ></div>
              {user?.photoURL ? (
                <img
                  src={user?.photoURL}
                  alt="user"
                  className="border  cursor-pointer rounded-full h-14 w-14 object-contain object-center mx-auto"
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                />
              ) : (
                <AiOutlineUser
                  size={40}
                  className="bg-gray-300 rounded-full p-1 cursor-pointer"
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                />
              )}
              {/* profile dropdown */}
              <div
                ref={dropDownref}
                className={`absolute -bottom-24 z-10 right-0 select-none space-y-3 p-2 w-40  rounded-xl bg-gray-100 shadow-2xl text-black font-semibold transition duration-300 ease-out origin-top-right ${
                  showProfileDropdown ? "scale-100" : "scale-0"
                }`}
              >
                <p
                  onClick={() => {
                    setShowProfileModal(true);
                    setShowProfileDropdown(false);
                  }}
                  className="hover:bg-gray-300 hover:text-black rounded-lg p-1 transition cursor-pointer"
                >
                  Profile
                </p>
                <p
                  onClick={handleLogout}
                  className="text-red-400 hover:bg-gray-100 p-1 rounded-lg transition cursor-pointer"
                >
                  Logout
                </p>
              </div>
            </div>
          </div>
          <hr />
          {/* search */}
          <div className="w-full relative flex items-center justify-between bg-gray-100 rounded-lg">
            <input
              type="text"
              placeholder="search with name"
              className="w-full placeholder:text-gray-400 placeholder:font-medium p-2 pr-12 outline-none focus:ring-2 rounded-lg bg-gray-100 "
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.code === "Enter" && handleSearchUser()}
              value={searchTerm}
              ref={searchRef}
            />
            <IoIosSearch
              onClick={() => handleSearchUser()}
              className="h-7 w-7 cursor-pointer"
            />
          </div>
        </div>
        {/* chats */}
        <div className="overflow-y-scroll md:space-y-1 space-y-2 hide_scrollbar">
          {loading || searchLoading ? (
            <div className="space-y-2">
              <SkeletonLoading />
              <SkeletonLoading />
              <SkeletonLoading />
              <SkeletonLoading />
            </div>
          ) : searchUserData && searchTerm !== "" ? (
            <div
              key={searchUserData?.uid}
              className={`w-full hover:bg-gray-100 transition-all duration-100 ease-in-out cursor-pointer flex items-center justify-between p-3 rounded-lg ${
                searchUserData?.uid === "as" && "bg-gray-100"
              } `}
              onClick={() => {
                handleSelect();
              }}
            >
              <div className="flex w-[90%] gap-x-3 items-center">
                {searchUserData?.displayName ? (
                  <img
                    src={searchUserData?.photoURL}
                    alt={searchUserData?.displayName}
                    className="border rounded-full h-14 w-14 object-cover object-center"
                  />
                ) : (
                  <FaUserCircle
                    size={30}
                    className="bg-gray-100 text-gray-300 rounded-full w-12 h-12 p-2"
                  />
                )}
                <div>
                  <p className="font-semibold text-lg capitalize">
                    {searchUserData?.displayName}
                  </p>
                </div>
              </div>
            </div>
          ) : chats.length > 0 ? (
            chats
              .filter((chat) => chat[1]?.userInfo?.uid !== user?.uid)
              .sort((a, b) => b[1]?.date - a[1]?.date)
              .map((chat) => (
                <div
                  key={chat[0]}
                  className={`w-full hover:bg-gray-200 bg-gray-100 cursor-pointer flex items-center justify-between p-3 rounded-lg  `}
                  onClick={() => setSelectedChat(chat)}
                >
                  <div className="flex w-[90%] gap-x-3 items-center">
                    <img
                      src={chat[1]?.userInfo?.photoURL}
                      alt="user"
                      className="border cursor-pointer rounded-full h-14 w-14 object-cover object-center"
                    />
                    <div>
                      <p className="font-semibold text-xl capitalize text-black">
                        {chat[1]?.userInfo?.displayName}
                      </p>
                      <p className="font-light text-sm truncate line-clamp-1 capitalize text-black">
                        {chat[1]?.lastMessage?.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <div className="font-medium text-lg text-center text-gray-400">
              No chat here.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default memo(Chats);
