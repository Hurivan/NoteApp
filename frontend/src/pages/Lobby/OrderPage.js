import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Lobby/Header';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function OrderPage() {
  const { orderId } = useParams();
  const { token } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`${API}/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrder(response.data);
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="lobby min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="animate-spin" size={48} />
        </div>
      </div>
    );
  }

  return (
    <div className="lobby min-h-screen">
      <Header />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-center mb-16" style={{ fontFamily: 'Playfair Display, serif' }}>
            Order Details
          </h1>
          
          {order && (
            <div data-testid="order-details" className="bg-white rounded-2xl p-8 shadow-xl">
              <div className="mb-6">
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-semibold">{order.id}</p>
              </div>
              <div className="mb-6">
                <p className="text-sm text-gray-500">Status</p>
                <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {order.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <div className="mb-6">
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl font-bold">${order.total_price.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-semibold">{new Date(order.created_at).toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}