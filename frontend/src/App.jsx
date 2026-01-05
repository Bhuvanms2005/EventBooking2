import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ManageEvents from './pages/ManageEvents'; // Fixed: pointing to the List page
import ManageEventPage from './pages/ManageEventPage'; // Fixed: pointing to the Form page
import UserManagement from './pages/UserManagement';
import Analytics from './pages/Analytics';
import Bookings from './pages/Bookings';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        
        {/* This route shows the Table/List of all events */}
        <Route path="/admin/manage-events" element={<ManageEvents />} />
        
        {/* This route shows the Create/Edit Form */}
        <Route path="/admin/manage-event/:id" element={<ManageEventPage />} />
        
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/analytics" element={<Analytics />} />
        <Route path="/admin/bookings" element={<Bookings />} />
        <Route path="/" element={<Navigate to="/admin/login" />} />
      </Routes>
    </Router>
  );
}

export default App;