import React from 'react';
import { useBuilderStore } from '@/store/builderStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FilmStrip() {
  const { uploadedImages, filmStripVisible, showOnlyUnused, toggleFilmStrip, toggleShowOnlyUnused } = useBuilderStore();

  const handleDragStart = (e, imageId) => {
    e.dataTransfer.setData('imageId', imageId);
  };

  const displayImages = showOnlyUnused 
    ? uploadedImages.filter(img => !img.used)
    : uploadedImages;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
        <span className="text-xs font-medium">Uploaded Images ({displayImages.length})</span>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1 text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlyUnused}
              onChange={toggleShowOnlyUnused}
              className="w-3 h-3"
            />
            Show only unused
          </label>
          <Button onClick={toggleFilmStrip} variant="ghost" size="sm">
            {filmStripVisible ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </Button>
        </div>
      </div>
      
      {filmStripVisible && (
        <ScrollArea className="h-32">
          <div className="flex gap-2 p-3">
            {displayImages.map((image) => (
              <div
                key={image.id}
                draggable
                onDragStart={(e) => handleDragStart(e, image.id)}
                className="flex-shrink-0 w-24 h-24 border border-gray-200 cursor-move hover:border-black transition-colors"
              >
                <img src={image.url} alt={image.name} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}