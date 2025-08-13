import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Changed import
import { Toaster } from 'react-hot-toast';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import TrackingPage from './pages/TrackingPage';
import ServicesPage from './pages/ServicesPage';
import BusinessPage from './pages/BusinessPage';
import CoveragePage from './pages/CoveragePage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router basename="/QuickLanka-Express"> {/* Added basename */}
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="book" element={<BookingPage />} />
          <Route path="track" element={<TrackingPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="business" element={<BusinessPage />} />
          <Route path="coverage" element={<CoveragePage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
