import React from 'react';
import type { ConversionProgress } from '../types';

interface ProgressBarProps {
  progress: ConversionProgress;
}

export function ProgressBar({ progress }: ProgressBarProps) {
  if (progress.status === 'idle') return null;

  const percentage = (progress.current / progress.total) * 100;

  return (
    <div className="mt-6">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          {progress.status === 'complete' ? 'Conversion complete!' : 'Converting...'}
        </span>
        <span className="text-sm text-gray-500">
          {progress.current} of {progress.total}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ${
            progress.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
          }`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      {progress.message && (
        <p className={`mt-2 text-sm ${
          progress.status === 'error' ? 'text-red-500' : 'text-gray-500'
        }`}>
          {progress.message}
        </p>
      )}
    </div>
  );
}