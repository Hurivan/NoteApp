import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Lobby/Header';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCreateBook = () => {
    if (user) {
      navigate('/create');
    } else {
      navigate('/create');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-light mb-6 tracking-tight">
              Beautiful Photo Books
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 font-light">
              Professional quality. Handcrafted with care.
            </p>
            <Button
              data-testid="create-book-cta"
              onClick={handleCreateBook}
              size="lg"
              className="bg-black hover:bg-gray-800 text-white px-8 py-6 text-base"
            >
              Create Your Book
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </div>
        </section>

        {/* Large Product Image */}
        <section className="py-12 px-6">
          <div className="max-w-5xl mx-auto">
            <img 
              src="https://customer-assets.emergentagent.com/job_bookcraft-54/artifacts/1lghb04u_image.png"
              alt="Photo Book"
              className="w-full h-auto"
            />
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <h3 className="text-xl font-medium mb-3">Premium Materials</h3>
                <p className="text-gray-600 font-light leading-relaxed">
                  Archival quality paper and professional-grade binding
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-medium mb-3">Easy Design</h3>
                <p className="text-gray-600 font-light leading-relaxed">
                  Intuitive online builder with professional layouts
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-medium mb-3">Fast Delivery</h3>
                <p className="text-gray-600 font-light leading-relaxed">
                  Handcrafted and shipped within 5-7 business days
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Product Types */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-light text-center mb-16">Our Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="cursor-pointer group" onClick={() => navigate('/products')}>
                <div className="aspect-square bg-gray-100 mb-4 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=600&fit=crop"
                    alt="Hardcover Books"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-xl font-medium mb-2">Hardcover Books</h3>
                <p className="text-gray-600 font-light">Premium lay-flat binding</p>
              </div>
              <div className="cursor-pointer group" onClick={() => navigate('/products')}>
                <div className="aspect-square bg-gray-100 mb-4 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=600&fit=crop"
                    alt="Softcover Books"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-xl font-medium mb-2">Softcover Books</h3>
                <p className="text-gray-600 font-light">Lightweight and portable</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-black text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-light mb-6">
              Ready to create?
            </h2>
            <p className="text-xl text-gray-300 mb-8 font-light">
              Start designing your photo book today
            </p>
            <Button
              data-testid="footer-create-cta"
              onClick={handleCreateBook}
              size="lg"
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white hover:text-black px-8 py-6 text-base"
            >
              Get Started
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center mb-6">
            <img 
              src="https://customer-assets.emergentagent.com/job_bookcraft-54/artifacts/ipd718rf_picturehousethesmalldarkroom%20logo_%40phtsdr_1C_black.png"
              alt="Picturehouse + The Small Dark Room"
              className="h-8 w-auto mb-4"
            />
          </div>
          <div className="text-center text-sm text-gray-500">
            <p>© 2025 Picturehouse + The Small Dark Room. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}