import React from 'react';
import Header from '@/components/Lobby/Header';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-light text-center mb-4">
            Pricing
          </h1>
          <p className="text-center text-gray-600 mb-16 font-light">
            Transparent pricing. No hidden fees.
          </p>

          <div className="space-y-12">
            {/* Base Prices */}
            <div>
              <h2 className="text-2xl font-light mb-6">Base Prices</h2>
              <div className="space-y-4">
                <div className="flex justify-between py-4 border-b">
                  <div>
                    <p className="font-medium">Hardcover - Square 8×8"</p>
                  </div>
                  <p className="font-medium">$45</p>
                </div>
                <div className="flex justify-between py-4 border-b">
                  <div>
                    <p className="font-medium">Hardcover - Landscape/Portrait</p>
                  </div>
                  <p className="font-medium">$50</p>
                </div>
                <div className="flex justify-between py-4 border-b">
                  <div>
                    <p className="font-medium">Softcover - Square 8×8"</p>
                  </div>
                  <p className="font-medium">$30</p>
                </div>
                <div className="flex justify-between py-4 border-b">
                  <div>
                    <p className="font-medium">Softcover - Landscape/Portrait</p>
                  </div>
                  <p className="font-medium">$35</p>
                </div>
              </div>
            </div>

            {/* Paper Options */}
            <div>
              <h2 className="text-2xl font-light mb-6">Paper (per page)</h2>
              <div className="space-y-4">
                <div className="flex justify-between py-4 border-b">
                  <div>
                    <p className="font-medium">Matte</p>
                    <p className="text-sm text-gray-500">No glare, professional finish</p>
                  </div>
                  <p className="font-medium">$0.75</p>
                </div>
                <div className="flex justify-between py-4 border-b">
                  <div>
                    <p className="font-medium">Glossy</p>
                    <p className="text-sm text-gray-500">Vibrant colors, high contrast</p>
                  </div>
                  <p className="font-medium">$0.90</p>
                </div>
                <div className="flex justify-between py-4 border-b">
                  <div>
                    <p className="font-medium">Silk</p>
                    <p className="text-sm text-gray-500">Subtle sheen, premium feel</p>
                  </div>
                  <p className="font-medium">$1.10</p>
                </div>
              </div>
            </div>

            {/* Example */}
            <div className="bg-gray-50 p-8">
              <h3 className="text-lg font-medium mb-4">Example</h3>
              <p className="text-gray-600 font-light mb-4">
                Hardcover Square 8×8" with 40 matte pages:
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base price</span>
                  <span>$45.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">40 pages × $0.75</span>
                  <span>$30.00</span>
                </div>
                <div className="flex justify-between pt-2 border-t font-medium">
                  <span>Total</span>
                  <span>$75.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}