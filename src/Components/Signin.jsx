import React, { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
// import { postUrl } from "../baseurl";
import { toast } from "react-hot-toast";
import { json, useNavigate } from "react-router-dom";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, goolgeProvider } from "../firebase/firebase";
import { useDispatch, useSelector } from "react-redux";
import { handleChangeUser } from "../Redux/AuthSlice";
import { FcGoogle } from "react-icons/fc";

const Signin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((s) => s.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const signinschema = yup.object().shape({
    email: yup.string().email().required("email is required").trim(),
    password: yup.string().required("password is required").trim(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(signinschema),
  });

  const onSubmit = async (data) => {
    const { email, password } = data;
    setLoading(true);
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      if (user.emailVerified) {
        toast.success("Login successfully.");
        dispatch(handleChangeUser(user));
        setLoading(false);
        navigate("/");
        window.location.reload();
      } else {
        setLoading(false);
        toast.error("please verfiy your email.");
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  const handleSigninWithGoogle = async () => {
    try {
      const { user } = await signInWithPopup(auth, goolgeProvider);
      dispatch(handleChangeUser(user));
      setLoading(false);
      toast.success("Login successfully.");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user === null) {
      navigate("/auth");
    } else {
      navigate("/");
    }
  }, [user]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 w-full">
      <input
        type="email"
        placeholder="Enter your email"
        className=" w-full p-2 outline-none bg-white focus:ring-2 ring-green-400 rounded-lg"
        {...register("email")}
      />
      <span className="text-red-500 font-semibold capitalize">
        {errors?.email?.message}
      </span>
      <div className="w-full relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          className=" w-full p-2 outline-none bg-white focus:ring-2 ring-green-400 rounded-lg"
          {...register("password")}
        />

        <span
          className="absolute top-1 right-3 cursor-pointer bg-gray-200 rounded-lg p-1"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "Hide" : "Show"}
        </span>
      </div>
      <span className="text-red-500 font-semibold capitalize">
        {errors?.password?.message}
      </span>
      <button
        type="submit"
        className="uppercase w-full bg-blue-500 rounded-lg p-2 text-white font-semibold transition active:scale-95 hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Logging in..." : "login"}
      </button>
      <button
        type="button"
        onClick={() => handleSigninWithGoogle()}
        className="uppercase w-full bg-white rounded-lg p-2 text-blue-500 font-semibold transition active:scale-95"
      >
        <FcGoogle className="h-6 w-6 inline-block mr-2" />
        <span>Sign in with google</span>
      </button>
    </form>
  );
};

export default Signin;
