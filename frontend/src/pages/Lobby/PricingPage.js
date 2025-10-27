import React from 'react';
import Header from '@/components/Lobby/Header';
import { Check } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="lobby min-h-screen">
      <Header />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold text-center mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Transparent Pricing
          </h1>
          <p className="text-xl text-center text-gray-600 mb-16">
            No hidden fees. Pay for what you need.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div data-testid="pricing-hardcover" className="bg-white rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Hardcover</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">$45-50</span>
                <span className="text-gray-600"> base</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Check size={20} className="text-[#8B1E3F] mt-0.5 flex-shrink-0" />
                  <span>Premium lay-flat binding</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={20} className="text-[#8B1E3F] mt-0.5 flex-shrink-0" />
                  <span>Archival quality paper</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={20} className="text-[#8B1E3F] mt-0.5 flex-shrink-0" />
                  <span>+ $0.75-1.10 per page</span>
                </li>
              </ul>
            </div>

            <div data-testid="pricing-softcover" className="bg-white rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Softcover</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">$30-35</span>
                <span className="text-gray-600"> base</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Check size={20} className="text-[#8B1E3F] mt-0.5 flex-shrink-0" />
                  <span>Professional binding</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={20} className="text-[#8B1E3F] mt-0.5 flex-shrink-0" />
                  <span>Lightweight & portable</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={20} className="text-[#8B1E3F] mt-0.5 flex-shrink-0" />
                  <span>+ $0.75-1.10 per page</span>
                </li>
              </ul>
            </div>

            <div data-testid="pricing-presentation" className="bg-gradient-to-br from-[#8B1E3F] to-[#2E4057] text-white rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Presentation</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">Custom</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Check size={20} className="flex-shrink-0 mt-0.5" />
                  <span>Custom boxes & sleeves</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={20} className="flex-shrink-0 mt-0.5" />
                  <span>Specialty binding</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={20} className="flex-shrink-0 mt-0.5" />
                  <span>Contact for quote</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Paper Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="font-semibold mb-2">Matte - $0.75/page</p>
                <p className="text-sm text-gray-600">No glare, professional finish</p>
              </div>
              <div>
                <p className="font-semibold mb-2">Glossy - $0.90/page</p>
                <p className="text-sm text-gray-600">Vibrant colors, high contrast</p>
              </div>
              <div>
                <p className="font-semibold mb-2">Silk - $1.10/page</p>
                <p className="text-sm text-gray-600">Subtle sheen, premium feel</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}