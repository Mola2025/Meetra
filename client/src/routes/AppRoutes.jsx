import { Routes, Route } from "react-router-dom";
import Navbar from "../components/navbar/NavBar";

import Home from "../features/home/Home";
import Auth from "../features/auth/Auth";
import Profile from "../features/profile/Profile";
import Dashboard from "../features/dashboard/Dashboard";
import Onboarding from "../features/onboarding/Onboarding";


const AppRoutes = () => {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "64px" }}>
      <Routes>
        <Route path="/" element={<Auth mode="login"/>} />
        <Route path="/home" element={<Home/>} />
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/onboarding" element={<Onboarding />} />
      </Routes>
      </main>
    </>
  );
};

export default AppRoutes;