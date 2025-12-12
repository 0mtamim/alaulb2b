
import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Home } from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import RFQPage from './pages/RFQPage';
import Dashboard from './pages/Dashboard';
import SupplierDashboard from './pages/SupplierDashboard';
import SupplierProfile from './pages/SupplierProfile';
import UserProfilePage from './pages/UserProfilePage';
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
import RegistrationPage from './pages/RegistrationPage';
import KYCPage from './pages/KYCPage';
import MembershipPage from './pages/MembershipPage';
import LoginPage from './pages/LoginPage';
import { LanguageProvider } from './contexts/LanguageContext';
import { ModuleProvider } from './contexts/ModuleContext';
import { BannerProvider } from './contexts/BannerContext';
import { CartProvider } from './contexts/CartContext';
import CartFlyout from './components/CartFlyout';
import CartPage from './pages/CartPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';

const Layout: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const location = useLocation();
  const hideNavPaths = ['/dashboard', '/join', '/kyc', '/login', '/supplier-dashboard'];
  const shouldHideNav = hideNavPaths.some(path => location.pathname.startsWith(path));
  
  return (
    <div className="flex flex-col min-h-screen font-sans text-slate-800">
      {!shouldHideNav && <Navbar />}
      <main className="flex-grow">
        <CartFlyout />
        {children}
      </main>
      {!shouldHideNav && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ModuleProvider>
        <LanguageProvider>
          <CartProvider>
            <BannerProvider>
              <HashRouter>
                  <Layout>
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<Home />} />
                      <Route path="/categories" element={<CategoriesPage />} />
                      <Route path="/suppliers" element={<SuppliersPage />} />
                      <Route path="/product/:id" element={<ProductDetail />} />
                      <Route path="/supplier/:id" element={<SupplierProfile />} />
                      <Route path="/invest" element={<InvestPage />} />
                      <Route path="/franchise/:id" element={<FranchisePartnerDetail />} />
                      <Route path="/events" element={<EventsPage />} />
                      <Route path="/logistics" element={<LogisticsPage />} />
                      <Route path="/trade-assurance" element={<TradeAssurancePage />} />
                      <Route path="/cpd" element={<CPDPage />} />
                      <Route path="/jobs" element={<JobsPage />} />
                      <Route path="/join" element={<RegistrationPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/membership" element={<MembershipPage />} />
                      <Route path="/cart" element={<CartPage />} />

                      {/* Protected Routes (OWASP A01) */}
                      <Route path="/profile" element={
                        <ProtectedRoute>
                          <UserProfilePage />
                        </ProtectedRoute>
                      } />
                      <Route path="/rfq" element={
                        <ProtectedRoute>
                          <RFQPage />
                        </ProtectedRoute>
                      } />
                      <Route path="/dashboard" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                          <Dashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/supplier-dashboard" element={
                        <ProtectedRoute allowedRoles={['seller', 'admin']}>
                          <SupplierDashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/kyc" element={
                        <ProtectedRoute>
                          <KYCPage />
                        </ProtectedRoute>
                      } />
                      <Route path="/premium-sellers" element={
                        <ProtectedRoute>
                          <PremiumSellersPage />
                        </ProtectedRoute>
                      } />
                      <Route path="/buyers" element={
                        <ProtectedRoute allowedRoles={['seller', 'admin']}>
                          <BuyersPage />
                        </ProtectedRoute>
                      } />
                      <Route path="/verified-buyers" element={
                        <ProtectedRoute allowedRoles={['seller', 'admin']}>
                          <VerifiedBuyersDirectory />
                        </ProtectedRoute>
                      } />
                      <Route path="/buyer-verification" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                          <BuyerVerificationPage />
                        </ProtectedRoute>
                      } />
                    </Routes>
                  </Layout>
              </HashRouter>
            </BannerProvider>
          </CartProvider>
        </LanguageProvider>
      </ModuleProvider>
    </ErrorBoundary>
  );
};

export default App;
