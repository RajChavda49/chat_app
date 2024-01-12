import React, { useEffect, useRef, useState } from "react";
import { FaTelegramPlane } from "react-icons/fa";
import { ImAttachment } from "react-icons/im";
import { useSelector } from "react-redux";
import {
  Timestamp,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase/firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import toast from "react-hot-toast";

const SingalChat = ({ selectedChat }) => {
  const [messages, setMessages] = useState([]);
  const [image, setImage] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  const { user } = useSelector((s) => s.auth);

  const newRef = useRef(null);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (image) {
      toast.loading("sending message...");
      const storageRef = ref(storage, uuid());
      await uploadBytesResumable(storageRef, image).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            await updateDoc(doc(db, "chats", selectedChat[0]), {
              messages: arrayUnion({
                id: uuid(),
                text: newMessage,
                senderId: user?.uid,
                date: Timestamp.now(),
                image: downloadURL,
              }),
            });
            toast.remove();
          } catch (err) {
            toast.remove();
            toast.error(err.message);
            console.log(err.message);
          }
        });
        toast.remove();
        setImage(null);
        setNewMessage("");
      });
    } else {
      await updateDoc(doc(db, "chats", selectedChat[0]), {
        messages: arrayUnion({
          id: uuid(),
          text: newMessage,
          senderId: user?.uid,
          date: Timestamp.now(),
        }),
      });
      setImage(null);
      setNewMessage("");
      await updateDoc(doc(db, "userChats", user.uid), {
        [selectedChat[0] + ".lastMessage"]: {
          text: newMessage,
        },
        [selectedChat[0] + ".date"]: serverTimestamp(),
      });

      await updateDoc(doc(db, "userChats", selectedChat[1]?.userInfo.uid), {
        [selectedChat[0] + ".lastMessage"]: {
          text: newMessage,
        },
        [selectedChat[0] + ".date"]: serverTimestamp(),
      });
    }
  };

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "chats", selectedChat[0]), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });
    return () => {
      unsub();
    };
  }, [selectedChat]);

  useEffect(() => {
    newRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [newMessage]);

  return (
    <div className="lg:w-2/3 w-full bg-gray-100 rounded-lg min-h-[90vh] max-h-[90vh] sticky top-0 overflow-auto hide_scrollbar">
      <>
        <div className="bg-black blur-md w-full p-2 sticky top-0 z-10"></div>
        {/* chat name */}
        <div className="flex w-[97%] items-center mx-auto justify-between mt-1 bg-white p-2 sticky top-1 z-10 rounded-lg">
          <div className="font-meduim text-2xl capitalize gap-2 flex items-center">
            <img
              src={selectedChat[1]?.userInfo?.photoURL}
              alt={selectedChat[1]?.userInfo?.displayName}
              className="border rounded-full h-14 w-14 object-cover object-center"
            />
            <p>{selectedChat[1]?.userInfo?.displayName}</p>
          </div>
        </div>
        {/* messages */}
        <div className="space-y-3 overflow-y-scroll min-h-[90vh] max-h-[90vh] hide_scrollbar p-3">
          {/*  receiver */}
          {messages.map((message) => (
            <div key={message?.id} className="flex items-center gap-x-2">
              {message?.image ? (
                <div className="flex-col flex gap-2">
                  <img
                    src={message?.image}
                    alt={user?.displayName}
                    className="border rounded-lg h-80 w-fit object-cover object-center"
                  />
                  {message?.text !== "" && (
                    <p
                      className={`${
                        message.senderId === user.uid
                          ? "bg-white text-black ml-auto"
                          : `bg-gray-400 text-white mr-auto  `
                      } text-left w-fit p-2 rounded-2xl  max-w-[70%]`}
                    >
                      {message?.text}
                    </p>
                  )}
                </div>
              ) : (
                <span
                  className={`${
                    message.senderId === user.uid
                      ? "bg-white text-black ml-auto"
                      : `bg-gray-400 text-white mr-auto  `
                  } text-left w-fit p-2 rounded-2xl  max-w-[70%]`}
                >
                  {message?.text}
                </span>
              )}
            </div>
          ))}
        </div>
        <div ref={newRef}></div>

        {/* input */}
        <form
          onSubmit={handleSendMessage}
          className="w-[97%] bg-white left-2 rounded-lg p-2 sticky bottom-1 flex gap-x-3 items-center justify-between"
        >
          <input
            type="text"
            className="w-full pr-10 outline-none placeholder:font-medium placeholder:text-lg"
            placeholder="Type your message here..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <div className="relative w-8 h-8 cursor-pointer z-10">
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              className="absolute inset-0 z-10 opacity-0"
            />
            <ImAttachment className="cursor-pointer absolute inset-0 h-8 w-8 text-black" />
          </div>
          <button type="submit">
            <FaTelegramPlane
              size={40}
              className="bg-green-500 cursor-pointer text-white p-2 rounded-lg"
            />
          </button>
        </form>
      </>
    </div>
  );
};

export default SingalChat;
