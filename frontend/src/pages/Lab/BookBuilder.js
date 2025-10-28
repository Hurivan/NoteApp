import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { useBuilderStore } from '@/store/builderStore';
import Header from '@/components/Lobby/Header';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Upload, Save, Download, ShoppingCart, ChevronLeft, ChevronRight, Grid3x3, Eye, Maximize2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import SpreadCanvas from '@/components/Lab/SpreadCanvas';
import FilmStrip from '@/components/Lab/FilmStrip';
import ImageUploadModal from '@/components/Lab/ImageUploadModal';
import { LAYOUTS } from '@/utils/layouts';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function BookBuilder() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [imageCountFilter, setImageCountFilter] = useState('all');
  
  const {
    projectName,
    spreads,
    currentSpreadIndex,
    uploadedImages,
    viewMode,
    filmStripVisible,
    setProjectInfo,
    setSpecs,
    initializeSpreads,
    setCurrentSpread,
    updatePageLayout,
    setViewMode,
    toggleFilmStrip
  } = useBuilderStore();

  useEffect(() => {
    if (projectId) {
      fetchProject();
    } else {
      setLoading(false);
      initializeSpreads(40);
    }
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const response = await axios.get(`${API}/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProject(response.data);
      setProjectInfo(response.data.id, response.data.name);
      setSpecs(response.data.config);
      initializeSpreads(response.data.config.page_count);
    } catch (error) {
      toast.error('Failed to load project');
      navigate('/account');
    } finally {
      setLoading(false);
    }
  };

  const saveProject = async () => {
    if (!projectId) return;
    setSaving(true);
    try {
      const pages = [];
      spreads.forEach(spread => {
        if (spread.leftPage) pages.push(spread.leftPage);
        if (spread.rightPage) pages.push(spread.rightPage);
      });
      await axios.patch(`${API}/projects/${projectId}`, { pages }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Saved');
    } catch (error) {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const filteredLayouts = imageCountFilter === 'all' 
    ? Object.values(LAYOUTS)
    : Object.values(LAYOUTS).filter(l => {
        if (imageCountFilter === 'blank') return l.slots === 0;
        if (imageCountFilter === 'text') return l.textOnly;
        return l.slots === parseInt(imageCountFilter);
      });

  if (loading) {
    return <div className="lab flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const currentSpread = spreads[currentSpreadIndex];

  return (
    <div className="lab min-h-screen flex flex-col">
      {/* Top Toolbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-3">
            <Button onClick={() => navigate('/account')} variant="ghost" size="sm">
              <ArrowLeft size={16} className="mr-1" />Back
            </Button>
            <div className="h-4 w-px bg-gray-300" />
            <input 
              value={projectName}
              onChange={(e) => setProjectInfo(projectId, e.target.value)}
              className="text-sm font-medium border-none focus:outline-none bg-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setShowUploadModal(true)} variant="ghost" size="sm">
              <Upload size={16} className="mr-1" />Upload Images
            </Button>
            <Button onClick={() => setViewMode(viewMode === 'overview' ? 'spread' : 'overview')} variant="ghost" size="sm">
              {viewMode === 'overview' ? <Maximize2 size={16} /> : <Grid3x3 size={16} />}
            </Button>
            <Button onClick={() => setViewMode('preview')} variant="ghost" size="sm">
              <Eye size={16} />
            </Button>
            <Button onClick={saveProject} disabled={saving} variant="ghost" size="sm">
              <Save size={16} className="mr-1" />{saving ? 'Saving...' : 'Save'}
            </Button>
            <Button onClick={() => navigate('/checkout')} className="bg-black text-white" size="sm">
              <ShoppingCart size={16} className="mr-1" />Checkout
            </Button>
          </div>
        </div>
      </header>

      <div className="pt-12 flex flex-1 h-screen overflow-hidden">
        {/* Left Sidebar - Spread Thumbnails */}
        <aside className="w-48 border-r border-gray-200 bg-white overflow-y-auto">
          <ScrollArea className="h-full p-2">
            <div className="space-y-2">
              {spreads.map((spread, idx) => (
                <div
                  key={spread.id}
                  onClick={() => setCurrentSpread(idx)}
                  className={`cursor-pointer p-2 border transition-colors ${
                    currentSpreadIndex === idx ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <div className="flex gap-1 mb-1">
                    <div className="flex-1 aspect-[4/5] bg-gray-100"></div>
                    <div className="flex-1 aspect-[4/5] bg-gray-100"></div>
                  </div>
                  <p className="text-xs text-center">Spread {spread.spreadNumber}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </aside>

        {/* Center - Canvas */}
        <main className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
          <div className="flex-1 flex items-center justify-center overflow-auto p-4">
            {viewMode === 'spread' && currentSpread && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSpreadIndex}
                  initial={{ opacity: 0, rotateY: -10 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  exit={{ opacity: 0, rotateY: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <SpreadCanvas spread={currentSpread} spreadIndex={currentSpreadIndex} />
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* Bottom Controls */}
          <div className="border-t border-gray-200 bg-white p-3 flex-shrink-0">
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={() => setCurrentSpread(Math.max(0, currentSpreadIndex - 1))}
                disabled={currentSpreadIndex === 0}
                variant="outline"
                size="sm"
              >
                <ChevronLeft size={16} />
              </Button>
              <span className="text-sm">Spread {currentSpreadIndex + 1} / {spreads.length}</span>
              <Button
                onClick={() => setCurrentSpread(Math.min(spreads.length - 1, currentSpreadIndex + 1))}
                disabled={currentSpreadIndex === spreads.length - 1}
                variant="outline"
                size="sm"
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </main>

        {/* Right Sidebar - Layout Controls */}
        <aside className="w-64 border-l border-gray-200 bg-white overflow-y-auto">
          <div className="p-3">
            {/* Image Count Filter */}
            <div className="mb-3">
              <label className="text-xs text-gray-500 mb-1 block">Image Count</label>
              <select
                value={imageCountFilter}
                onChange={(e) => setImageCountFilter(e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 text-xs focus:outline-none focus:border-black"
              >
                <option value="all">All Layouts</option>
                <option value="blank">Blank</option>
                <option value="text">Text Only</option>
                <option value="1">1 Image</option>
                <option value="2">2 Images</option>
                <option value="3">3 Images</option>
                <option value="4">4 Images</option>
                <option value="5">5 Images</option>
                <option value="6">6 Images</option>
              </select>
            </div>

            {/* Layout Accordion */}
            <Accordion type="single" collapsible defaultValue="layouts">
              <AccordionItem value="layouts">
                <AccordionTrigger className="text-sm py-2">Page Layouts</AccordionTrigger>
                <AccordionContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-2">
                      {filteredLayouts.map((layout) => (
                        <button
                          key={layout.id}
                          onClick={() => updatePageLayout(currentSpreadIndex, 'left', layout.id)}
                          className="w-full p-2 border border-gray-200 hover:border-black transition-colors flex items-center gap-2"
                        >
                          <div className="w-16 h-12 bg-white border border-gray-200 relative flex-shrink-0">
                            {layout.positions.map((pos, idx) => (
                              <div
                                key={idx}
                                className="absolute bg-gray-200"
                                style={{
                                  left: `${pos.x * 100}%`,
                                  top: `${pos.y * 100}%`,
                                  width: `${pos.w * 100}%`,
                                  height: `${pos.h * 100}%`,
                                  border: '1px solid white'
                                }}
                              />
                            ))}
                          </div>
                          <div className="text-left flex-1">
                            <p className="text-xs font-medium">{layout.name}</p>
                            <p className="text-xs text-gray-500">{layout.slots} {layout.slots === 1 ? 'image' : 'images'}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </aside>
      </div>

      {/* Bottom Film Strip */}
      {filmStripVisible && <FilmStrip />}

      {/* Upload Modal */}
      <ImageUploadModal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} />
    </div>
  );
}