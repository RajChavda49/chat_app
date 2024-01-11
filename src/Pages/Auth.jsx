import React, { useEffect, useState } from "react";
import Signin from "../Components/Signin";
import Signup from "../Components/Signup";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Auth = () => {
  const [activeComponent, setActiveComponent] = useState("sign_in");

  const navigate = useNavigate();

  //   useEffect(() => {
  //     if (window.localStorage.getItem("user")) {
  //       navigate("/");
  //       toast.error("Already logged in.");
  //     }
  //   }, []);

  return (
    <div className=" w-screen h-screen flex items-center justify-center bg-gradient-to-tr from-[#ED4264] to-[#FFEDBC]">
      <div className="w-[30%] gap-2 flex flex-col items-start p-3 bg-white bg-opacity-50 backdrop-blur-lg uppercase rounded-lg drop-shadow-lg">
        <p className="font-semibold text-4xl text-center w-full tracking-wide h-auto bg-gradient-to-tr from-[#48c6ef] to-[#6f86d6] bg-clip-text text-transparent">
          <Link to="/">Chat App</Link>
        </p>
        <div className="w-full space-y-4 h-full flex items-center justify-center flex-col">
          <div className="flex w-full items-center gap-2">
            <p
              className={`text-white text-center transition cursor-pointer text-lg font-semibold ${
                activeComponent === "sign_in" && "bg-blue-500"
              } w-1/2 p-1 rounded-full`}
              onClick={() => setActiveComponent("sign_in")}
            >
              Login
            </p>
            <p
              className={`text-white text-center transition cursor-pointer text-lg font-semibold ${
                activeComponent === "sign_up" && "bg-blue-500"
              } w-1/2 p-1 rounded-full`}
              onClick={() => setActiveComponent("sign_up")}
            >
              Sign up
            </p>
          </div>
          {activeComponent === "sign_in" ? <Signin /> : <Signup />}
        </div>
      </div>
    </div>
  );
};

export default Auth;
