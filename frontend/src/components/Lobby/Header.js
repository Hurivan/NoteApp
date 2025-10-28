import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import AuthModal from './AuthModal';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const { user, logout } = useAuth();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img 
              src="https://customer-assets.emergentagent.com/job_bookcraft-54/artifacts/ipd718rf_picturehousethesmalldarkroom%20logo_%40phtsdr_1C_black.png"
              alt="Picturehouse + The Small Dark Room"
              className="h-6 md:h-8 w-auto"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <Link to="/products" className="hover:text-gray-600 transition-colors">Products</Link>
            <Link to="/pricing" className="hover:text-gray-600 transition-colors">Pricing</Link>
            <Link to="/indesign" className="hover:text-gray-600 transition-colors">For Designers</Link>
            {user ? (
              <>
                <Link to="/account" className="hover:text-gray-600 transition-colors">My Books</Link>
                <button onClick={logout} className="hover:text-gray-600 transition-colors">Logout</button>
              </>
            ) : (
              <Button
                data-testid="header-login-button"
                onClick={() => setShowAuth(true)}
                variant="outline"
                size="sm"
              >
                Login
              </Button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            data-testid="mobile-menu-button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <nav className="px-6 py-6 flex flex-col gap-4">
              <Link to="/products" className="text-base" onClick={() => setIsMenuOpen(false)}>Products</Link>
              <Link to="/pricing" className="text-base" onClick={() => setIsMenuOpen(false)}>Pricing</Link>
              <Link to="/indesign" className="text-base" onClick={() => setIsMenuOpen(false)}>For Designers</Link>
              {user ? (
                <>
                  <Link to="/account" className="text-base" onClick={() => setIsMenuOpen(false)}>My Books</Link>
                  <button onClick={() => { logout(); setIsMenuOpen(false); }} className="text-base text-left">Logout</button>
                </>
              ) : (
                <Button
                  onClick={() => { setShowAuth(true); setIsMenuOpen(false); }}
                  size="sm"
                >
                  Login
                </Button>
              )}
            </nav>
          </div>
        )}
      </header>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
}