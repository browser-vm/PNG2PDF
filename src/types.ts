export interface ImageFile extends File {
  preview: string;
}

export interface PDFSettings {
  pageSize: 'a4' | 'letter' | 'legal' | 'original';
  orientation: 'portrait' | 'landscape';
  margins: number;
}

export interface ConversionProgress {
  current: number;
  total: number;
  status: 'idle' | 'uploading' | 'converting' | 'complete' | 'error';
  message?: string;
}