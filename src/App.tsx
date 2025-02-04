import React, { useState, useRef, ChangeEvent } from 'react';
import { Upload, SlidersHorizontal, Maximize, Image as ImageIcon, Download } from 'lucide-react';

interface ImageState {
  original: string;
  modified: string;
  width: number;
  height: number;
}

function App() {
  const [image, setImage] = useState<ImageState | null>(null);
  const [quality, setQuality] = useState<number>(90);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [saturation, setSaturation] = useState<number>(100);
  const [size, setSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setSize({ width: img.width, height: img.height });
          setImage({
            original: event.target?.result as string,
            modified: event.target?.result as string,
            width: img.width,
            height: img.height
          });
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = () => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Set canvas size to desired dimensions
      canvas.width = size.width;
      canvas.height = size.height;

      // Draw and apply filters
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
      ctx.drawImage(img, 0, 0, size.width, size.height);

      // Convert to base64 with quality adjustment
      const processed = canvas.toDataURL('image/jpeg', quality / 100);
      setImage(prev => prev ? { ...prev, modified: processed } : null);
    };
    img.src = image.original;
  };

  const handleDownload = () => {
    if (!image?.modified) return;
    const link = document.createElement('a');
    link.download = 'processed-image.jpg';
    link.href = image.modified;
    link.click();
  };

  const handleResize = (newWidth: number, newHeight: number) => {
    setSize({ width: newWidth, height: newHeight });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
            <ImageIcon className="w-8 h-8" />
            Image Processing Tool
          </h1>

          {!image ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-4">
                  <Upload className="w-12 h-12 text-gray-400" />
                  <p className="text-gray-500">Click or drag image to upload</p>
                </div>
              </label>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={image.original}
                    alt="Original"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-center text-gray-500">Original Image</p>
              </div>

              <div className="space-y-6">
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={image.modified}
                    alt="Processed"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-center text-gray-500">Processed Image</p>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <SlidersHorizontal className="w-5 h-5" />
                      Image Quality
                    </h3>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      className="w-full"
                    />
                    <p className="text-sm text-gray-500">Quality: {quality}%</p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Maximize className="w-5 h-5" />
                      Resize
                    </h3>
                    <div className="flex gap-4">
                      <input
                        type="number"
                        value={size.width}
                        onChange={(e) => handleResize(Number(e.target.value), size.height)}
                        className="w-24 px-3 py-2 border rounded"
                        placeholder="Width"
                      />
                      <input
                        type="number"
                        value={size.height}
                        onChange={(e) => handleResize(size.width, Number(e.target.value))}
                        className="w-24 px-3 py-2 border rounded"
                        placeholder="Height"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Brightness</label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={brightness}
                      onChange={(e) => setBrightness(Number(e.target.value))}
                      className="w-full"
                    />
                    <p className="text-sm text-gray-500">{brightness}%</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Contrast</label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={contrast}
                      onChange={(e) => setContrast(Number(e.target.value))}
                      className="w-full"
                    />
                    <p className="text-sm text-gray-500">{contrast}%</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Saturation</label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={saturation}
                      onChange={(e) => setSaturation(Number(e.target.value))}
                      className="w-full"
                    />
                    <p className="text-sm text-gray-500">{saturation}%</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={processImage}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Process Image
                  </button>
                  <button
                    onClick={handleDownload}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

export default App;
