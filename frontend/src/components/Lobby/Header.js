import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import AuthModal from './AuthModal';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const { user, logout } = useAuth();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
            <span className="text-[#8B1E3F]">picture</span><span className="text-[#2E4057]">house</span>
          </Link>

          <button
            data-testid="hamburger-menu-button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div data-testid="mobile-menu" className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
            <nav className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-4">
              <Link to="/" className="text-lg hover:text-[#8B1E3F]" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/create" className="text-lg hover:text-[#8B1E3F]" onClick={() => setIsMenuOpen(false)}>Create Book</Link>
              <Link to="/products" className="text-lg hover:text-[#8B1E3F]" onClick={() => setIsMenuOpen(false)}>Products</Link>
              <Link to="/pricing" className="text-lg hover:text-[#8B1E3F]" onClick={() => setIsMenuOpen(false)}>Pricing</Link>
              <Link to="/indesign" className="text-lg hover:text-[#8B1E3F]" onClick={() => setIsMenuOpen(false)}>InDesign</Link>
              
              <div className="pt-4 border-t border-gray-200">
                {user ? (
                  <>
                    <Link to="/account" className="flex items-center gap-2 text-lg hover:text-[#8B1E3F] mb-3" onClick={() => setIsMenuOpen(false)}>
                      <User size={20} /> Account
                    </Link>
                    <button
                      data-testid="logout-button"
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-2 text-lg hover:text-[#8B1E3F]"
                    >
                      <LogOut size={20} /> Logout
                    </button>
                  </>
                ) : (
                  <Button
                    data-testid="login-button"
                    onClick={() => {
                      setShowAuth(true);
                      setIsMenuOpen(false);
                    }}
                    className="bg-[#8B1E3F] hover:bg-[#6d1731] text-white"
                  >
                    Login / Signup
                  </Button>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
}