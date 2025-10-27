import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import Header from '@/components/Lobby/Header';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Product images
const PRODUCT_IMAGES = [
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1606762280793-938d295f2bb2?w=800&h=800&fit=crop'
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
  const [emblaRef, emblaApi] = useEmblaCarousel();
  const [selectedIndex, setSelectedIndex] = useState(0);
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

  React.useEffect(() => {
    if (!emblaApi) return;
    
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    
    emblaApi.on('select', onSelect);
    onSelect();
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

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
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left - Product Images */}
            <div className="space-y-4">
              {/* Main Carousel */}
              <div className="overflow-hidden relative" ref={emblaRef}>
                <div className="flex">
                  {PRODUCT_IMAGES.map((img, index) => (
                    <div key={index} className="flex-[0_0_100%] min-w-0">
                      <img 
                        src={img} 
                        alt={`Product ${index + 1}`}
                        className="w-full h-auto"
                      />
                    </div>
                  ))}
                </div>
                
                {/* Navigation Arrows */}
                <button
                  onClick={scrollPrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 hover:bg-white"
                  aria-label="Previous"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={scrollNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 hover:bg-white"
                  aria-label="Next"
                >
                  <ChevronRight size={24} />
                </button>
              </div>

              {/* Thumbnail Navigation */}
              <div className="flex gap-2">
                {PRODUCT_IMAGES.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => emblaApi && emblaApi.scrollTo(index)}
                    className={`flex-1 border-2 transition-colors ${
                      selectedIndex === index ? 'border-black' : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-auto"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right - Configuration Panel */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-light mb-2">Premium Photo Books</h1>
                <p className="text-gray-600 font-light leading-relaxed">
                  Professional quality handcrafted photo books. Archival paper, premium binding, and stunning presentation.
                </p>
              </div>

              {/* Reviews Badge */}
              <div className="flex items-center gap-2 text-sm">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-500">★</span>
                  ))}
                </div>
                <span className="text-gray-600">894 reviews</span>
              </div>

              {/* Price Guide Link */}
              <button className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                Explore our interactive price guide
                <ArrowRight size={14} />
              </button>

              {/* Configuration Accordion */}
              <Accordion type="multiple" defaultValue={['size', 'cover', 'paper', 'pages']} className="w-full">
                {/* Size & Format */}
                <AccordionItem value="size">
                  <AccordionTrigger className="text-base font-medium">Size & Format</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex gap-3 pt-2">
                      <button
                        data-testid="size-square"
                        onClick={() => updateConfig('orientation', 'square_8x8')}
                        className={`flex-1 p-4 border-2 transition-colors ${
                          config.orientation === 'square_8x8' ? 'border-black' : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="w-12 h-12 border border-gray-400 mx-auto mb-2"></div>
                        <p className="text-xs">8\" × 8\"</p>
                      </button>
                      <button
                        data-testid="size-landscape"
                        onClick={() => updateConfig('orientation', 'landscape_10x8')}
                        className={`flex-1 p-4 border-2 transition-colors ${
                          config.orientation === 'landscape_10x8' ? 'border-black' : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="w-14 h-10 border border-gray-400 mx-auto mb-2"></div>
                        <p className="text-xs">10\" × 8\"</p>
                      </button>
                      <button
                        data-testid="size-portrait"
                        onClick={() => updateConfig('orientation', 'portrait_8x10')}
                        className={`flex-1 p-4 border-2 transition-colors ${
                          config.orientation === 'portrait_8x10' ? 'border-black' : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="w-10 h-14 border border-gray-400 mx-auto mb-2"></div>
                        <p className="text-xs">8\" × 10\"</p>
                      </button>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Cover Fabric */}
                <AccordionItem value="fabric">
                  <AccordionTrigger className="text-base font-medium">Cover Fabric</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {COVER_FABRICS.map((fabric) => (
                        <button
                          key={fabric.id}
                          data-testid={`fabric-${fabric.id}`}
                          onClick={() => updateConfig('cover_fabric', fabric.id)}
                          className={`w-12 h-12 border-2 transition-colors ${
                            config.cover_fabric === fabric.id ? 'border-black' : 'border-gray-300 hover:border-gray-400'
                          }`}
                          style={{ backgroundColor: fabric.color }}
                          title={fabric.name}
                        />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Cover Type */}
                <AccordionItem value="cover">
                  <AccordionTrigger className="text-base font-medium">Cover Type</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex gap-3 pt-2">
                      <button
                        data-testid="cover-hardcover"
                        onClick={() => updateConfig('cover_type', 'hardcover')}
                        className={`flex-1 p-4 border-2 transition-colors text-left ${
                          config.cover_type === 'hardcover' ? 'border-black bg-gray-50' : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <p className="font-medium text-sm">Hardcover</p>
                        <p className="text-xs text-gray-500">Lay-flat binding</p>
                      </button>
                      <button
                        data-testid="cover-softcover"
                        onClick={() => updateConfig('cover_type', 'softcover')}
                        className={`flex-1 p-4 border-2 transition-colors text-left ${
                          config.cover_type === 'softcover' ? 'border-black bg-gray-50' : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <p className="font-medium text-sm">Softcover</p>
                        <p className="text-xs text-gray-500">Lightweight</p>
                      </button>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Paper Type */}
                <AccordionItem value="paper">
                  <AccordionTrigger className="text-base font-medium">Paper Type</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex gap-2 pt-2">
                      <button
                        data-testid="paper-matte"
                        onClick={() => updateConfig('paper_type', 'matte')}
                        className={`flex-1 p-3 border-2 transition-colors ${
                          config.paper_type === 'matte' ? 'border-black' : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="w-full h-8 bg-gray-100 mb-1"></div>
                        <p className="text-xs">Matte</p>
                      </button>
                      <button
                        data-testid="paper-glossy"
                        onClick={() => updateConfig('paper_type', 'glossy')}
                        className={`flex-1 p-3 border-2 transition-colors ${
                          config.paper_type === 'glossy' ? 'border-black' : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="w-full h-8 bg-gradient-to-br from-gray-200 to-white mb-1"></div>
                        <p className="text-xs">Glossy</p>
                      </button>
                      <button
                        data-testid="paper-silk"
                        onClick={() => updateConfig('paper_type', 'silk')}
                        className={`flex-1 p-3 border-2 transition-colors ${
                          config.paper_type === 'silk' ? 'border-black' : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="w-full h-8 bg-gradient-to-br from-gray-100 via-white to-gray-100 mb-1"></div>
                        <p className="text-xs">Silk</p>
                      </button>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Page Number */}
                <AccordionItem value="pages">
                  <AccordionTrigger className="text-base font-medium">Page Number</AccordionTrigger>
                  <AccordionContent>
                    <select
                      data-testid="page-count-select"
                      value={config.page_count}
                      onChange={(e) => updateConfig('page_count', parseInt(e.target.value))}
                      className="w-full p-3 border-2 border-gray-300 hover:border-gray-400 focus:border-black focus:outline-none text-sm mt-2"
                    >
                      {[20, 24, 30, 40, 50, 60, 80, 100, 120, 150, 200].map(count => (
                        <option key={count} value={count}>{count}</option>
                      ))}
                    </select>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Helper Text */}
              <p className="text-xs text-gray-500">
                You can change covers, edit cover text, choose paper and add pages later.
              </p>

              {/* Price Display */}
              {price && (
                <div className="border-t pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-medium">${price.total_price.toFixed(2)} USD</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  data-testid="start-creating-button"
                  onClick={handleStartCreating}
                  disabled={loading}
                  className="flex-1 bg-[#2c5282] hover:bg-[#1e3a5f] text-white py-6 text-base"
                >
                  {loading ? 'Creating...' : 'Start creating'}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 bg-[#d4a574] hover:bg-[#c49564] text-white border-0 py-6 text-base"
                >
                  Buy now
                </Button>
              </div>

              {/* Gift Link */}
              <button className="text-sm text-gray-600 hover:underline flex items-center gap-1 justify-center">
                🎁 Gift this product
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
