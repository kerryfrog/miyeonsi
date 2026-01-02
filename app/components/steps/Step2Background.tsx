'use client';

import { RefObject } from 'react';

import { BACKGROUND_PRESETS } from '../../lib/constants';

interface Step2BackgroundProps {
  bgImage: string | null;
  setBgImage: (image: string | null) => void;
  selectedPreset: string | null;
  setSelectedPreset: (preset: string | null) => void;
  bgInputRef: RefObject<HTMLInputElement>;
}

export default function Step2Background({
  bgImage,
  setBgImage,
  selectedPreset,
  setSelectedPreset,
  bgInputRef,
}: Step2BackgroundProps) {
  return (
    <div className="flex-1 p-6 grid grid-cols-2 grid-rows-3 gap-x-4 gap-y-6 overflow-y-auto animate-fade-in">
      {BACKGROUND_PRESETS.map((item) => (
        <div key={item.id} className="flex flex-col items-center gap-2">
          <div 
            onClick={() => { setBgImage(item.url); setSelectedPreset(item.id); }}
            className={`w-full aspect-[4/3] bg-zinc-800 rounded-lg border-2 transition-all overflow-hidden cursor-pointer ${
              selectedPreset === item.id ? 'border-yellow-400 scale-95' : 'border-zinc-700 hover:border-zinc-500'
            }`}
          >
            <img src={item.url} alt={item.label} className="w-full h-full object-cover" />
          </div>
          <span className="text-[10px] font-bold text-zinc-500">{item.label}</span>
        </div>
      ))}
      <div className="flex flex-col items-center gap-2">
        <div 
          onClick={() => { setSelectedPreset('custom'); bgInputRef.current?.click(); }}
          className={`w-full aspect-[4/3] bg-zinc-900 rounded-lg border-2 transition-all flex items-center justify-center cursor-pointer ${
            selectedPreset === 'custom' ? 'border-yellow-400 scale-95' : 'border-dashed border-zinc-700'
          }`}
        >
          {selectedPreset === 'custom' && bgImage && bgImage !== '/placeholder.png' ? (
            <img src={bgImage} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xl text-zinc-700">+</span>
          )}
        </div>
        <span className="text-[10px] font-bold text-zinc-500">내가 선택하기</span>
      </div>
    </div>
  );
}
