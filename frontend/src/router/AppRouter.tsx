import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import EventSearchPage from "../pages/EventSearchPage";
import UserProfile from "../pages/UserProfile";
import EventPage from "../pages/EventPage";
import AdminPanel from "../pages/AdminPanel";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/events" element={<EventSearchPage />} />
      <Route path="/events/:eventId" element={<EventPage />} />
      <Route path="/admin" element={<AdminPanel />} />
    </Routes>
  );
}

export default AppRouter;
