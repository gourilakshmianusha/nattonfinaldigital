import React, { useState } from 'react';

interface BeforeAfterProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  title: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = "Before Intervention",
  afterLabel = "Transformed Outcome",
  title
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50);

  const handleSliderMove = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 select-none group">
      {/* Background/After Image */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9]">
        <img
          src={afterImage}
          alt={`After: ${title}`}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-emerald-900/90 text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          {afterLabel}
        </div>

        {/* Foreground/Before Image clipped by width */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={beforeImage}
            alt={`Before: ${title}`}
            className="absolute inset-0 w-full h-full object-cover max-w-none"
            style={{ width: '100%' }}
          />
          <div className="absolute top-4 left-4 bg-slate-900/90 text-slate-200 font-bold text-xs px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md">
            {beforeLabel}
          </div>
        </div>

        {/* Divider Bar */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-10 cursor-ew-resize"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white text-emerald-900 shadow-xl border-2 border-emerald-600 flex items-center justify-center font-bold text-xs">
            ⇄
          </div>
        </div>

        {/* Hidden Range Input overlay for touch & drag */}
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPosition}
          onChange={handleSliderMove}
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
          aria-label={`Slide to compare before and after for ${title}`}
        />
      </div>

      <div className="bg-slate-900 text-white p-3 text-center text-xs font-medium border-t border-slate-800 flex justify-between items-center px-4">
        <span className="text-slate-400">Drag or swipe slider to compare transformation</span>
        <span className="text-amber-400 font-bold">{sliderPosition}% Transformed</span>
      </div>
    </div>
  );
};
