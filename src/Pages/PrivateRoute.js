import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  useEffect(() => {
    if (!window.localStorage.getItem("user") && user === null) {
      toast.remove();
      navigate("/auth");
    }
  });
  if (user !== null) {
    return children;
  }
};

export default PrivateRoute;
