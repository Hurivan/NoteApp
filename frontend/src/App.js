import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';

// Lobby Pages
import LandingPage from '@/pages/Lobby/LandingPage';
import CreateBookConfig from '@/pages/Lobby/CreateBookConfig';
import AccountPage from '@/pages/Lobby/AccountPage';
import ProductsPage from '@/pages/Lobby/ProductsPage';
import PricingPage from '@/pages/Lobby/PricingPage';
import InDesignPage from '@/pages/Lobby/InDesignPage';
import CartPage from '@/pages/Lobby/CartPage';
import CheckoutPage from '@/pages/Lobby/CheckoutPage';
import OrderPage from '@/pages/Lobby/OrderPage';

// Lab Page
import BookBuilder from '@/pages/Lab/BookBuilder';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Lobby Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/create" element={<CreateBookConfig />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/indesign" element={<InDesignPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order/:orderId" element={<OrderPage />} />
          
          {/* Lab Route */}
          <Route path="/app" element={<BookBuilder />} />
          <Route path="/app/:projectId" element={<BookBuilder />} />
        </Routes>
        <Toaster position="top-center" richColors />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;