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

export default function Step3CanvasPink({
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

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    const lines = inputValue.split('\n');

    if (lines.length > 2) {
      setText(lines.slice(0, 2).join('\n'));
    } else {
      setText(inputValue);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-black">
      {/* ✅ border-y-4 border-pink-300 클래스를 제거했습니다 */}
      <div 
        ref={captureRef} 
        className="relative w-full aspect-[4/3] bg-white overflow-hidden shadow-2xl"
      >
        {/* 배경 이미지 */}
        {bgImage && <img src={bgImage} className="absolute inset-0 w-full h-full object-cover" />}
        
        {/* 주인공 사진 업로드 UI (Step 4) */}
        {step === 4 && (
          <div 
            onClick={() => targetInputRef.current?.click()}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-40 h-56 bg-white/80 border-2 border-dashed border-black flex flex-col items-center justify-center cursor-pointer shadow-lg transition-all hover:bg-white"
          >
            {targetImage ? (
              <img src={targetImage} className="w-full h-full object-contain" />
            ) : (
              <>
                <span className="text-black text-4xl font-thin">+</span>
                <span className="text-black text-[10px] font-bold mt-2">주인공 사진 업로드</span>
              </>
            )}
          </div>
        )}

        {/* 상단 프레임 (Step 7 이상) */}
        {step >= 7 && (
          <img src="/pink_frame.png" className="absolute top-0 left-0 right-0 z-50 w-full h-auto" />
        )}

        {/* 주인공 캐릭터 */}
        {targetImage && step >= 6 && (
          <img src={targetImage} className="absolute top-1/2 left-1/2 w-auto h-[85%] object-contain -translate-x-1/2 -translate-y-1/2 drop-shadow-2xl z-10" />
        )}

        {/* --- [하단 UI 영역] --- */}
        {(step === 3 || step >= 6) && (
          <div className="absolute bottom-0 left-0 right-0 flex items-end z-50">
            
            {/* 1. 화자 이미지 박스 */}
            <div className="bg-white p-[2px] border-t-2 border-r-2 border-black"> 
              <div 
                onClick={step === 3 ? () => speakerInputRef.current?.click() : undefined}
                className={`w-26 h-26 border-2 border-black bg-white overflow-hidden flex items-center justify-center ${step === 3 ? 'cursor-pointer active:scale-95' : ''}`}
              >
                {speakerImage ? (
                  <img src={speakerImage} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center">
                    <span className="text-black text-3xl font-light">+</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* 2. 대사창 영역 */}
            {step >= 6 && (
              <div className="flex-1 bg-white p-[2px] border-t-2 border-black"> 
                <div 
                  className="h-20 border-2 border-black bg-[#FFDFF2] p-3 flex" 
                >
                  <div className="flex-1 flex items-start"> 
                    {step === 6 ? (
                      <textarea
                        value={text}
                        onChange={handleTextChange}
                        className="w-full bg-transparent text-[18px] text-black font-normal leading-tight tracking-wider outline-none resize-none font-chatwindow placeholder:text-zinc-400 overflow-hidden"
                        placeholder="대사를 입력하세요..."
                        autoFocus
                      />
                    ) : (
                      <div className="text-[18px] text-black font-normal leading-tight tracking-wider font-chatwindow whitespace-pre-wrap overflow-hidden line-clamp-2">
                        {text || "..."}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}