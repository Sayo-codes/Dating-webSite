"use client";

import React, { useState, useRef, useEffect, useCallback, MouseEvent as ReactMouseEvent } from "react";

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
  const [loadError, setLoadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  /* ---- refs for drag state (avoids stale closures in native listeners) ---- */
  const isDraggingRef = useRef(false);
  const startDragRef = useRef({ x: 0, y: 0 });
  const offsetRef = useRef({ x: 0, y: 0 });
  const zoomRef = useRef(1);

  const circleDiameter = 280;

  // Keep refs in sync with state
  useEffect(() => { offsetRef.current = offset; }, [offset]);
  useEffect(() => { zoomRef.current = zoom; }, [zoom]);

  /* ---- file selection ---- */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoadError(null);

    if (!file.type.startsWith("image/")) {
      setLoadError("Please select an image file.");
      return;
    }

    const url = URL.createObjectURL(file);
    setImageSrc(url);

    const img = new window.Image();
    img.src = url;
    img.onload = () => {
      setImageObj(img);
      setZoom(1);
      zoomRef.current = 1;
      setOffset({ x: 0, y: 0 });
      offsetRef.current = { x: 0, y: 0 };
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      setImageSrc(null);
      setLoadError("Could not load this image. Try a JPEG or PNG file.");
    };

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ---- canvas draw ---- */
  useEffect(() => {
    if (!imageObj || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const radius = circleDiameter / 2;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = "#07070b";
    ctx.fill();

    const scale = Math.max(circleDiameter / imageObj.width, circleDiameter / imageObj.height) * zoom;
    const w = imageObj.width * scale;
    const h = imageObj.height * scale;
    const dx = cx - w / 2 + offset.x;
    const dy = cy - h / 2 + offset.y;
    ctx.drawImage(imageObj, dx, dy, w, h);
    ctx.restore();

    // dim outside circle
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.arc(cx, cy, radius, 0, Math.PI * 2, true);
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fill();
    ctx.restore();

    // ring
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }, [imageObj, zoom, offset]);

  /* ---- native touch + wheel listeners (passive:false so preventDefault works) ---- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageSrc) return;

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      isDraggingRef.current = true;
      const t = e.touches[0];
      startDragRef.current = {
        x: t.clientX - offsetRef.current.x,
        y: t.clientY - offsetRef.current.y,
      };
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (!isDraggingRef.current) return;
      const t = e.touches[0];
      const next = {
        x: t.clientX - startDragRef.current.x,
        y: t.clientY - startDragRef.current.y,
      };
      offsetRef.current = next;
      setOffset(next);
    };

    const onTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      isDraggingRef.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const next = Math.min(Math.max(0.5, zoomRef.current - e.deltaY * 0.001), 5);
      zoomRef.current = next;
      setZoom(next);
    };

    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove",  onTouchMove,  { passive: false });
    canvas.addEventListener("touchend",   onTouchEnd,   { passive: false });
    canvas.addEventListener("wheel",      onWheel,      { passive: false });

    return () => {
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove",  onTouchMove);
      canvas.removeEventListener("touchend",   onTouchEnd);
      canvas.removeEventListener("wheel",      onWheel);
    };
  }, [imageSrc]);

  /* ---- mouse drag (React synthetic events are fine for mouse) ---- */
  const handleMouseDown = useCallback((e: ReactMouseEvent) => {
    isDraggingRef.current = true;
    startDragRef.current = {
      x: e.clientX - offsetRef.current.x,
      y: e.clientY - offsetRef.current.y,
    };
  }, []);

  const handleMouseMove = useCallback((e: ReactMouseEvent) => {
    if (!isDraggingRef.current) return;
    const next = {
      x: e.clientX - startDragRef.current.x,
      y: e.clientY - startDragRef.current.y,
    };
    offsetRef.current = next;
    setOffset(next);
  }, []);

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  /* ---- crop ---- */
  const applyCrop = () => {
    if (!imageObj) return;

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
    setLoadError(null);
  };

  const confirmAndUpload = () => {
    if (croppedBlob && onUploadComplete) {
      onUploadComplete(croppedBlob);
    }
    reset();
  };

  return (
    <>
      {/* Wrapper — tapping anywhere in this div opens the file picker */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}
        className="inline-block relative cursor-pointer"
      >
        {children}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Error toast (shown below the trigger when image fails to load) */}
      {loadError && !imageSrc && (
        <div className="mt-2 rounded-lg border border-red-400/40 bg-red-500/20 px-3 py-2 text-xs text-red-200">
          {loadError}
        </div>
      )}

      {/* Crop modal */}
      {imageSrc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="flex flex-col items-center gap-5 rounded-2xl bg-[#0a0a0f] p-5 border border-white/10 shadow-2xl w-full max-w-sm">
            {!croppedBlob ? (
              <>
                <h3 className="text-lg font-medium text-white text-center">Reposition &amp; Crop</h3>

                {loadError && (
                  <div className="w-full rounded-lg border border-red-400/40 bg-red-500/20 px-3 py-2 text-xs text-red-200 text-center">
                    {loadError}
                  </div>
                )}

                <div
                  className="relative overflow-hidden rounded-xl border border-white/10 bg-[#000]"
                  style={{ width: circleDiameter, height: circleDiameter, touchAction: "none" }}
                >
                  <canvas
                    ref={canvasRef}
                    width={circleDiameter}
                    height={circleDiameter}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    className="cursor-move select-none"
                    style={{ touchAction: "none" }}
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
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      zoomRef.current = v;
                      setZoom(v);
                    }}
                    className="flex-1 accent-[var(--accent-primary)]"
                  />
                  <span className="text-xs text-white/50">+</span>
                </div>

                <div className="flex w-full gap-3 mt-1">
                  <button
                    type="button"
                    onClick={reset}
                    className="flex-1 rounded-full border border-white/20 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={applyCrop}
                    disabled={!imageObj}
                    className="flex-1 rounded-full bg-[var(--accent-primary)] px-4 py-2.5 text-sm font-medium text-[#05060a] hover:opacity-90 transition-opacity disabled:opacity-50"
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
                <div className="flex w-full gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCroppedBlob(null);
                      if (croppedUrl) URL.revokeObjectURL(croppedUrl);
                      setCroppedUrl(null);
                    }}
                    className="flex-1 rounded-full border border-white/20 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/5 transition-colors"
                  >
                    Recrop
                  </button>
                  <button
                    type="button"
                    onClick={confirmAndUpload}
                    className="flex-1 rounded-full bg-[var(--accent-primary)] px-4 py-2.5 text-sm font-medium text-[#05060a] hover:opacity-90 transition-opacity"
                  >
                    Confirm &amp; Upload
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
