import React from 'react';
import Header from '@/components/Lobby/Header';

export default function CartPage() {
  return (
    <div className="lobby min-h-screen">
      <Header />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-center mb-16" style={{ fontFamily: 'Playfair Display, serif' }}>
            Shopping Cart
          </h1>
          
          <div data-testid="empty-cart" className="bg-white rounded-2xl p-12 text-center shadow-xl">
            <p className="text-gray-500 text-lg">Your cart is empty</p>
          </div>
        </div>
      </main>
    </div>
  );
}