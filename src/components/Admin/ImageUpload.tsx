'use client';

import React, { useState, useRef } from 'react';
import { uploadImage } from '@/actions/upload';
import { Loader2, UploadCloud, CheckCircle } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  defaultValue?: string;
}

export default function ImageUpload({ onUploadComplete, defaultValue }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(defaultValue || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const url = await uploadImage(formData);
      onUploadComplete(url);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
      setPreview(defaultValue || null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="relative flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-800 bg-zinc-900/50 transition-colors hover:bg-zinc-900"
      >
        {preview ? (
          <>
            <Image 
              src={preview} 
              alt="Preview" 
              fill 
              className="rounded-lg object-cover opacity-60"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white">
              {uploading ? (
                <>
                  <Loader2 className="h-10 w-10 animate-spin" />
                  <p className="mt-2 text-sm font-medium">Uploading...</p>
                </>
              ) : (
                <>
                  <CheckCircle className="h-10 w-10 text-green-500" />
                  <p className="mt-2 text-sm font-medium text-white">Change Image</p>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-zinc-500">
            <UploadCloud className="h-12 w-12 mb-2" />
            <p className="text-sm font-medium">Click to upload thumbnail</p>
            <p className="text-xs">Supports JPG, PNG, WEBP</p>
          </div>
        )}
      </div>

      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden" 
        accept="image/*"
      />
    </div>
  );
}
