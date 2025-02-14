import React, { useState, useCallback } from 'react';
import { jsPDF } from 'jspdf';
import { FileDown } from 'lucide-react';
import { Dropzone } from './components/Dropzone';
import { ImagePreview } from './components/ImagePreview';
import { PDFSettings } from './components/PDFSettings';
import { ProgressBar } from './components/ProgressBar';
import type { ImageFile, PDFSettings as PDFSettingsType, ConversionProgress } from './types';

function App() {
  const [files, setFiles] = useState<ImageFile[]>([]);
  const [pdfSettings, setPDFSettings] = useState<PDFSettingsType>({
    pageSize: 'original',
    orientation: 'portrait',
    margins: 10,
  });
  const [progress, setProgress] = useState<ConversionProgress>({
    current: 0,
    total: 0,
    status: 'idle',
  });

  const handleFilesDrop = useCallback((newFiles: ImageFile[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const handleRemoveFile = useCallback((index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  }, []);

  const handleConvert = async () => {
    if (files.length === 0) return;

    setProgress({
      current: 0,
      total: files.length,
      status: 'converting',
    });

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Convert image to base64
        const reader = new FileReader();
        await new Promise((resolve, reject) => {
          reader.onload = resolve;
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const imgData = reader.result as string;
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = imgData;
        });

        let doc;
        if (pdfSettings.pageSize === 'original') {
          // For original size, create PDF with image dimensions
          const ptsWidth = img.width * 0.75; // Convert px to pts (72 pts = 96 px)
          const ptsHeight = img.height * 0.75;
          doc = new jsPDF({
            unit: 'pt',
            format: [ptsWidth + (2 * pdfSettings.margins), ptsHeight + (2 * pdfSettings.margins)],
          });
        } else {
          // For standard sizes, use the selected format and orientation
          doc = new jsPDF({
            format: pdfSettings.pageSize,
            orientation: pdfSettings.orientation,
            unit: 'mm',
          });
        }

        if (i > 0) {
          doc.addPage();
        }

        if (pdfSettings.pageSize === 'original') {
          // For original size, use the image's dimensions
          doc.addImage(
            imgData,
            'PNG',
            pdfSettings.margins,
            pdfSettings.margins,
            img.width * 0.75,
            img.height * 0.75
          );
        } else {
          // For standard sizes, fit within margins
          const pageWidth = doc.internal.pageSize.getWidth();
          const pageHeight = doc.internal.pageSize.getHeight();
          const maxWidth = pageWidth - (2 * pdfSettings.margins);
          const maxHeight = pageHeight - (2 * pdfSettings.margins);

          let imgWidth = img.width * 0.75;
          let imgHeight = img.height * 0.75;

          if (imgWidth > maxWidth) {
            const ratio = maxWidth / imgWidth;
            imgWidth = maxWidth;
            imgHeight = imgHeight * ratio;
          }

          if (imgHeight > maxHeight) {
            const ratio = maxHeight / imgHeight;
            imgHeight = maxHeight;
            imgWidth = imgWidth * ratio;
          }

          doc.addImage(
            imgData,
            'PNG',
            pdfSettings.margins,
            pdfSettings.margins,
            imgWidth,
            imgHeight
          );
        }

        setProgress((prev) => ({
          ...prev,
          current: i + 1,
        }));

        if (i === files.length - 1) {
          doc.save('converted-images.pdf');
        }
      }

      setProgress({
        current: files.length,
        total: files.length,
        status: 'complete',
        message: 'PDF has been downloaded successfully!',
      });
    } catch (error) {
      setProgress((prev) => ({
        ...prev,
        status: 'error',
        message: 'An error occurred during conversion. Please try again.',
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            PNG to PDF Converter
          </h1>
          <p className="text-gray-600">
            Convert your PNG images to PDF documents with ease
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <Dropzone onFilesDrop={handleFilesDrop} />
          <ImagePreview files={files} onRemove={handleRemoveFile} />
          <ProgressBar progress={progress} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <PDFSettings
              settings={pdfSettings}
              onSettingsChange={setPDFSettings}
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleConvert}
              disabled={files.length === 0 || progress.status === 'converting'}
              className={`w-full h-12 flex items-center justify-center rounded-lg text-white font-medium
                ${
                  files.length === 0 || progress.status === 'converting'
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                }
              `}
            >
              <FileDown className="w-5 h-5 mr-2" />
              Convert to PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
