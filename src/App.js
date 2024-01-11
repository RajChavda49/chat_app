import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Auth from "./Pages/Auth";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import Home from "./Pages/Home";

function App() {
  const { user } = useSelector((s) => s.auth);

  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
