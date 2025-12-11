
import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import RFQPage from './pages/RFQPage';
import Dashboard from './pages/Dashboard';
import SupplierProfile from './pages/SupplierProfile';
import UserProfilePage from './pages/UserProfile';
import InvestPage from './pages/InvestPage';
import EventsPage from './pages/EventsPage';
import LogisticsPage from './pages/LogisticsPage';
import TradeAssurancePage from './pages/TradeAssurancePage';
import JobsPage from './pages/JobsPage';
import CPDPage from './pages/CPDPage';
import FranchisePartnerDetail from './pages/FranchisePartnerDetail';
import CategoriesPage from './pages/CategoriesPage';
import SuppliersPage from './pages/SuppliersPage';
import PremiumSellersPage from './pages/PremiumSellersPage';
import BuyersPage from './pages/BuyersPage';
import BuyerVerificationPage from './pages/BuyerVerificationPage';
import VerifiedBuyersDirectory from './pages/VerifiedBuyersDirectory';
import RegistrationPage from './pages/RegistrationPage'; // New
import KYCPage from './pages/KYCPage'; // New
import MembershipPage from './pages/MembershipPage'; // New
import LoginPage from './pages/LoginPage'; // New
import { LanguageProvider } from './contexts/LanguageContext';
import { ModuleProvider } from './contexts/ModuleContext';

// Wrapper to conditionally render layout elements like Navbar/Footer if needed
const Layout: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const location = useLocation();
  const hideNavPaths = ['/dashboard', '/join', '/kyc', '/login'];
  const shouldHideNav = hideNavPaths.includes(location.pathname);
  
  return (
    <div className="flex flex-col min-h-screen font-sans text-slate-800">
      {!shouldHideNav && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      {!shouldHideNav && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ModuleProvider>
      <LanguageProvider>
        <HashRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/suppliers" element={<SuppliersPage />} />
              <Route path="/premium-sellers" element={<PremiumSellersPage />} />
              <Route path="/buyers" element={<BuyersPage />} />
              <Route path="/verified-buyers" element={<VerifiedBuyersDirectory />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/supplier/:id" element={<SupplierProfile />} />
              <Route path="/profile" element={<UserProfilePage />} />
              <Route path="/rfq" element={<RFQPage />} />
              <Route path="/invest" element={<InvestPage />} />
              <Route path="/franchise/:id" element={<FranchisePartnerDetail />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/logistics" element={<LogisticsPage />} />
              <Route path="/trade-assurance" element={<TradeAssurancePage />} />
              <Route path="/cpd" element={<CPDPage />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/buyer-verification" element={<BuyerVerificationPage />} />
              
              {/* New Registration & Membership Routes */}
              <Route path="/join" element={<RegistrationPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/kyc" element={<KYCPage />} />
              <Route path="/membership" element={<MembershipPage />} />
              
              {/* Redirect old route for compatibility */}
              <Route path="/supplier-dashboard" element={<Dashboard />} />
            </Routes>
          </Layout>
        </HashRouter>
      </LanguageProvider>
    </ModuleProvider>
  );
};

export default App;
