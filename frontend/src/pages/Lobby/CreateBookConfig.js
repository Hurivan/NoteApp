import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Lobby/Header';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { ChevronRight, Sparkles } from 'lucide-react';
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
    <div className="lobby min-h-screen">
      <Header />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Configure Your Book
            </h1>
            <p className="text-xl text-gray-600">
              Choose your specifications and see live pricing
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            {/* Orientation */}
            <div className="mb-8" data-testid="orientation-section">
              <Label className="text-lg font-semibold mb-4 block">Orientation / Size</Label>
              <RadioGroup value={config.orientation} onValueChange={(v) => updateConfig('orientation', v)}>
                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="square_8x8" id="square" data-testid="orientation-square" />
                  <Label htmlFor="square" className="cursor-pointer flex-1">
                    <span className="font-semibold">Square 8×8"</span>
                    <p className="text-sm text-gray-500">Perfect for Instagram and social media</p>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="landscape_10x8" id="landscape" data-testid="orientation-landscape" />
                  <Label htmlFor="landscape" className="cursor-pointer flex-1">
                    <span className="font-semibold">Landscape 10×8"</span>
                    <p className="text-sm text-gray-500">Wide format for panoramic shots</p>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="portrait_8x10" id="portrait" data-testid="orientation-portrait" />
                  <Label htmlFor="portrait" className="cursor-pointer flex-1">
                    <span className="font-semibold">Portrait 8×10"</span>
                    <p className="text-sm text-gray-500">Classic vertical format</p>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Cover Type */}
            <div className="mb-8" data-testid="cover-type-section">
              <Label className="text-lg font-semibold mb-4 block">Cover Type</Label>
              <RadioGroup value={config.cover_type} onValueChange={(v) => updateConfig('cover_type', v)}>
                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="hardcover" id="hardcover" data-testid="cover-hardcover" />
                  <Label htmlFor="hardcover" className="cursor-pointer flex-1">
                    <span className="font-semibold">Hardcover</span>
                    <p className="text-sm text-gray-500">Premium durability and presentation</p>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="softcover" id="softcover" data-testid="cover-softcover" />
                  <Label htmlFor="softcover" className="cursor-pointer flex-1">
                    <span className="font-semibold">Softcover</span>
                    <p className="text-sm text-gray-500">Lightweight and flexible</p>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Paper Type */}
            <div className="mb-8" data-testid="paper-type-section">
              <Label className="text-lg font-semibold mb-4 block">Paper Type</Label>
              <RadioGroup value={config.paper_type} onValueChange={(v) => updateConfig('paper_type', v)}>
                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="matte" id="matte" data-testid="paper-matte" />
                  <Label htmlFor="matte" className="cursor-pointer flex-1">
                    <span className="font-semibold">Matte</span>
                    <p className="text-sm text-gray-500">No glare, professional finish</p>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="glossy" id="glossy" data-testid="paper-glossy" />
                  <Label htmlFor="glossy" className="cursor-pointer flex-1">
                    <span className="font-semibold">Glossy</span>
                    <p className="text-sm text-gray-500">Vibrant colors, high contrast</p>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="silk" id="silk" data-testid="paper-silk" />
                  <Label htmlFor="silk" className="cursor-pointer flex-1">
                    <span className="font-semibold">Silk</span>
                    <p className="text-sm text-gray-500">Subtle sheen, premium feel</p>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Page Count */}
            <div className="mb-8" data-testid="page-count-section">
              <Label className="text-lg font-semibold mb-4 block">
                Page Count: <span className="text-[#8B1E3F]">{config.page_count} pages</span>
              </Label>
              <Slider
                data-testid="page-count-slider"
                value={[config.page_count]}
                onValueChange={(v) => updateConfig('page_count', v[0])}
                min={20}
                max={200}
                step={2}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>20 pages</span>
                <span>200 pages</span>
              </div>
            </div>

            {/* Price Display */}
            {price && (
              <div data-testid="price-display" className="bg-gradient-to-r from-[#8B1E3F] to-[#2E4057] text-white rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Estimated Total</p>
                    <p className="text-4xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
                      ${price.total_price.toFixed(2)}
                    </p>
                    <p className="text-xs opacity-75 mt-1">
                      Base: ${price.base_price.toFixed(2)} + Pages: ${price.page_price.toFixed(2)}
                    </p>
                  </div>
                  <Sparkles size={48} className="opacity-50" />
                </div>
              </div>
            )}

            {/* Start Button */}
            <Button
              data-testid="start-creating-button"
              onClick={handleStartCreating}
              disabled={loading}
              size="lg"
              className="w-full bg-[#8B1E3F] hover:bg-[#6d1731] text-white text-lg py-6 rounded-xl"
            >
              {loading ? 'Creating...' : 'START CREATING'}
              <ChevronRight className="ml-2" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}