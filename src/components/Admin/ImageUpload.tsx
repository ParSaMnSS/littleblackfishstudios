'use client';

import React, { useState, useRef } from 'react';
import { Loader2, UploadCloud, CheckCircle, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { getSupabaseClient } from '@/lib/supabase/client';
import { compressImage } from '@/lib/compress';

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  defaultValue?: string;
  bucket?: 'projects' | 'hero';
}

export default function ImageUpload({ onUploadComplete, defaultValue, bucket = 'projects' }: ImageUploadProps) {
  const [status, setStatus] = useState<'idle' | 'compressing' | 'uploading' | 'done' | 'error'>('idle');
  const [preview, setPreview] = useState<string | null>(defaultValue || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isVideo = (url: string) => /\.(mp4|webm|ogg|mov)$/i.test(url) || url.startsWith('data:video');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      setError('File is too large. Maximum size is 100MB.');
      return;
    }

    setError(null);
    setPreview(URL.createObjectURL(file));

    try {
      const isImageFile = file.type.startsWith('image/');

      setStatus(isImageFile ? 'compressing' : 'uploading');
      const processedFile = await compressImage(file);

      setStatus('uploading');
      const supabase = getSupabaseClient();
      const safeFilename = processedFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const path = `${crypto.randomUUID()}-${safeFilename}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, processedFile, { contentType: processedFile.type, upsert: false });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      onUploadComplete(data.publicUrl);
      setStatus('done');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Upload failed. Please try again.';
      console.error('Upload failed:', err);
      setError(message);
      setPreview(defaultValue || null);
      setStatus('error');
    }
  };

  const uploading = status === 'compressing' || status === 'uploading';

  const statusLabel = status === 'compressing' ? 'Compressing...' : 'Uploading...';

  return (
    <div className="space-y-4">
      <div
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`relative flex aspect-video w-full flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors ${
          uploading
            ? 'cursor-not-allowed border-zinc-700 bg-zinc-900/30'
            : 'cursor-pointer border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900'
        }`}
      >
        {preview ? (
          <>
            {isVideo(preview) ? (
              <video
                src={preview}
                className={`h-full w-full rounded-lg object-cover transition-opacity ${uploading ? 'opacity-30' : 'opacity-60'}`}
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <Image
                src={preview}
                alt="Preview"
                fill
                className={`rounded-lg object-cover transition-opacity ${uploading ? 'opacity-30' : 'opacity-60'}`}
              />
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white rounded-lg">
              {uploading ? (
                <div className="flex flex-col items-center gap-3 px-10 w-full">
                  <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                  <p className="text-sm font-bold tracking-widest">{statusLabel}</p>
                </div>
              ) : (
                <>
                  <CheckCircle className="h-10 w-10 text-green-500 mb-2" />
                  <p className="text-sm font-bold uppercase tracking-widest">Change Media</p>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-zinc-500">
            <UploadCloud className="h-12 w-12 mb-2" />
            <p className="text-sm font-bold uppercase tracking-widest">Upload Media</p>
            <p className="text-xs mt-1">Supports JPG, PNG, WEBP, MP4, WEBM</p>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-500 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp, video/mp4, video/webm, video/quicktime"
        disabled={uploading}
      />
    </div>
  );
}
