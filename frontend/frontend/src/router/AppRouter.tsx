import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import EventSearchPage from "../pages/EventSearchPage";

// import RegisterPage from '../pages/RegisterPage';
import UserProfile from "../pages/UserProfile";
import EventPage from "../pages/EventPage";
// import EventDetails from '../pages/EventDetails';

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      {/* <Route path="/register" element={<RegisterPage />} /> */}
      <Route path="/profile" element={<UserProfile />} />
      {/* <Route path="/events/:eventId" element={<EventDetails />} />  */}
      <Route path="/events" element={<EventSearchPage />} />
      <Route path="/events/:eventId" element={<EventPage />} />
    </Routes>
  );
}

export default AppRouter;
