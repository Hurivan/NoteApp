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
            {/* Size */}
            <div data-testid="size-section">
              <h2 className="text-lg font-medium mb-4">Size</h2>
              <RadioGroup value={config.orientation} onValueChange={(v) => updateConfig('orientation', v)}>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-4 border hover:border-black transition-colors cursor-pointer">
                    <RadioGroupItem value="square_8x8" id="square" data-testid="size-square" />
                    <Label htmlFor="square" className="cursor-pointer flex-1">
                      <span className="font-medium">8" × 8" Square</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border hover:border-black transition-colors cursor-pointer">
                    <RadioGroupItem value="landscape_10x8" id="landscape" data-testid="size-landscape" />
                    <Label htmlFor="landscape" className="cursor-pointer flex-1">
                      <span className="font-medium">10" × 8" Landscape</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border hover:border-black transition-colors cursor-pointer">
                    <RadioGroupItem value="portrait_8x10" id="portrait" data-testid="size-portrait" />
                    <Label htmlFor="portrait" className="cursor-pointer flex-1">
                      <span className="font-medium">8" × 10" Portrait</span>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Cover */}
            <div data-testid="cover-section">
              <h2 className="text-lg font-medium mb-4">Cover</h2>
              <RadioGroup value={config.cover_type} onValueChange={(v) => updateConfig('cover_type', v)}>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-4 border hover:border-black transition-colors cursor-pointer">
                    <RadioGroupItem value="hardcover" id="hardcover" data-testid="cover-hardcover" />
                    <Label htmlFor="hardcover" className="cursor-pointer flex-1">
                      <span className="font-medium">Hardcover</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border hover:border-black transition-colors cursor-pointer">
                    <RadioGroupItem value="softcover" id="softcover" data-testid="cover-softcover" />
                    <Label htmlFor="softcover" className="cursor-pointer flex-1">
                      <span className="font-medium">Softcover</span>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Paper */}
            <div data-testid="paper-section">
              <h2 className="text-lg font-medium mb-4">Paper</h2>
              <RadioGroup value={config.paper_type} onValueChange={(v) => updateConfig('paper_type', v)}>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-4 border hover:border-black transition-colors cursor-pointer">
                    <RadioGroupItem value="matte" id="matte" data-testid="paper-matte" />
                    <Label htmlFor="matte" className="cursor-pointer flex-1">
                      <span className="font-medium">Matte</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border hover:border-black transition-colors cursor-pointer">
                    <RadioGroupItem value="glossy" id="glossy" data-testid="paper-glossy" />
                    <Label htmlFor="glossy" className="cursor-pointer flex-1">
                      <span className="font-medium">Glossy</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border hover:border-black transition-colors cursor-pointer">
                    <RadioGroupItem value="silk" id="silk" data-testid="paper-silk" />
                    <Label htmlFor="silk" className="cursor-pointer flex-1">
                      <span className="font-medium">Silk</span>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Pages */}
            <div data-testid="pages-section">
              <h2 className="text-lg font-medium mb-4">
                Pages: {config.page_count}
              </h2>
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
                <span>20</span>
                <span>200</span>
              </div>
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