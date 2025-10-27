import React from 'react';
import Header from '@/components/Lobby/Header';
import { BookOpen, Layers, Box } from 'lucide-react';

export default function ProductsPage() {
  return (
    <div className="lobby min-h-screen">
      <Header />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold text-center mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Our Products
          </h1>
          <p className="text-xl text-center text-gray-600 mb-16">
            Premium photo books crafted for photographers
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div data-testid="product-hardcover" className="text-center">
              <div className="aspect-square bg-gradient-to-br from-[#8B1E3F] to-[#6d1731] rounded-2xl mb-6 flex items-center justify-center">
                <BookOpen size={120} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Hardcover Books</h2>
              <p className="text-gray-600 leading-relaxed">
                Our premium hardcover books feature lay-flat binding, allowing your spreads to open completely flat. 
                Perfect for panoramic shots and double-page spreads. Museum-quality printing on archival paper.
              </p>
            </div>

            <div data-testid="product-softcover" className="text-center">
              <div className="aspect-square bg-gradient-to-br from-[#E27D60] to-[#c96b50] rounded-2xl mb-6 flex items-center justify-center">
                <Layers size={120} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Softcover Books</h2>
              <p className="text-gray-600 leading-relaxed">
                Lightweight and flexible, our softcover books are perfect for portfolios and client presentations. 
                High-quality binding ensures durability while maintaining a professional appearance.
              </p>
            </div>

            <div data-testid="product-presentation" className="text-center">
              <div className="aspect-square bg-gradient-to-br from-[#2E4057] to-[#1e2a3a] rounded-2xl mb-6 flex items-center justify-center">
                <Box size={120} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Presentation</h2>
              <p className="text-gray-600 leading-relaxed">
                Elevate your books with custom presentation boxes, protective sleeves, and specialty binding options. 
                Perfect for client deliverables and special occasions.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}