import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Stage, Layer, Image as KonvaImage, Text as KonvaText, Rect } from 'react-konva';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Image as ImageIcon,
  Type,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function BookBuilder() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (projectId) {
      fetchProject();
    } else {
      // New project without ID
      setLoading(false);
      initializePages();
    }
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const response = await axios.get(`${API}/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProject(response.data);
      if (response.data.pages && response.data.pages.length > 0) {
        setPages(response.data.pages);
      } else {
        initializePages(response.data.config.page_count);
      }
    } catch (error) {
      toast.error('Failed to load project');
      navigate('/account');
    } finally {
      setLoading(false);
    }
  };

  const initializePages = (count = 40) => {
    const newPages = [];
    for (let i = 0; i < count; i++) {
      newPages.push({
        page_number: i + 1,
        image_url: null,
        caption: '',
        layout: 'full'
      });
    }
    setPages(newPages);
  };

  const onDrop = (acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result;
        setUploadedImages((prev) => [...prev, { url: dataUrl, name: file.name }]);
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

  const addImageToPage = (imageUrl) => {
    const newPages = [...pages];
    newPages[currentPage] = { ...newPages[currentPage], image_url: imageUrl };
    setPages(newPages);
    toast.success('Image added to page');
  };

  const updateCaption = (caption) => {
    const newPages = [...pages];
    newPages[currentPage] = { ...newPages[currentPage], caption };
    setPages(newPages);
  };

  const deletePage = () => {
    if (pages.length <= 1) {
      toast.error('Cannot delete the last page');
      return;
    }
    const newPages = pages.filter((_, i) => i !== currentPage);
    setPages(newPages);
    if (currentPage >= newPages.length) {
      setCurrentPage(newPages.length - 1);
    }
    toast.success('Page deleted');
  };

  const addPage = () => {
    setPages([...pages, {
      page_number: pages.length + 1,
      image_url: null,
      caption: '',
      layout: 'full'
    }]);
    toast.success('Page added');
  };

  const saveProject = async () => {
    if (!projectId) {
      toast.error('No project to save');
      return;
    }
    setSaving(true);
    try {
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
      const response = await axios.post(
        `${API}/projects/${projectId}/generate-pdf`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('PDF generated (mocked)');
      console.log('PDF URL:', response.data.pdf_url);
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

  const currentPageData = pages[currentPage] || {};

  return (
    <div className="lab min-h-screen">
      {/* Lab Toolbar */}
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

      {/* Main Builder Area */}
      <div className="pt-16 flex h-screen">
        {/* Left Sidebar - Image Library */}
        <aside className="w-64 border-r border-gray-200 bg-white overflow-y-auto">
          <div className="p-4">
            <div
              {...getRootProps()}
              data-testid="dropzone"
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-[#1a1a1a] bg-gray-50' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto mb-2 text-gray-400" size={32} />
              <p className="text-sm text-gray-600">
                {isDragActive ? 'Drop images here' : 'Upload Images'}
              </p>
            </div>

            {uploadedImages.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-semibold mb-2">Uploaded Images</p>
                <div className="space-y-2">
                  {uploadedImages.map((img, idx) => (
                    <div
                      key={idx}
                      data-testid={`uploaded-image-${idx}`}
                      onClick={() => addImageToPage(img.url)}
                      className="cursor-pointer border rounded p-2 hover:bg-gray-50 transition-colors"
                    >
                      <img
                        src={img.url}
                        alt={img.name}
                        className="w-full h-24 object-cover rounded mb-1"
                      />
                      <p className="text-xs text-gray-600 truncate">{img.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Center - Canvas Area */}
        <main className="flex-1 flex flex-col bg-gray-50">
          <div className="flex-1 flex items-center justify-center p-8">
            <div
              data-testid="canvas-container"
              className="bg-white shadow-2xl"
              style={{ width: '600px', height: '600px' }}
            >
              <Stage width={600} height={600}>
                <Layer>
                  {currentPageData.image_url ? (
                    <PageImage imageUrl={currentPageData.image_url} />
                  ) : (
                    <>
                      <Rect width={600} height={600} fill="#f9fafb" />
                      <KonvaText
                        text="Drop or select an image"
                        x={0}
                        y={280}
                        width={600}
                        align="center"
                        fontSize={18}
                        fill="#9ca3af"
                      />
                    </>
                  )}
                </Layer>
              </Stage>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="border-t border-gray-200 bg-white p-4">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <Button
                data-testid="prev-page-button"
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                variant="outline"
                size="sm"
              >
                <ChevronLeft size={18} />
              </Button>

              <div className="text-center">
                <p className="text-sm font-semibold">
                  Page {currentPage + 1} of {pages.length}
                </p>
              </div>

              <Button
                data-testid="next-page-button"
                onClick={() => setCurrentPage(Math.min(pages.length - 1, currentPage + 1))}
                disabled={currentPage === pages.length - 1}
                variant="outline"
                size="sm"
              >
                <ChevronRight size={18} />
              </Button>
            </div>
          </div>
        </main>

        {/* Right Sidebar - Page Properties */}
        <aside className="w-64 border-l border-gray-200 bg-white overflow-y-auto">
          <div className="p-4 space-y-4">
            <div>
              <p className="text-sm font-semibold mb-2">Page Caption</p>
              <Input
                data-testid="page-caption-input"
                value={currentPageData.caption || ''}
                onChange={(e) => updateCaption(e.target.value)}
                placeholder="Add caption..."
              />
            </div>

            <div className="space-y-2">
              <Button
                data-testid="add-page-button"
                onClick={addPage}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <Plus className="mr-2" size={16} />
                Add Page
              </Button>
              <Button
                data-testid="delete-page-button"
                onClick={deletePage}
                variant="outline"
                size="sm"
                className="w-full text-red-600 hover:bg-red-50"
              >
                <Trash className="mr-2" size={16} />
                Delete Page
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

// Component to load and display image in Konva
function PageImage({ imageUrl }) {
  const [image, setImage] = useState(null);

  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => setImage(img);
    img.src = imageUrl;
  }, [imageUrl]);

  if (!image) return null;

  // Calculate dimensions to fit 600x600 canvas
  const scale = Math.min(600 / image.width, 600 / image.height);
  const width = image.width * scale;
  const height = image.height * scale;
  const x = (600 - width) / 2;
  const y = (600 - height) / 2;

  return <KonvaImage image={image} x={x} y={y} width={width} height={height} />;
}