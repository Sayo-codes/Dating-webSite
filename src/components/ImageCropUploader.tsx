"use client";

import React, { useState, useRef, useEffect, MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from "react";

interface ImageCropUploaderProps {
  outputSize?: number;
  onUploadComplete?: (blob: Blob) => void;
  children: React.ReactNode;
}

export function ImageCropUploader({
  outputSize = 400,
  onUploadComplete,
  children,
}: ImageCropUploaderProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
  const [croppedUrl, setCroppedUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Editor states
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });

  const circleDiameter = 280;

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    const img = new window.Image();
    img.src = url;
    img.onload = () => {
      setImageObj(img);
      setZoom(1);
      setOffset({ x: 0, y: 0 });
    };
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Draw on canvas when values change
  useEffect(() => {
    if (!imageObj || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const radius = circleDiameter / 2;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // Save context to clip
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    // Dark background for transparency clarity
    ctx.fillStyle = "#07070b";
    ctx.fill();

    // Calculate dimensions
    // Fit shortest side to diameter
    const scale = Math.max(circleDiameter / imageObj.width, circleDiameter / imageObj.height) * zoom;
    const w = imageObj.width * scale;
    const h = imageObj.height * scale;

    const dx = cx - w / 2 + offset.x;
    const dy = cy - h / 2 + offset.y;

    ctx.drawImage(imageObj, dx, dy, w, h);
    ctx.restore();

    // Draw opaque dimming layer outside the circle
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.arc(cx, cy, radius, 0, Math.PI * 2, true);
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fill();
    ctx.restore();

    // Draw a border ring
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }, [imageObj, zoom, offset]);

  // Drag handling
  const handleDragStart = (e: ReactMouseEvent | ReactTouchEvent) => {
    setIsDragging(true);
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    setStartDrag({ x: clientX - offset.x, y: clientY - offset.y });
  };

  const handleDragMove = (e: ReactMouseEvent | ReactTouchEvent) => {
    if (!isDragging) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    setOffset({ x: clientX - startDrag.x, y: clientY - startDrag.y });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((z) => Math.min(Math.max(0.1, z - e.deltaY * 0.001), 5));
  };

  const applyCrop = () => {
    if (!imageObj) return;

    // Create a hidden canvas tailored to the outputSize
    const outCanvas = document.createElement("canvas");
    outCanvas.width = outputSize;
    outCanvas.height = outputSize;
    const ctx = outCanvas.getContext("2d");
    if (!ctx) return;

    const radius = outputSize / 2;
    const cx = outputSize / 2;
    const cy = outputSize / 2;

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    const scaleRatio = outputSize / circleDiameter;
    const scale = Math.max(circleDiameter / imageObj.width, circleDiameter / imageObj.height) * zoom;
    const w = imageObj.width * scale * scaleRatio;
    const h = imageObj.height * scale * scaleRatio;

    const dx = cx - w / 2 + offset.x * scaleRatio;
    const dy = cy - h / 2 + offset.y * scaleRatio;

    ctx.drawImage(imageObj, dx, dy, w, h);

    outCanvas.toBlob((blob) => {
      if (blob) {
        setCroppedBlob(blob);
        const url = URL.createObjectURL(blob);
        setCroppedUrl(url);
      }
    }, "image/png");
  };

  const reset = () => {
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    if (croppedUrl) URL.revokeObjectURL(croppedUrl);
    setImageSrc(null);
    setImageObj(null);
    setCroppedBlob(null);
    setCroppedUrl(null);
  };

  const confirmAndUpload = () => {
    if (croppedBlob && onUploadComplete) {
      onUploadComplete(croppedBlob);
    }
    reset();
  };

  return (
    <>
      <div onClick={() => fileInputRef.current?.click()} className="inline-block relative">
        {children}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {imageSrc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-6 rounded-2xl bg-[#0a0a0f] p-6 border border-white/10 shadow-2xl w-full max-w-sm">
            {!croppedBlob ? (
              <>
                <h3 className="text-lg font-medium text-white text-center">Reposition & Crop</h3>
                <div
                  className="relative overflow-hidden rounded-xl border border-white/10 bg-[#000]"
                  style={{ width: circleDiameter, height: circleDiameter, touchAction: "none" }}
                >
                  <canvas
                    ref={canvasRef}
                    width={circleDiameter}
                    height={circleDiameter}
                    onMouseDown={handleDragStart}
                    onMouseMove={handleDragMove}
                    onMouseUp={handleDragEnd}
                    onMouseLeave={handleDragEnd}
                    onTouchStart={handleDragStart}
                    onTouchMove={handleDragMove}
                    onTouchEnd={handleDragEnd}
                    onWheel={handleWheel}
                    className="cursor-move"
                  />
                </div>
                <div className="w-full px-4 flex items-center gap-3">
                  <span className="text-xs text-white/50">−</span>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.01"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="flex-1 accent-[var(--accent-primary)]"
                  />
                  <span className="text-xs text-white/50">+</span>
                </div>
                <div className="flex w-full gap-3 mt-2">
                  <button
                    type="button"
                    onClick={reset}
                    className="flex-1 rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={applyCrop}
                    className="flex-1 rounded-full bg-[var(--accent-primary)] px-4 py-2 text-sm font-medium text-[#05060a] hover:opacity-90 transition-opacity"
                  >
                    Apply Crop
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium text-white text-center">Review Image</h3>
                <div className="flex h-32 w-32 items-center justify-center rounded-full overflow-hidden border-2 border-[var(--accent-primary)] bg-black/50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={croppedUrl!} alt="Cropped Preview" className="h-full w-full object-cover" />
                </div>
                <div className="flex w-full gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setCroppedBlob(null);
                      if (croppedUrl) URL.revokeObjectURL(croppedUrl);
                      setCroppedUrl(null);
                    }}
                    className="flex-1 rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/5 transition-colors"
                  >
                    Recrop
                  </button>
                  <button
                    type="button"
                    onClick={confirmAndUpload}
                    className="flex-1 rounded-full bg-[var(--accent-primary)] px-4 py-2 text-sm font-medium text-[#05060a] hover:opacity-90 transition-opacity"
                  >
                    Confirm & Upload
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
