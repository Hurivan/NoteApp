import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, BookOpen, Box, Layers } from 'lucide-react';
import Header from '@/components/Lobby/Header';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/Lobby/AuthModal';

const heroImages = [
  {
    url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=1200&h=800&fit=crop',
    title: 'Premium Hardcover Books',
    description: 'Museum-quality printing on archival paper'
  },
  {
    url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&h=800&fit=crop',
    title: 'Custom Photo Books',
    description: 'Tell your story with professional-grade materials'
  },
  {
    url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=800&fit=crop',
    title: 'Presentation Ready',
    description: 'Elegant boxes and binding for every occasion'
  }
];

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showAuth, setShowAuth] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateBook = () => {
    if (!user) {
      setShowAuth(true);
    } else {
      navigate('/create');
    }
  };

  return (
    <div className="lobby min-h-screen">
      <Header />
      
      <main className="pt-20 bg-gradient-to-br from-[#8B1E3F] via-[#6d1731] to-[#2E4057]">
        {/* Hero Section */}
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Contained Hero Box */}
            <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl">
              {/* Hero Slideshow */}
              <div className="absolute inset-0">
                {heroImages.map((image, index) => (
                  <div
                    key={index}
                    className="absolute inset-0 transition-opacity duration-1000"
                    style={{
                      opacity: currentSlide === index ? 1 : 0,
                      backgroundImage: `url(${image.url})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />
                ))}
                <div className="absolute inset-0 bg-black/50" />
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-6">
                <p className="text-sm sm:text-base tracking-[0.3em] uppercase mb-6 opacity-90">
                  for photographers by photographers
                </p>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {heroImages[currentSlide].title}
                </h1>
                
                <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto opacity-90">
                  {heroImages[currentSlide].description}
                </p>
                
                <Button
                  data-testid="create-book-hero-button"
                  onClick={handleCreateBook}
                  size="lg"
                  className="bg-white text-[#8B1E3F] hover:bg-gray-100 text-lg px-8 py-6 rounded-full font-semibold"
                >
                  CREATE YOUR BOOK
                  <ChevronRight className="ml-2" />
                </Button>

                {/* Slide Indicators */}
                <div className="flex gap-2 justify-center mt-10">
                  {heroImages.map((_, index) => (
                    <button
                      key={index}
                      data-testid={`slide-indicator-${index}`}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-1 rounded-full transition-all ${
                        currentSlide === index ? 'w-12 bg-white' : 'w-6 bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Caption below image */}
            <div className="text-center mt-6 text-white">
              <p className="text-lg font-medium">{heroImages[currentSlide].title}</p>
              <p className="text-sm opacity-80">{heroImages[currentSlide].description}</p>
            </div>
          </div>
        </section>

        {/* Product Row */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div
                data-testid="product-hardcover-card"
                className="group cursor-pointer"
                onClick={() => navigate('/products')}
              >
                <div className="aspect-square bg-gradient-to-br from-[#8B1E3F] to-[#6d1731] rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                  <BookOpen size={80} className="text-white group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>Hardcover Books</h3>
                <p className="text-gray-600">Premium binding with lay-flat pages</p>
              </div>

              <div
                data-testid="product-softcover-card"
                className="group cursor-pointer"
                onClick={() => navigate('/products')}
              >
                <div className="aspect-square bg-gradient-to-br from-[#E27D60] to-[#c96b50] rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                  <Layers size={80} className="text-white group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>Softcover Books</h3>
                <p className="text-gray-600">Flexible and lightweight design</p>
              </div>

              <div
                data-testid="product-presentation-card"
                className="group cursor-pointer"
                onClick={() => navigate('/products')}
              >
                <div className="aspect-square bg-gradient-to-br from-[#2E4057] to-[#1e2a3a] rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                  <Box size={80} className="text-white group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>Presentation</h3>
                <p className="text-gray-600">Boxes, sleeves, and custom binding</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 bg-gradient-to-br from-[#8B1E3F] to-[#2E4057] text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Start Creating Today
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Professional photo books designed by photographers, for photographers.
            </p>
            <Button
              data-testid="create-book-cta-button"
              onClick={handleCreateBook}
              size="lg"
              className="bg-white text-[#8B1E3F] hover:bg-gray-100 text-lg px-8 py-6 rounded-full font-semibold"
            >
              GET STARTED
              <ChevronRight className="ml-2" />
            </Button>
          </div>
        </section>
      </main>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  );
}