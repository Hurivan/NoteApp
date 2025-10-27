import React from 'react';
import Header from '@/components/Lobby/Header';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const handleCheckout = () => {
    toast.info('Stripe checkout coming soon (mocked)');
  };

  return (
    <div className="lobby min-h-screen">
      <Header />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-center mb-16" style={{ fontFamily: 'Playfair Display, serif' }}>
            Checkout
          </h1>
          
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <p className="text-center text-gray-600 mb-6">Mock Stripe Checkout</p>
            <Button
              data-testid="stripe-checkout-button"
              onClick={handleCheckout}
              className="w-full bg-[#8B1E3F] hover:bg-[#6d1731] text-white"
              size="lg"
            >
              Proceed to Payment
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}