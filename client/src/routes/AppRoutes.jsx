import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Navbar from "../components/navbar/NavBar";
import AuthGuard from "../core/Guards/auth-guard";

import Home from "../features/home/Home";
import Auth from "../features/auth/Auth";
import Profile from "../features/profile/Profile";
import Dashboard from "../features/dashboard/Dashboard";
import Onboarding from "../features/onboarding/Onboarding";
import CreateRoom from "../features/create-room/CreateRoom";
import LobbyWaitingRoom from "../features/lobby-waiting-room/LobbyWaitingRoom";
import MeetingRoom from "../features/meeting-room/MeetingRoom";

// Layout that wraps protected routes with Navbar and AuthGuard
const ProtectedLayout = () => {
  return (
    <AuthGuard>
      <Navbar />
      <main style={{ paddingTop: "64px" }}>
        <Outlet /> {/* Renders the matched child route component */}
      </main>
    </AuthGuard>
  );
};

const AppRoutes = () => {
  return (
        <Routes>
          {/* Public */}
          <Route path="/"         element={<Auth mode="login" />} />
          <Route path="/register" element={<Auth mode="register" />} />

          {/* Protected */}
          <Route element={<ProtectedLayout />}>
            <Route path="/home"                element={<Home />} />
            <Route path="/profile"             element={<Profile />} />
            <Route path="/dashboard"           element={<Dashboard />} />
            <Route path="/onboarding"          element={<Onboarding />} />
            <Route path="/create-room"         element={<CreateRoom />} />
            <Route path="/lobby-waiting-room"  element={<LobbyWaitingRoom />} />
            <Route path="/meeting"             element={<MeetingRoom />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
  );
};

export default AppRoutes;