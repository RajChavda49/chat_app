import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Chats from "../Components/Chats";
import SingalChat from "../Components/SingalChat";
// import { getUrl, postUrl, putUrl } from "../baseurl";
// import { ChatState, token } from "../context/ChatProvider";
import toast from "react-hot-toast";

const Home = () => {
  const [fetchAgain, setFetchAgain] = useState([]);

  const { user } = useSelector((s) => s.auth);

  const navigate = useNavigate();

  useEffect(() => {
    if (user === null) {
      navigate("/auth");
    }
  }, []);

  return (
    <div className="container rounded-2xl min-h-screen max-h-screen mx-auto font-Kanit w-full h-auto p-4 bg-gray-400/20 bg-opacity-20">
      <div className="bg-white h-auto hide_scrollbar overflow-auto p-5 border border-gray-500 rounded-2xl w-full flex justify-start items-start gap-4">
        <Chats fetchAgain={fetchAgain} />

        <SingalChat fetchAgain={fetchAgain} setfetchAgain={setFetchAgain} />
      </div>
    </div>
  );
};

export default Home;
