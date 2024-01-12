import React, { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
// import { postUrl } from "../baseurl";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { auth, db, goolgeProvider, storage } from "../firebase/firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { handleChangeUser } from "../Redux/AuthSlice";
import { useDispatch } from "react-redux";
import { FcGoogle } from "react-icons/fc";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const signupschema = yup.object().shape({
    email: yup.string().email().required("email is required").trim(),
    password: yup
      .string()
      .required("password is required")
      .trim()
      .min(6, "Minimum 6 characters!"),
    pic: yup
      .mixed()
      .test(
        "fileSize",
        "Only pdf up to 1MB are permitted.",
        (files) =>
          !files || // Check if `files` is defined
          files.length === 0 || // Check if `files` is not an empty list
          Array.from(files).every((file) => file.size <= 1000000)
      )
      .test("fileType", "Unsupported File Format", (value) => {
        return value && value[0]?.type.includes("png", "jpg", "jpeg", "gif");
      }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      pic: "",
    },
    resolver: yupResolver(signupschema),
  });

  const onSubmit = async (data) => {
    const { password, email, pic } = data;
    setLoading(true);
    try {
      toast.loading("Creating account...");
      //Create user
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      //Create a unique image name
      const date = new Date().getTime();
      const storageRef = ref(storage, `${user?.displayName + date}`);
      toast.remove();
      toast.loading("Uploading image...");
      await uploadBytesResumable(storageRef, pic[0]).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            //Update profile
            await updateProfile(user, {
              displayName: user?.displayName,
              photoURL: downloadURL,
            });
            //create user on firestore
            await setDoc(doc(db, "users", user.uid), {
              uid: user.uid,
              displayName: user?.displayName,
              email,
              photoURL: downloadURL,
            });

            //create empty user chats on firestore
            await setDoc(doc(db, "userChats", user.uid), {});
            // Send email verification
            await sendEmailVerification(user);
            setLoading(false);
            toast.success(
              "User signed up successfully! Verification email sent."
            );
            dispatch(handleChangeUser(user));
            setLoading(false);
          } catch (err) {
            toast.error(err.message);
            console.log(err.message);
            setLoading(false);
          }
        });
      });
    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    }
  };

  const handleSigninWithGoogle = async () => {
    try {
      const { user } = await signInWithPopup(auth, goolgeProvider);
      //create user on firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: user?.displayName,
        email: user?.email,
        photoURL: user?.photoURL,
      });
      //create empty user chats on firestore
      await setDoc(doc(db, "userChats", user.uid), {});
      dispatch(handleChangeUser(user));
      setLoading(false);
      toast.success("Login successfully.");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

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

      <input
        type="file"
        placeholder="Upload your profile"
        className=" w-full p-2 outline-none bg-white focus:ring-2 ring-green-400 rounded-lg"
        {...register("pic")}
        accept="image/*"
      />
      <span className="text-red-500 font-semibold capitalize">
        {errors?.pic?.message}
      </span>
      <button
        type="submit"
        className="uppercase w-full bg-blue-500 rounded-lg p-2 text-white font-semibold transition active:scale-95 hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Signing up..." : "Sign up"}
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

export default Signup;
