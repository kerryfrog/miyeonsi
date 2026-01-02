'use client';

import { RefObject } from 'react';

interface Step3CanvasProps {
  captureRef: RefObject<HTMLDivElement>;
  theme: 'black' | 'pink';
  bgImage: string | null;
  targetImage: string | null;
  speakerImage: string | null;
  step: number;
  text: string;
  setText: (text: string) => void;
}

export default function Step3Canvas({
  captureRef,
  theme,
  bgImage,
  targetImage,
  speakerImage,
  step,
  text,
  setText,
}: Step3CanvasProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div 
        ref={captureRef} 
        className={`relative w-full aspect-[4/3] bg-zinc-900 overflow-hidden shadow-2xl border-4 ${
          theme === 'black' ? 'border-zinc-800' : 'border-pink-300'
        }`}
      >
        {bgImage && <img src={bgImage} className="absolute inset-0 w-full h-full object-cover" />}
        
        {targetImage && step >= 5 && (
          <img src={targetImage} className="absolute top-1/2 left-1/2 w-auto h-[85%] object-contain -translate-x-1/2 -translate-y-1/2 drop-shadow-2xl" />
        )}

        {(step >= 5) && (
          <div className="absolute bottom-0 inset-x-0 h-28 bg-black/80 border-t border-white/10 p-3 flex items-end">
            <div className="relative z-10 w-20 h-20 border-2 border-yellow-400 bg-zinc-800 overflow-hidden shrink-0 -rotate-1">
              {speakerImage && <img src={speakerImage} className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1 ml-4 h-full">
              {step === 5 ? (
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full h-full bg-transparent text-sm text-zinc-100 outline-none resize-none font-chatwindow p-1"
                  placeholder="대사를 입력하세요..."
                  autoFocus
                />
              ) : (
                <div className="text-sm text-zinc-100 font-chatwindow p-1 whitespace-pre-wrap">{text}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
