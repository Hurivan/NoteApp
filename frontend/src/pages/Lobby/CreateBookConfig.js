import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Lobby/Header';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Product images
const PRODUCT_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=600&fit=crop', name: 'Premium Hardcover' },
  { url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=600&fit=crop', name: 'Classic Album' },
  { url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=600&fit=crop', name: 'Softcover Edition' },
  { url: 'https://images.unsplash.com/photo-1606762280793-938d295f2bb2?w=600&h=600&fit=crop', name: 'Portfolio Book' }
];

// Cover fabric colors
const COVER_FABRICS = [
  { id: 'sage', name: 'Sage', color: '#C4CFC0' },
  { id: 'navy', name: 'Navy', color: '#2C3E50' },
  { id: 'charcoal', name: 'Charcoal', color: '#4A4A4A' },
  { id: 'sand', name: 'Sand', color: '#D4C5B9' },
  { id: 'burgundy', name: 'Burgundy', color: '#7C3238' },
  { id: 'forest', name: 'Forest', color: '#2D4535' },
];

export default function CreateBookConfig() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [config, setConfig] = useState({
    orientation: 'square_8x8',
    cover_type: 'hardcover',
    paper_type: 'matte',
    page_count: 40,
    cover_fabric: 'sage'
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
      
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left - Product Images */}
            <div className="flex gap-3">
              {/* Vertical Thumbnail Carousel */}
              <div className="flex flex-col gap-2">
                {PRODUCT_IMAGES.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-16 h-16 border transition-colors ${
                      selectedImageIndex === index ? 'border-black border-2' : 'border-gray-200'
                    }`}
                  >
                    <img 
                      src={img.url} 
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Main Image with Caption */}
              <div className="flex-1">
                <img 
                  src={PRODUCT_IMAGES[selectedImageIndex].url} 
                  alt="Product"
                  className="w-full h-auto mb-2"
                />
                <p className="text-xs text-gray-500 text-center">{PRODUCT_IMAGES[selectedImageIndex].name}</p>
              </div>
            </div>

            {/* Right - Configuration Panel */}
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-light mb-1">Premium Photo Books</h1>
                <p className="text-sm text-gray-600 font-light">
                  Professional quality handcrafted photo books
                </p>
              </div>

              {/* Reviews */}
              <div className="flex items-center gap-2 text-xs">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-500 text-sm">★</span>
                  ))}
                </div>
                <span className="text-gray-500">894 reviews</span>
              </div>

              {/* Price Guide Link */}
              <button className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                Explore our interactive price guide
                <ArrowRight size={12} />
              </button>

              {/* Configuration Accordion - Flat Light Gray */}
              <Accordion type="multiple" defaultValue={['specs']} className="w-full">
                {/* Specifications */}
                <AccordionItem value="specs" className="border-b border-gray-200">
                  <AccordionTrigger className="text-sm font-medium h-[25px] py-0 bg-gray-100 px-3 hover:no-underline data-[state=open]:bg-gray-100">
                    Specifications
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pb-3 pt-3">
                    {/* Size */}
                    <div>
                      <p className="text-xs text-gray-500 mb-1.5">Size</p>
                      <div className="flex gap-1.5">
                        <button
                          data-testid="size-square"
                          onClick={() => updateConfig('orientation', 'square_8x8')}
                          className={`w-12 h-12 flex items-center justify-center transition-all ${
                            config.orientation === 'square_8x8' 
                              ? 'bg-gray-300 outline outline-2 outline-black' 
                              : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          <div className="w-6 h-6 border border-gray-400"></div>
                        </button>
                        <button
                          data-testid="size-landscape"
                          onClick={() => updateConfig('orientation', 'landscape_10x8')}
                          className={`w-12 h-12 flex items-center justify-center transition-all ${
                            config.orientation === 'landscape_10x8' 
                              ? 'bg-gray-300 outline outline-2 outline-black' 
                              : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          <div className="w-7 h-5 border border-gray-400"></div>
                        </button>
                        <button
                          data-testid="size-portrait"
                          onClick={() => updateConfig('orientation', 'portrait_8x10')}
                          className={`w-12 h-12 flex items-center justify-center transition-all ${
                            config.orientation === 'portrait_8x10' 
                              ? 'bg-gray-300 outline outline-2 outline-black' 
                              : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          <div className="w-5 h-7 border border-gray-400"></div>
                        </button>
                      </div>
                    </div>

                    {/* Cover Fabric */}
                    <div>
                      <p className="text-xs text-gray-500 mb-1.5">Cover Fabric</p>
                      <div className="flex flex-wrap gap-1.5">
                        {COVER_FABRICS.map((fabric) => (
                          <button
                            key={fabric.id}
                            data-testid={`fabric-${fabric.id}`}
                            onClick={() => updateConfig('cover_fabric', fabric.id)}
                            className={`w-8 h-8 transition-all ${
                              config.cover_fabric === fabric.id 
                                ? 'outline outline-2 outline-black' 
                                : 'hover:opacity-80'
                            }`}
                            style={{ 
                              backgroundColor: fabric.color,
                              filter: config.cover_fabric === fabric.id ? 'brightness(0.8)' : 'none'
                            }}
                            title={fabric.name}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Cover Type */}
                    <div>
                      <p className="text-xs text-gray-500 mb-1.5">Cover Type</p>
                      <div className="flex gap-1.5">
                        <button
                          data-testid="cover-hardcover"
                          onClick={() => updateConfig('cover_type', 'hardcover')}
                          className={`flex-1 px-2 py-1.5 text-left transition-all ${
                            config.cover_type === 'hardcover' 
                              ? 'bg-gray-300 outline outline-2 outline-black' 
                              : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          <p className="text-xs font-medium">Hardcover</p>
                        </button>
                        <button
                          data-testid="cover-softcover"
                          onClick={() => updateConfig('cover_type', 'softcover')}
                          className={`flex-1 px-2 py-1.5 text-left transition-all ${
                            config.cover_type === 'softcover' 
                              ? 'bg-gray-300 outline outline-2 outline-black' 
                              : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          <p className="text-xs font-medium">Softcover</p>
                        </button>
                      </div>
                    </div>

                    {/* Paper Type */}
                    <div>
                      <p className="text-xs text-gray-500 mb-1.5">Paper Type</p>
                      <div className="flex gap-1.5">
                        <button
                          data-testid="paper-matte"
                          onClick={() => updateConfig('paper_type', 'matte')}
                          className={`flex-1 p-1.5 transition-all ${
                            config.paper_type === 'matte' 
                              ? 'bg-gray-300 outline outline-2 outline-black' 
                              : 'bg-white hover:bg-gray-50'
                          }`}
                        >
                          <div className="w-full h-4 bg-gray-100"></div>
                          <p className="text-xs mt-1">Matte</p>
                        </button>
                        <button
                          data-testid="paper-glossy"
                          onClick={() => updateConfig('paper_type', 'glossy')}
                          className={`flex-1 p-1.5 transition-all ${
                            config.paper_type === 'glossy' 
                              ? 'bg-gray-300 outline outline-2 outline-black' 
                              : 'bg-white hover:bg-gray-50'
                          }`}
                        >
                          <div className="w-full h-4 bg-gradient-to-br from-gray-200 to-white"></div>
                          <p className="text-xs mt-1">Glossy</p>
                        </button>
                        <button
                          data-testid="paper-silk"
                          onClick={() => updateConfig('paper_type', 'silk')}
                          className={`flex-1 p-1.5 transition-all ${
                            config.paper_type === 'silk' 
                              ? 'bg-gray-300 outline outline-2 outline-black' 
                              : 'bg-white hover:bg-gray-50'
                          }`}
                        >
                          <div className="w-full h-4 bg-gradient-to-br from-gray-100 via-white to-gray-100"></div>
                          <p className="text-xs mt-1">Silk</p>
                        </button>
                      </div>
                    </div>

                    {/* Page Number */}
                    <div>
                      <p className="text-xs text-gray-500 mb-1.5">Page Number</p>
                      <select
                        data-testid="page-count-select"
                        value={config.page_count}
                        onChange={(e) => updateConfig('page_count', parseInt(e.target.value))}
                        className="w-full px-2 py-1.5 bg-gray-100 focus:bg-gray-200 focus:outline focus:outline-2 focus:outline-black text-xs"
                      >
                        {[20, 24, 30, 40, 50, 60, 80, 100, 120, 150, 200].map(count => (
                          <option key={count} value={count}>{count}</option>
                        ))}
                      </select>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Features */}
                <AccordionItem value="features" className="border-b border-gray-200">
                  <AccordionTrigger className="text-sm font-medium h-[25px] py-0 bg-gray-100 px-3 hover:no-underline data-[state=open]:bg-gray-100">
                    Features
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-gray-600 space-y-1 pb-3 pt-3">
                    <p>• Lay-flat binding for seamless spreads</p>
                    <p>• Archival quality paper (300 ppi)</p>
                    <p>• Premium fabric cover options</p>
                    <p>• Museum-quality printing</p>
                    <p>• Handcrafted with care</p>
                  </AccordionContent>
                </AccordionItem>

                {/* Recommended For */}
                <AccordionItem value="recommended" className="border-b border-gray-200">
                  <AccordionTrigger className="text-sm font-medium h-[25px] py-0 bg-gray-100 px-3 hover:no-underline data-[state=open]:bg-gray-100">
                    Recommended for
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-gray-600 space-y-1 pb-3 pt-3">
                    <p>• Wedding albums</p>
                    <p>• Professional portfolios</p>
                    <p>• Family memories</p>
                    <p>• Travel photography</p>
                    <p>• Coffee table books</p>
                  </AccordionContent>
                </AccordionItem>

                {/* Shipping & Delivery */}
                <AccordionItem value="shipping" className="border-b border-gray-200">
                  <AccordionTrigger className="text-sm font-medium h-[25px] py-0 bg-gray-100 px-3 hover:no-underline data-[state=open]:bg-gray-100">
                    Shipping & delivery
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-gray-600 space-y-1 pb-3 pt-3">
                    <p><strong>Production time:</strong> 5-7 business days</p>
                    <p><strong>Shipping:</strong> 3-5 business days</p>
                    <p><strong>Express shipping:</strong> Available at checkout</p>
                    <p><strong>International:</strong> 10-15 business days</p>
                  </AccordionContent>
                </AccordionItem>

                {/* FAQ */}
                <AccordionItem value="faq" className="border-b border-gray-200">
                  <AccordionTrigger className="text-sm font-medium h-[25px] py-0 bg-gray-100 px-3 hover:no-underline data-[state=open]:bg-gray-100">
                    FAQ
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-gray-600 space-y-2 pb-3 pt-3">
                    <div>
                      <p className="font-medium">Can I edit my book later?</p>
                      <p className="text-gray-500">Yes, you can save and edit anytime before ordering.</p>
                    </div>
                    <div>
                      <p className="font-medium">What's the minimum page count?</p>
                      <p className="text-gray-500">20 pages minimum, up to 200 pages.</p>
                    </div>
                    <div>
                      <p className="font-medium">Do you offer refunds?</p>
                      <p className="text-gray-500">Yes, within 30 days if you're not satisfied.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Helper Text */}
              <p className="text-xs text-gray-500">
                You can change covers, edit cover text, choose paper and add pages later.
              </p>

              {/* Price Display */}
              {price && (
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-medium">${price.total_price.toFixed(2)} USD</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  data-testid="start-creating-button"
                  onClick={handleStartCreating}
                  disabled={loading}
                  className="flex-1 bg-[#2c5282] hover:bg-[#1e3a5f] text-white py-4 text-sm"
                >
                  {loading ? 'Creating...' : 'Start creating'}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 bg-[#d4a574] hover:bg-[#c49564] text-white border-0 py-4 text-sm"
                >
                  Buy now
                </Button>
              </div>

              {/* Gift Link */}
              <button className="text-xs text-gray-600 hover:underline flex items-center gap-1 justify-center">
                🎁 Gift this product
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
