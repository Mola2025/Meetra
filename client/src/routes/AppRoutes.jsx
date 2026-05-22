import { Routes, Route } from "react-router-dom";
import Navbar from "../components/navbar/NavBar";

import Home from "../features/home/Home";
import Auth from "../features/auth/Auth";


const AppRoutes = () => {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "64px" }}>
      <Routes>
        <Route path="/" element={<Auth mode="login"/>} />
        <Route path="/home" element={<Home/>} />
      </Routes>
      </main>
    </>
  );
};

export default AppRoutes;