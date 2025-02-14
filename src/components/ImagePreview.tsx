import React from 'react';
import { X, RotateCw, Crop } from 'lucide-react';
import type { ImageFile } from '../types';

interface ImagePreviewProps {
  files: ImageFile[];
  onRemove: (index: number) => void;
}

export function ImagePreview({ files, onRemove }: ImagePreviewProps) {
  if (files.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
      {files.map((file, index) => (
        <div key={file.name} className="relative group">
          <img
            src={file.preview}
            alt={file.name}
            className="w-full h-48 object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-4">
            <button
              onClick={() => onRemove(index)}
              className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
              title="Remove"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            <button
              className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
              title="Rotate"
            >
              <RotateCw className="w-5 h-5 text-gray-700" />
            </button>
            <button
              className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
              title="Crop"
            >
              <Crop className="w-5 h-5 text-gray-700" />
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-600 truncate">{file.name}</p>
        </div>
      ))}
    </div>
  );
}