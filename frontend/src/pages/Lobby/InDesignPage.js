import React from 'react';
import Header from '@/components/Lobby/Header';
import { Button } from '@/components/ui/button';
import { Download, Upload } from 'lucide-react';
import { toast } from 'sonner';

export default function InDesignPage() {
  const handleDownload = (size) => {
    toast.success(`Downloading ${size} template`);
  };

  const handleUpload = () => {
    toast.info('PDF upload coming soon');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-light text-center mb-4">
            For Designers
          </h1>
          <p className="text-center text-gray-600 mb-16 font-light">
            Professional InDesign workflow
          </p>

          {/* Technical Specs */}
          <div className="mb-16">
            <h2 className="text-2xl font-light mb-6">Technical Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 border">
                <h3 className="font-medium mb-2">Resolution</h3>
                <p className="text-gray-600 font-light">300 ppi minimum</p>
              </div>
              <div className="p-6 border">
                <h3 className="font-medium mb-2">Color Mode</h3>
                <p className="text-gray-600 font-light">CMYK (Coated FOGRA39)</p>
              </div>
              <div className="p-6 border">
                <h3 className="font-medium mb-2">Bleed</h3>
                <p className="text-gray-600 font-light">0.125" all sides</p>
              </div>
              <div className="p-6 border">
                <h3 className="font-medium mb-2">Safe Area</h3>
                <p className="text-gray-600 font-light">0.25" from trim</p>
              </div>
              <div className="p-6 border">
                <h3 className="font-medium mb-2">PDF Export</h3>
                <p className="text-gray-600 font-light">PDF/X-4:2010</p>
              </div>
              <div className="p-6 border">
                <h3 className="font-medium mb-2">Fonts</h3>
                <p className="text-gray-600 font-light">Embed all fonts</p>
              </div>
            </div>
          </div>

          {/* Templates */}
          <div className="mb-16">
            <h2 className="text-2xl font-light mb-6">Download Templates</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-6 border hover:border-black transition-colors">
                <div>
                  <p className="font-medium">Square 8×8" Template</p>
                  <p className="text-sm text-gray-500">InDesign CC 2020+</p>
                </div>
                <Button
                  data-testid="download-square"
                  onClick={() => handleDownload('Square 8x8')}
                  variant="outline"
                  size="sm"
                >
                  <Download size={16} className="mr-2" />
                  Download
                </Button>
              </div>
              <div className="flex items-center justify-between p-6 border hover:border-black transition-colors">
                <div>
                  <p className="font-medium">Landscape 10×8" Template</p>
                  <p className="text-sm text-gray-500">InDesign CC 2020+</p>
                </div>
                <Button
                  data-testid="download-landscape"
                  onClick={() => handleDownload('Landscape 10x8')}
                  variant="outline"
                  size="sm"
                >
                  <Download size={16} className="mr-2" />
                  Download
                </Button>
              </div>
              <div className="flex items-center justify-between p-6 border hover:border-black transition-colors">
                <div>
                  <p className="font-medium">Portrait 8×10" Template</p>
                  <p className="text-sm text-gray-500">InDesign CC 2020+</p>
                </div>
                <Button
                  data-testid="download-portrait"
                  onClick={() => handleDownload('Portrait 8x10')}
                  variant="outline"
                  size="sm"
                >
                  <Download size={16} className="mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </div>

          {/* Upload */}
          <div className="border p-12 text-center">
            <Upload size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-medium mb-2">Upload Your PDF</h3>
            <p className="text-gray-600 font-light mb-6">
              Export as PDF/X-4:2010 and upload it here
            </p>
            <Button
              data-testid="upload-pdf"
              onClick={handleUpload}
              className="bg-black hover:bg-gray-800 text-white"
            >
              Upload PDF
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}