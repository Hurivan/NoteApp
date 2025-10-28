import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useBuilderStore } from '@/store/builderStore';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';

export default function ImageUploadModal({ isOpen, onClose }) {
  const { uploadImages } = useBuilderStore();

  const onDrop = useCallback((acceptedFiles) => {
    const images = acceptedFiles.map((file) => {
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onload = () => resolve({ url: reader.result, name: file.name });
        reader.readAsDataURL(file);
      });
    });

    Promise.all(images).then((imgs) => {
      uploadImages(imgs);
      toast.success(`${imgs.length} images uploaded`);
      onClose();
    });
  }, [uploadImages, onClose]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    multiple: true
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[600px]">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Upload Images</h2>
            <Button onClick={onClose} variant="ghost" size="sm">
              <X size={16} />
            </Button>
          </div>
          
          <div
            {...getRootProps()}
            className={`flex-1 border-2 border-dashed rounded flex items-center justify-center cursor-pointer transition-colors ${
              isDragActive ? 'border-black bg-gray-50' : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <div className="text-center">
              <Upload className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-base font-medium mb-2">
                {isDragActive ? 'Drop images here' : 'Drag & drop images here'}
              </p>
              <p className="text-sm text-gray-500">or click to browse</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}