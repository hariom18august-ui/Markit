import React, { useState } from 'react';
import { Upload, FileImage, ArrowRight, Loader2, Bell, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';
import { mockOCRProcess } from '../utils/mockOcr';
import { Timetable } from '../types';

interface LandingPageProps {
  onTimetableGenerated: (timetable: Timetable) => void;
}

export const LandingPage = ({ onTimetableGenerated }: LandingPageProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [isDragging, setIsDragging] = useState(false);

  const processFile = (selectedFile: File) => {
    if (selectedFile.size > 5 * 1024 * 1024) {
      alert('File is too large. Maximum size is 5MB.');
      return;
    }

    setFile(selectedFile);
    
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else if (selectedFile.type === 'application/pdf') {
      // For PDF, show a placeholder icon/text as preview
      setPreview('pdf-placeholder');
    } else {
      setPreview('file-placeholder');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  const handleGenerate = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const timetable = await mockOCRProcess(file);
      onTimetableGenerated(timetable);
    } catch (error) {
      console.error(error);
      alert('Failed to process timetable. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Upload Your <span className="text-indigo-600">Timetable</span>
        </h2>
        <p className="mt-4 text-slate-500">
          Snap a photo or upload a screenshot of your class schedule. We'll handle the rest.
        </p>
      </motion.div>

      <div className="w-full max-w-md">
        {!preview ? (
          <label 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all",
              isDragging 
                ? "border-indigo-500 bg-indigo-50/50 scale-[1.02]" 
                : "border-slate-300 bg-white hover:border-indigo-400 hover:bg-slate-50"
            )}
          >
            <div className="flex flex-col items-center justify-center pb-6 pt-5">
              <div className={cn(
                "mb-4 rounded-full p-4 transition-colors",
                isDragging ? "bg-indigo-100 text-indigo-700" : "bg-indigo-50 text-indigo-600"
              )}>
                <Upload size={32} />
              </div>
              <p className="mb-2 text-sm font-semibold text-slate-700">
                {isDragging ? "Drop it here!" : "Click to upload or drag and drop"}
              </p>
              <p className="text-xs text-slate-500">PNG, JPG or PDF (MAX. 5MB)</p>
            </div>
            <input 
              type="file" 
              className="hidden" 
              onChange={handleFileChange} 
              accept="image/*,.pdf" 
            />
          </label>
        ) : (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
          >
            {preview === 'pdf-placeholder' ? (
              <div className="flex h-64 w-full flex-col items-center justify-center bg-slate-50">
                <div className="mb-4 rounded-xl bg-rose-100 p-4 text-rose-600">
                  <FileImage size={48} />
                </div>
                <span className="text-sm font-bold text-slate-700">{file?.name}</span>
                <span className="text-xs text-slate-500">PDF Document</span>
              </div>
            ) : preview === 'file-placeholder' ? (
              <div className="flex h-64 w-full flex-col items-center justify-center bg-slate-50">
                <Upload size={48} className="text-slate-400 mb-4" />
                <span className="text-sm font-bold text-slate-700">{file?.name}</span>
              </div>
            ) : (
              <img src={preview} alt="Timetable Preview" className="h-64 w-full object-cover opacity-80" />
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
              <button 
                onClick={() => { setFile(null); setPreview(null); }}
                className="rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-slate-900 shadow-lg hover:bg-white"
              >
                Change File
              </button>
            </div>
          </motion.div>
        )}

        <button
          disabled={!file || isProcessing}
          onClick={handleGenerate}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-4 text-lg font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 disabled:opacity-50 disabled:shadow-none"
        >
          {isProcessing ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Processing Timetable...
            </>
          ) : (
            <>
              Generate Timetable
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </div>

      <div className="mt-12 grid grid-cols-3 gap-4 text-center">
        {[
          { icon: FileImage, label: "Auto Scan" },
          { icon: Bell, label: "Reminders" },
          { icon: BarChart3, label: "Analytics" }
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <item.icon size={20} />
            </div>
            <span className="text-xs font-medium text-slate-500">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
