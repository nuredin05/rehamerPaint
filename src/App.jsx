import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Inventory } from './pages/Inventory';
import { Sales } from './pages/Sales-Functional';
import { Procurement } from './pages/Procurement-Clean';
import { Manufacturing } from './pages/Manufacturing-Fixed';
import { Finance } from './pages/Finance-Functional';
import { HR } from './pages/HR-Functional';
import { Logistics } from './pages/Logistics-Fixed';
import { Reports } from './pages/Reports';
import { Admin } from './pages/Admin-DB';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-backgroundClr">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
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
