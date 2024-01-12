import React, { useState } from "react";
import Chats from "../Components/Chats";
import SingalChat from "../Components/SingalChat";

const Home = () => {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <div className="container rounded-2xl min-h-screen max-h-screen mx-auto font-Kanit w-full h-auto p-4 bg-gray-400/20 bg-opacity-20">
      <div className="bg-white h-auto hide_scrollbar overflow-auto p-5 border border-gray-500 rounded-2xl w-full flex justify-start items-start gap-4">
        <Chats setSelectedChat={setSelectedChat} />
        {selectedChat === null ? (
          <div className="lg:w-2/3 w-full bg-gray-100 rounded-lg min-h-[90vh] max-h-[90vh] sticky top-0 overflow-auto hide_scrollbar">
            <div className="flex w-full h-screen items-center justify-center">
              Select your chat.
            </div>
          </div>
        ) : (
          <SingalChat
            setSelectedChat={setSelectedChat}
            selectedChat={selectedChat}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
