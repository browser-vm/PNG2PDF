import React from 'react';
import type { PDFSettings as PDFSettingsType } from '../types';

interface PDFSettingsProps {
  settings: PDFSettingsType;
  onSettingsChange: (settings: PDFSettingsType) => void;
}

export function PDFSettings({ settings, onSettingsChange }: PDFSettingsProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
      <h3 className="text-lg font-semibold mb-4">PDF Settings</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Page Size
        </label>
        <select
          value={settings.pageSize}
          onChange={(e) => onSettingsChange({ ...settings, pageSize: e.target.value as PDFSettingsType['pageSize'] })}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="original">Original Size</option>
          <option value="a4">A4</option>
          <option value="letter">Letter</option>
          <option value="legal">Legal</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Orientation
        </label>
        <select
          value={settings.orientation}
          onChange={(e) => onSettingsChange({ ...settings, orientation: e.target.value as PDFSettingsType['orientation'] })}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          disabled={settings.pageSize === 'original'}
        >
          <option value="portrait">Portrait</option>
          <option value="landscape">Landscape</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Margins (mm)
        </label>
        <input
          type="number"
          min="0"
          max="50"
          value={settings.margins}
          onChange={(e) => onSettingsChange({ ...settings, margins: Number(e.target.value) })}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}