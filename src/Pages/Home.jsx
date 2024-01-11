import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user } = useSelector((s) => s.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (user === null) {
      navigate("/auth");
    }
  }, []);
  return <div>Home</div>;
};

export default Home;
