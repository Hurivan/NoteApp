import React from 'react';
import { useBuilderStore } from '@/store/builderStore';
import { LAYOUTS } from '@/utils/layouts';

export default function SpreadCanvas({ spread, spreadIndex }) {
  const { addImageToPlaceholder, uploadedImages } = useBuilderStore();

  const handleDrop = (e, side, placeholderIndex) => {
    e.preventDefault();
    const imageId = e.dataTransfer.getData('imageId');
    if (imageId) {
      addImageToPlaceholder(spreadIndex, side, placeholderIndex, imageId);
    }
  };

  const renderPage = (page, side) => {
    if (!page) return null;

    const layout = page.layout ? LAYOUTS[page.layout.toUpperCase().replace(/-/g, '_')] : null;

    return (
      <div className="w-[400px] h-[500px] bg-white relative">
        {layout ? (
          layout.positions.map((pos, idx) => {
            const imageId = page.images?.[idx];
            const image = uploadedImages.find(img => img.id === imageId);
            
            return (
              <div
                key={idx}
                onDrop={(e) => handleDrop(e, side, idx)}
                onDragOver={(e) => e.preventDefault()}
                className="absolute border border-gray-300 hover:border-gray-400 transition-colors flex items-center justify-center"
                style={{
                  left: `${pos.x * 100}%`,
                  top: `${pos.y * 100}%`,
                  width: `${pos.w * 100}%`,
                  height: `${pos.h * 100}%`
                }}
              >
                {image ? (
                  <img src={image.url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-gray-400">Drop image</span>
                )}
              </div>
            );
          })
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
            Select layout
          </div>
        )}
        
        {/* Page number */}
        <div className="absolute bottom-2 left-2 text-xs text-gray-400 bg-white px-2 py-1 border border-gray-200">
          {page.pageNumber}
        </div>
      </div>
    );
  };

  return (
    <div className="flex relative shadow-2xl">
      {renderPage(spread.leftPage, 'left')}
      {/* Center gutter hairline */}
      <div className="w-px h-full bg-gray-300 absolute left-1/2 top-0 bottom-0" style={{ transform: 'translateX(-0.5px)' }} />
      {renderPage(spread.rightPage, 'right')}
    </div>
  );
}