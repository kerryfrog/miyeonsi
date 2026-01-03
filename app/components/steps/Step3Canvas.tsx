'use client';

import { RefObject } from 'react';

interface Step3CanvasProps {
  captureRef: RefObject<HTMLDivElement | null>;
  theme: 'black' | 'pink';
  bgImage: string | null;
  targetImage: string | null;
  speakerImage: string | null;
  step: number;
  text: string;
  setText: (text: string) => void;
  targetInputRef: RefObject<HTMLInputElement | null>;
  speakerInputRef: RefObject<HTMLInputElement | null>;
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
  targetInputRef,
  speakerInputRef,
}: Step3CanvasProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-black">
      <div 
        ref={captureRef} 
        className={`relative w-full aspect-[4/3] bg-black overflow-hidden shadow-2xl border-y-4 ${
          theme === 'black' ? 'border-zinc-800' : 'border-pink-300'
        }`}
      >
        {bgImage && <img src={bgImage} className="absolute inset-0 w-full h-full object-cover" />}
        
        {/* Speaker image selection UI for step 3 */}
        {step === 3 && (
          <div
            onClick={() => speakerInputRef.current?.click()}
            className="absolute bottom-4 left-4 w-20 h-20 flex items-center justify-center cursor-pointer z-30" 
          >
            {speakerImage ? (
              <img src={speakerImage} alt="speaker" className="w-full h-full object-cover" />
            ) : (
              <img src="/add_small_character.png" alt="add speaker" className="w-full h-full object-contain p-0" />
            )}
          </div>
        )}

        {/* Target image selection UI for step 4 */}
        {step === 4 && (
          <div 
            onClick={() => targetInputRef.current?.click()}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-40 h-56 bg-white/10 border-2 border-dashed border-white/50 flex flex-col items-center justify-center cursor-pointer shadow-lg transition-all hover:bg-white/20"
          >
            {targetImage ? (
              <img src={targetImage} className="w-full h-full object-contain" />
            ) : (
              <>
                <span className="text-white text-4xl font-thin">+</span>
                <span className="text-white/50 text-[10px] mt-2">주인공 사진 업로드</span>
              </>
            )}
          </div>
        )}

        {/* Display final elements from Step 6 onwards */}
        {targetImage && step >= 6 && (
          <img src={targetImage} className="absolute top-1/2 left-1/2 w-auto h-[85%] object-contain -translate-x-1/2 -translate-y-1/2 drop-shadow-2xl" />
        )}

        {step >= 6 && (
          <div className="absolute bottom-4 left-4 right-4 h-24 bg-[rgba(0,0,0,0.66)] rounded-xl border border-white/10 p-3 flex items-center shadow-2xl backdrop-blur-sm">
            {/* 스피커 이미지 박스 */}
            <div className="relative z-10 w-16 h-16 border-2 border-yellow-400 bg-zinc-800 overflow-hidden shrink-0 rounded-lg">
              {speakerImage && <img src={speakerImage} className="w-full h-full object-cover" />}
            </div>
            
            {/* 텍스트 영역: text-white 적용 */}
            <div className="flex-1 ml-4 flex items-center">
              {step === 6 ? (
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full bg-transparent text-[18px] font-normal leading-none tracking-normal outline-none resize-none font-chatwindow p-1 placeholder:text-zinc-500"
                  placeholder="대사를 입력하세요..."
                  autoFocus
                  style={{ color: 'white' }}
                />
              ) : (
                <div 
                  className="text-[18px] font-normal leading-none tracking-normal font-chatwindow p-1 whitespace-pre-wrap drop-shadow-sm"
                  style={{ color: 'white' }}
                >
                  {text || "..."}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}