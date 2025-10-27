import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Lobby/Header';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ArrowRight } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function CreateBookConfig() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [config, setConfig] = useState({
    orientation: 'square_8x8',
    cover_type: 'hardcover',
    paper_type: 'matte',
    page_count: 40
  });
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculatePrice = async (newConfig) => {
    try {
      const response = await axios.post(`${API}/pricing/calculate`, newConfig || config);
      setPrice(response.data);
    } catch (error) {
      console.error('Price calculation error:', error);
    }
  };

  React.useEffect(() => {
    calculatePrice();
  }, [config]);

  const handleStartCreating = async () => {
    if (!user) {
      toast.error('Please login to continue');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API}/projects`,
        {
          name: `New Project ${new Date().toLocaleDateString()}`,
          config
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      toast.success('Project created!');
      navigate(`/app/${response.data.id}`);
    } catch (error) {
      toast.error('Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = (field, value) => {
    const newConfig = { ...config, [field]: value };
    setConfig(newConfig);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-light text-center mb-4">
            Configure Your Book
          </h1>
          <p className="text-center text-gray-600 mb-16 font-light">
            Choose your specifications
          </p>

          <div className="space-y-12">
            {/* Size & Format */}
            <div data-testid="size-section">
              <h2 className="text-lg font-medium mb-4">Size & Format</h2>
              <div className="flex gap-4">
                <button
                  data-testid="size-square"
                  onClick={() => updateConfig('orientation', 'square_8x8')}
                  className={`flex-1 p-6 border-2 transition-colors ${
                    config.orientation === 'square_8x8' ? 'border-black' : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="w-16 h-16 border-2 border-gray-400 mx-auto mb-3"></div>
                  <p className="text-sm font-medium">Square</p>
                  <p className="text-xs text-gray-500">8" × 8"</p>
                </button>
                <button
                  data-testid="size-landscape"
                  onClick={() => updateConfig('orientation', 'landscape_10x8')}
                  className={`flex-1 p-6 border-2 transition-colors ${
                    config.orientation === 'landscape_10x8' ? 'border-black' : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="w-20 h-14 border-2 border-gray-400 mx-auto mb-3"></div>
                  <p className="text-sm font-medium">Landscape</p>
                  <p className="text-xs text-gray-500">10" × 8"</p>
                </button>
                <button
                  data-testid="size-portrait"
                  onClick={() => updateConfig('orientation', 'portrait_8x10')}
                  className={`flex-1 p-6 border-2 transition-colors ${
                    config.orientation === 'portrait_8x10' ? 'border-black' : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="w-14 h-20 border-2 border-gray-400 mx-auto mb-3"></div>
                  <p className="text-sm font-medium">Portrait</p>
                  <p className="text-xs text-gray-500">8" × 10"</p>
                </button>
              </div>
            </div>

            {/* Cover Type */}
            <div data-testid="cover-section">
              <h2 className="text-lg font-medium mb-4">Cover Type</h2>
              <div className="flex gap-4">
                <button
                  data-testid="cover-hardcover"
                  onClick={() => updateConfig('cover_type', 'hardcover')}
                  className={`flex-1 p-8 border-2 transition-colors ${
                    config.cover_type === 'hardcover' ? 'border-black bg-gray-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <p className="text-base font-medium mb-1">Hardcover</p>
                  <p className="text-xs text-gray-500">Premium lay-flat binding</p>
                </button>
                <button
                  data-testid="cover-softcover"
                  onClick={() => updateConfig('cover_type', 'softcover')}
                  className={`flex-1 p-8 border-2 transition-colors ${
                    config.cover_type === 'softcover' ? 'border-black bg-gray-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <p className="text-base font-medium mb-1">Softcover</p>
                  <p className="text-xs text-gray-500">Lightweight & flexible</p>
                </button>
              </div>
            </div>

            {/* Paper Type */}
            <div data-testid="paper-section">
              <h2 className="text-lg font-medium mb-4">Paper Type</h2>
              <div className="flex gap-3">
                <button
                  data-testid="paper-matte"
                  onClick={() => updateConfig('paper_type', 'matte')}
                  className={`flex-1 p-6 border-2 transition-colors ${
                    config.paper_type === 'matte' ? 'border-black' : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="w-12 h-12 bg-gray-100 mx-auto mb-2"></div>
                  <p className="text-sm font-medium">Matte</p>
                </button>
                <button
                  data-testid="paper-glossy"
                  onClick={() => updateConfig('paper_type', 'glossy')}
                  className={`flex-1 p-6 border-2 transition-colors ${
                    config.paper_type === 'glossy' ? 'border-black' : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-white mx-auto mb-2"></div>
                  <p className="text-sm font-medium">Glossy</p>
                </button>
                <button
                  data-testid="paper-silk"
                  onClick={() => updateConfig('paper_type', 'silk')}
                  className={`flex-1 p-6 border-2 transition-colors ${
                    config.paper_type === 'silk' ? 'border-black' : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-100 via-white to-gray-100 mx-auto mb-2"></div>
                  <p className="text-sm font-medium">Silk</p>
                </button>
              </div>
            </div>

            {/* Page Number */}
            <div data-testid="pages-section">
              <h2 className="text-lg font-medium mb-4">Page Number</h2>
              <select
                data-testid="page-count-select"
                value={config.page_count}
                onChange={(e) => updateConfig('page_count', parseInt(e.target.value))}
                className="w-full p-4 border-2 border-gray-300 hover:border-gray-400 focus:border-black focus:outline-none text-base"
              >
                {[20, 24, 30, 40, 50, 60, 80, 100, 120, 150, 200].map(count => (
                  <option key={count} value={count}>{count} pages</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-2">You can change covers and add pages later</p>
            </div>

            {/* Price */}
            {price && (
              <div data-testid="price-display" className="border-t pt-8">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">Total</span>
                  <span className="text-2xl font-medium">${price.total_price.toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Submit */}
            <div className="pt-6">
              <Button
                data-testid="start-creating-button"
                onClick={handleStartCreating}
                disabled={loading}
                size="lg"
                className="w-full bg-black hover:bg-gray-800 text-white py-6 text-base"
              >
                {loading ? 'Creating...' : 'Start Creating'}
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}