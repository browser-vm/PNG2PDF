import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import type { ImageFile } from '../types';

interface DropzoneProps {
  onFilesDrop: (files: ImageFile[]) => void;
}

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ACCEPTED_TYPES = ['image/png'];

export function Dropzone({ onFilesDrop }: DropzoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const processedFiles = acceptedFiles.map(file => 
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      })
    ) as ImageFile[];
    onFilesDrop(processedFiles);
  }, [onFilesDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png']
    },
    maxSize: MAX_FILE_SIZE,
    validator: (file) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        return {
          code: 'file-invalid-type',
          message: 'Only PNG files are allowed'
        };
      }
      return null;
    }
  });

  return (
    <div
      {...getRootProps()}
      className={`p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center text-gray-600">
        <Upload className="w-12 h-12 mb-4" />
        <p className="text-lg font-medium mb-2">
          {isDragActive ? 'Drop PNG files here' : 'Drag & drop PNG files here'}
        </p>
        <p className="text-sm text-gray-500">or click to select files</p>
        <p className="text-xs text-gray-400 mt-2">Maximum file size: 100MB</p>
      </div>
    </div>
  );
}
