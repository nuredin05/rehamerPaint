import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar-Lucide';
import { Navbar } from './components/layout/Navbar-Lucide';
import { Dashboard } from './pages/Dashboard-Lucide';
import { Login } from './pages/Login-Lucide';
import { Landing } from './pages/Landing';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { Products } from './pages/Products';
import { Gallery } from './pages/Gallery';
import { Contact } from './pages/Contact';
import { Inventory } from './pages/Inventory-Lucide';
import { Sales } from './pages/Sales-Lucide';
import { Procurement } from './pages/Procurement-Lucide';
import { Manufacturing } from './pages/Manufacturing-Lucide';
import { Finance } from './pages/Finance-Lucide';
import { HR } from './pages/HR-Lucide';
import { Logistics } from './pages/Logistics-Lucide';
import { Reports } from './pages/Reports-Lucide';
import { Admin } from './pages/Admin-Lucide';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-backgroundClr">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/products" element={<Products />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/*" element={
              <div className="flex">
                <Sidebar />
                <div className="flex-1">
                  <Navbar />
                  <main className="p-6">
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/inventory" element={<Inventory />} />
                      <Route path="/sales" element={<Sales />} />
                      <Route path="/procurement" element={<Procurement />} />
                      <Route path="/manufacturing" element={<Manufacturing />} />
                      <Route path="/finance" element={<Finance />} />
                      <Route path="/hr" element={<HR />} />
                      <Route path="/logistics" element={<Logistics />} />
                      <Route path="/reports" element={<Reports />} />
                      <Route path="/admin" element={<Admin />} />
                    </Routes>
                  </main>
                </div>
              </div>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
