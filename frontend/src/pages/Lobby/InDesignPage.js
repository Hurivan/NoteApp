import React from 'react';
import Header from '@/components/Lobby/Header';
import { Download, Upload, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function InDesignPage() {
  const handleDownload = (size) => {
    toast.success(`Downloading ${size} template`);
    // Mock download
  };

  const handleUpload = () => {
    toast.info('PDF upload coming soon');
  };

  return (
    <div className="lobby min-h-screen">
      <Header />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-center mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            InDesign Workflow
          </h1>
          <p className="text-xl text-center text-gray-600 mb-16">
            For designers who prefer to work offline
          </p>

          {/* Technical Specs */}
          <section className="bg-white rounded-2xl p-8 shadow-xl mb-8">
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              <FileText className="inline mr-2" />
              Technical Specifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Resolution</h3>
                <p className="text-gray-600">300 ppi minimum</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Color Mode</h3>
                <p className="text-gray-600">CMYK (ICC Profile: Coated FOGRA39)</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Bleed</h3>
                <p className="text-gray-600">0.125" (3mm) all sides</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Safe Area</h3>
                <p className="text-gray-600">0.25" (6mm) from trim</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">PDF Export</h3>
                <p className="text-gray-600">PDF/X-4:2010</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Fonts</h3>
                <p className="text-gray-600">Embed all fonts</p>
              </div>
            </div>
          </section>

          {/* Template Downloads */}
          <section className="bg-white rounded-2xl p-8 shadow-xl mb-8">
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              <Download className="inline mr-2" />
              Download Templates
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-semibold">Square 8×8" Template</p>
                  <p className="text-sm text-gray-500">InDesign CC 2020+</p>
                </div>
                <Button
                  data-testid="download-square-template"
                  onClick={() => handleDownload('Square 8x8')}
                  variant="outline"
                >
                  Download
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-semibold">Landscape 10×8" Template</p>
                  <p className="text-sm text-gray-500">InDesign CC 2020+</p>
                </div>
                <Button
                  data-testid="download-landscape-template"
                  onClick={() => handleDownload('Landscape 10x8')}
                  variant="outline"
                >
                  Download
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-semibold">Portrait 8×10" Template</p>
                  <p className="text-sm text-gray-500">InDesign CC 2020+</p>
                </div>
                <Button
                  data-testid="download-portrait-template"
                  onClick={() => handleDownload('Portrait 8x10')}
                  variant="outline"
                >
                  Download
                </Button>
              </div>
            </div>
          </section>

          {/* PDF Upload */}
          <section className="bg-gradient-to-br from-[#8B1E3F] to-[#2E4057] text-white rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              <Upload className="inline mr-2" />
              Upload Your PDF
            </h2>
            <p className="mb-6 opacity-90">
              Once your design is complete, export as PDF/X-4:2010 and upload it here.
              We'll validate your file and calculate pricing automatically.
            </p>
            <Button
              data-testid="upload-pdf-button"
              onClick={handleUpload}
              size="lg"
              className="bg-white text-[#8B1E3F] hover:bg-gray-100"
            >
              Upload PDF
            </Button>
          </section>
        </div>
      </main>
    </div>
  );
}