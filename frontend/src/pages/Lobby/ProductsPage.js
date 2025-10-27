import React from 'react';
import Header from '@/components/Lobby/Header';

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-light text-center mb-16">
            Our Products
          </h1>

          <div className="space-y-24">
            {/* Hardcover Books */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=700&h=700&fit=crop"
                  alt="Hardcover Books"
                  className="w-full h-auto"
                />
              </div>
              <div>
                <h2 className="text-3xl font-light mb-6">Hardcover Books</h2>
                <p className="text-gray-600 font-light leading-relaxed mb-6">
                  Our premium hardcover books feature lay-flat binding, allowing your spreads 
                  to open completely flat. Perfect for panoramic shots and double-page spreads.
                </p>
                <ul className="space-y-3 text-gray-600 font-light">
                  <li>• Lay-flat binding</li>
                  <li>• Archival quality paper</li>
                  <li>• Premium hardcover</li>
                  <li>• Available in 3 sizes</li>
                </ul>
              </div>
            </div>

            {/* Softcover Books */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="md:order-2">
                <img 
                  src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=700&h=700&fit=crop"
                  alt="Softcover Books"
                  className="w-full h-auto"
                />
              </div>
              <div className="md:order-1">
                <h2 className="text-3xl font-light mb-6">Softcover Books</h2>
                <p className="text-gray-600 font-light leading-relaxed mb-6">
                  Lightweight and flexible, our softcover books are perfect for portfolios 
                  and client presentations.
                </p>
                <ul className="space-y-3 text-gray-600 font-light">
                  <li>• Lightweight design</li>
                  <li>• Professional binding</li>
                  <li>• High-quality paper</li>
                  <li>• Cost-effective</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}