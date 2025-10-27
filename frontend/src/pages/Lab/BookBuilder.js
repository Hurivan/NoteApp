import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Stage, Layer, Image as KonvaImage, Rect } from 'react-konva';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowLeft, 
  Upload, 
  Plus, 
  Trash, 
  Download, 
  Save, 
  ShoppingCart,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Grid2x2,
  Grid3x3
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Layout Templates
const LAYOUTS = {
  FULL_BLEED: { id: 'full_bleed', name: 'Full Bleed', icon: Maximize2, slots: 1 },
  TWO_UP: { id: 'two_up', name: 'Two Up', icon: Grid2x2, slots: 2 },
  THREE_GRID: { id: 'three_grid', name: 'Three Grid', icon: Grid3x3, slots: 3 },
  FOUR_GRID: { id: 'four_grid', name: 'Four Grid', icon: Grid3x3, slots: 4 },
};

export default function BookBuilder() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSpread, setCurrentSpread] = useState(0);
  const [spreads, setSpreads] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (projectId) {
      fetchProject();
    } else {
      setLoading(false);
      initializeSpreads();
    }
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const response = await axios.get(`${API}/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProject(response.data);
      if (response.data.pages && response.data.pages.length > 0) {
        const spreadsData = [];
        for (let i = 0; i < response.data.pages.length; i += 2) {
          spreadsData.push({
            spreadNumber: spreadsData.length + 1,
            leftPage: response.data.pages[i],
            rightPage: response.data.pages[i + 1] || null,
          });
        }
        setSpreads(spreadsData);
      } else {
        initializeSpreads(response.data.config.page_count);
      }
    } catch (error) {
      toast.error('Failed to load project');
      navigate('/account');
    } finally {
      setLoading(false);
    }
  };

  const initializeSpreads = (pageCount = 40) => {
    const spreadCount = Math.ceil(pageCount / 2);
    const newSpreads = [];
    for (let i = 0; i < spreadCount; i++) {
      newSpreads.push({
        spreadNumber: i + 1,
        leftPage: {
          pageNumber: i * 2 + 1,
          layout: LAYOUTS.FULL_BLEED.id,
          images: [],
          caption: ''
        },
        rightPage: {
          pageNumber: i * 2 + 2,
          layout: LAYOUTS.FULL_BLEED.id,
          images: [],
          caption: ''
        }
      });
    }
    setSpreads(newSpreads);
  };

  const onDrop = (acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result;
        setUploadedImages((prev) => [...prev, { url: dataUrl, name: file.name, id: Date.now() + Math.random() }]);
        toast.success(`${file.name} uploaded`);
      };
      reader.readAsDataURL(file);
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    multiple: true
  });

  const addImageToPage = (imageUrl, side) => {
    const newSpreads = [...spreads];
    const page = side === 'left' ? newSpreads[currentSpread].leftPage : newSpreads[currentSpread].rightPage;
    
    if (!page) return;
    
    const layoutKey = page.layout.toUpperCase().replace(/-/g, '_');
    const layout = LAYOUTS[layoutKey] || LAYOUTS.FULL_BLEED;
    
    if (page.images.length < layout.slots) {
      page.images.push(imageUrl);
      setSpreads(newSpreads);
      toast.success('Image added');
    } else {
      toast.error(`This layout only supports ${layout.slots} image(s)`);
    }
  };

  const updatePageLayout = (side, layoutId) => {
    const newSpreads = [...spreads];
    const page = side === 'left' ? newSpreads[currentSpread].leftPage : newSpreads[currentSpread].rightPage;
    if (page) {
      page.layout = layoutId;
      page.images = [];
      setSpreads(newSpreads);
      toast.success('Layout changed');
    }
  };

  const updateCaption = (side, caption) => {
    const newSpreads = [...spreads];
    const page = side === 'left' ? newSpreads[currentSpread].leftPage : newSpreads[currentSpread].rightPage;
    if (page) {
      page.caption = caption;
      setSpreads(newSpreads);
    }
  };

  const addSpread = () => {
    const newSpreadNumber = spreads.length + 1;
    setSpreads([...spreads, {
      spreadNumber: newSpreadNumber,
      leftPage: {
        pageNumber: (newSpreadNumber - 1) * 2 + 1,
        layout: LAYOUTS.FULL_BLEED.id,
        images: [],
        caption: ''
      },
      rightPage: {
        pageNumber: (newSpreadNumber - 1) * 2 + 2,
        layout: LAYOUTS.FULL_BLEED.id,
        images: [],
        caption: ''
      }
    }]);
    toast.success('Spread added');
  };

  const deleteSpread = () => {
    if (spreads.length <= 1) {
      toast.error('Cannot delete the last spread');
      return;
    }
    const newSpreads = spreads.filter((_, i) => i !== currentSpread);
    setSpreads(newSpreads);
    if (currentSpread >= newSpreads.length) {
      setCurrentSpread(newSpreads.length - 1);
    }
    toast.success('Spread deleted');
  };

  const saveProject = async () => {
    if (!projectId) {
      toast.error('No project to save');
      return;
    }
    setSaving(true);
    try {
      const pages = [];
      spreads.forEach(spread => {
        if (spread.leftPage) pages.push(spread.leftPage);
        if (spread.rightPage) pages.push(spread.rightPage);
      });
      
      await axios.patch(
        `${API}/projects/${projectId}`,
        { pages },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Project saved');
    } catch (error) {
      toast.error('Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const generatePDF = async () => {
    if (!projectId) {
      toast.error('Please save project first');
      return;
    }
    try {
      await axios.post(
        `${API}/projects/${projectId}/generate-pdf`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('PDF generated (mocked)');
    } catch (error) {
      toast.error('Failed to generate PDF');
    }
  };

  const createOrder = async () => {
    if (!projectId) {
      toast.error('Please save project first');
      return;
    }
    try {
      const response = await axios.post(
        `${API}/orders`,
        { project_id: projectId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Order created!');
      navigate(`/order/${response.data.id}`);
    } catch (error) {
      toast.error('Failed to create order');
    }
  };

  if (loading) {
    return (
      <div className="lab flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  const currentSpreadData = spreads[currentSpread] || { leftPage: null, rightPage: null };

  return (
    <div className="lab min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <Button
              data-testid="back-to-lobby-button"
              onClick={() => navigate('/account')}
              variant="ghost"
              size="sm"
            >
              <ArrowLeft className="mr-2" size={18} />
              Back to Lobby
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <span className="font-semibold text-sm">
              {project?.name || 'New Project'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              data-testid="save-project-button"
              onClick={saveProject}
              disabled={saving || !projectId}
              variant="ghost"
              size="sm"
            >
              <Save className="mr-2" size={18} />
              {saving ? 'Saving...' : 'Save'}
            </Button>
            <Button
              data-testid="generate-pdf-button"
              onClick={generatePDF}
              variant="ghost"
              size="sm"
            >
              <Download className="mr-2" size={18} />
              Export PDF
            </Button>
            <Button
              data-testid="checkout-button"
              onClick={createOrder}
              className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white"
              size="sm"
            >
              <ShoppingCart className="mr-2" size={18} />
              Checkout
            </Button>
          </div>
        </div>
      </header>

      <div className="pt-16 flex h-screen">
        <aside className="w-64 border-r border-gray-200 bg-white overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">Spreads</h3>
              <Button
                data-testid="add-spread-button"
                onClick={addSpread}
                variant="ghost"
                size="sm"
              >
                <Plus size={16} />
              </Button>
            </div>
            
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-2">
                {spreads.map((spread, idx) => (
                  <div
                    key={idx}
                    data-testid={`spread-thumbnail-${idx}`}
                    onClick={() => setCurrentSpread(idx)}
                    className={`cursor-pointer border p-2 transition-colors ${
                      currentSpread === idx ? 'border-[#1a1a1a] bg-gray-50' : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex gap-1 mb-1">
                      <div className="flex-1 aspect-square bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                        {spread.leftPage?.images.length > 0 ? (
                          <img src={spread.leftPage.images[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          'L'
                        )}
                      </div>
                      <div className="flex-1 aspect-square bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                        {spread.rightPage?.images.length > 0 ? (
                          <img src={spread.rightPage.images[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          'R'
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-center text-gray-600">Spread {spread.spreadNumber}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </aside>

        <main className="flex-1 flex flex-col bg-gray-50">
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="flex gap-4">
              <SpreadPage
                page={currentSpreadData.leftPage}
                side="left"
                uploadedImages={uploadedImages}
                onAddImage={(url) => addImageToPage(url, 'left')}
              />
              
              <SpreadPage
                page={currentSpreadData.rightPage}
                side="right"
                uploadedImages={uploadedImages}
                onAddImage={(url) => addImageToPage(url, 'right')}
              />
            </div>
          </div>

          <div className="border-t border-gray-200 bg-white p-4">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <Button
                data-testid="prev-spread-button"
                onClick={() => setCurrentSpread(Math.max(0, currentSpread - 1))}
                disabled={currentSpread === 0}
                variant="outline"
                size="sm"
              >
                <ChevronLeft size={18} />
              </Button>

              <div className="text-center">
                <p className="text-sm font-semibold">
                  Spread {currentSpread + 1} of {spreads.length}
                </p>
                <p className="text-xs text-gray-500">
                  Pages {currentSpreadData.leftPage?.pageNumber || '?'}-{currentSpreadData.rightPage?.pageNumber || '?'}
                </p>
              </div>

              <Button
                data-testid="next-spread-button"
                onClick={() => setCurrentSpread(Math.min(spreads.length - 1, currentSpread + 1))}
                disabled={currentSpread === spreads.length - 1}
                variant="outline"
                size="sm"
              >
                <ChevronRight size={18} />
              </Button>
            </div>
          </div>
        </main>

        <aside className="w-80 border-l border-gray-200 bg-white overflow-y-auto">
          <div className="p-4 space-y-6">
            <div>
              <h3 className="font-semibold text-sm mb-3">Image Library</h3>
              <div
                {...getRootProps()}
                data-testid="dropzone"
                className={`border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-[#1a1a1a] bg-gray-50' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                <p className="text-sm text-gray-600">
                  {isDragActive ? 'Drop here' : 'Upload Images'}
                </p>
              </div>

              {uploadedImages.length > 0 && (
                <ScrollArea className="h-48 mt-3">
                  <div className="grid grid-cols-3 gap-2">
                    {uploadedImages.map((img, idx) => (
                      <div
                        key={idx}
                        data-testid={`uploaded-image-${idx}`}
                        onClick={() => {
                          addImageToPage(img.url, 'left');
                        }}
                        className="cursor-pointer border hover:border-[#1a1a1a] transition-colors"
                      >
                        <img
                          src={img.url}
                          alt={img.name}
                          className="w-full aspect-square object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>

            <div>
              <h3 className="font-semibold text-sm mb-3">Page Layouts</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(LAYOUTS).map((layout) => {
                  const Icon = layout.icon;
                  return (
                    <button
                      key={layout.id}
                      data-testid={`layout-${layout.id}`}
                      onClick={() => updatePageLayout('left', layout.id)}
                      className="border p-3 hover:border-[#1a1a1a] transition-colors text-center"
                    >
                      <Icon className="mx-auto mb-1" size={24} />
                      <p className="text-xs">{layout.name}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-sm mb-3">Captions</h3>
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Left Page</label>
                  <Input
                    data-testid="left-page-caption"
                    value={currentSpreadData.leftPage?.caption || ''}
                    onChange={(e) => updateCaption('left', e.target.value)}
                    placeholder="Caption..."
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Right Page</label>
                  <Input
                    data-testid="right-page-caption"
                    value={currentSpreadData.rightPage?.caption || ''}
                    onChange={(e) => updateCaption('right', e.target.value)}
                    placeholder="Caption..."
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                data-testid="delete-spread-button"
                onClick={deleteSpread}
                variant="outline"
                size="sm"
                className="w-full text-red-600 hover:bg-red-50"
              >
                <Trash className="mr-2" size={16} />
                Delete Spread
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function SpreadPage({ page }) {
  if (!page) {
    return (
      <div
        className="bg-white shadow-lg"
        style={{ width: '400px', height: '500px' }}
      >
        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
          No page
        </div>
      </div>
    );
  }

  const layoutKey = page.layout.toUpperCase().replace(/-/g, '_');
  const layout = LAYOUTS[layoutKey] || LAYOUTS.FULL_BLEED;

  return (
    <div
      data-testid={`page-canvas`}
      className="bg-white shadow-lg relative"
      style={{ width: '400px', height: '500px' }}
    >
      <Stage width={400} height={500}>
        <Layer>
          <Rect width={400} height={500} fill="#ffffff" />
          {page.images.length === 0 ? (
            <>
              <Rect width={400} height={500} fill="#f9fafb" />
            </>
          ) : (
            page.images.map((imgUrl, idx) => (
              <PageImageRenderer key={idx} imageUrl={imgUrl} layout={layout} index={idx} />
            ))
          )}
        </Layer>
      </Stage>
      
      {page.images.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-gray-400 text-sm">Drop or select image</p>
        </div>
      )}
      
      <div className="absolute bottom-2 left-2 text-xs text-gray-400 bg-white px-2 py-1 border">
        Page {page.pageNumber}
      </div>
    </div>
  );
}

function PageImageRenderer({ imageUrl, layout, index }) {
  const [image, setImage] = useState(null);

  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => setImage(img);
    img.src = imageUrl;
  }, [imageUrl]);

  if (!image) return null;

  let x = 0, y = 0, width = 400, height = 500;

  if (layout.id === 'two_up') {
    if (index === 0) {
      x = 0;
      y = 0;
      width = 400;
      height = 250;
    } else if (index === 1) {
      x = 0;
      y = 250;
      width = 400;
      height = 250;
    }
  } else if (layout.id === 'three_grid') {
    if (index === 0) {
      x = 0;
      y = 0;
      width = 400;
      height = 250;
    } else if (index === 1) {
      x = 0;
      y = 250;
      width = 200;
      height = 250;
    } else if (index === 2) {
      x = 200;
      y = 250;
      width = 200;
      height = 250;
    }
  } else if (layout.id === 'four_grid') {
    const positions = [
      { x: 0, y: 0, width: 200, height: 250 },
      { x: 200, y: 0, width: 200, height: 250 },
      { x: 0, y: 250, width: 200, height: 250 },
      { x: 200, y: 250, width: 200, height: 250 },
    ];
    ({ x, y, width, height } = positions[index] || positions[0]);
  }

  const scale = Math.min(width / image.width, height / image.height);
  const scaledWidth = image.width * scale;
  const scaledHeight = image.height * scale;
  const offsetX = x + (width - scaledWidth) / 2;
  const offsetY = y + (height - scaledHeight) / 2;

  return <KonvaImage image={image} x={offsetX} y={offsetY} width={scaledWidth} height={scaledHeight} />;
}
