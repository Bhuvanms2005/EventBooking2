import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import EventsPage from './pages/EventsPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ManageEvents from './pages/ManageEvents';
import ManageEventPage from './pages/ManageEventPage';
import UserManagement from './pages/UserManagement';
import Analytics from './pages/Analytics';
import Bookings from './pages/Bookings';
import EventDetails from './pages/EventDetails';
import AuthPage from './pages/AuthPage';
import CheckoutPage from './pages/CheckoutPage';
import MyBookings from './pages/MyBookings';
import About from './pages/About';
import Terms from './pages/Terms';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/checkout/:id" element={<CheckoutPage />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/about" element={<About />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/manage-events" element={<ManageEvents />} />
        <Route path="/admin/manage-event/:id" element={<ManageEventPage />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/analytics" element={<Analytics />} />
        <Route path="/admin/bookings" element={<Bookings />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;