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

export default function Step3CanvasBlack({
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
          <div className="absolute bottom-4 left-4 right-4 h-24 bg-[rgba(0,0,0,0.66)] rounded-xl border flex p-3 shadow-2xl backdrop-blur-sm" style={{ borderColor: '#FFD563' }}>
            
            {/* ✅ 화자 이미지: 대화창 위로 튀어나오게 수정 */}
            <div 
              className="absolute -top-3 left-1 w-24 h-24 border-2 bg-zinc-800 overflow-hidden rounded-lg shadow-lg z-50" 
              style={{ borderColor: '#FFD563' }}
            >
              {speakerImage && <img src={speakerImage} className="w-full h-full object-cover" />}
            </div>
            
            {/* ✅ 텍스트 영역: 이미지가 나간 만큼 왼쪽 여백(ml-)을 충분히 확보 */}
            <div className="flex-1 ml-24 flex items-start"> 
              {step === 6 ? (
                <textarea
                  value={text}
                  onChange={handleTextChange}
                  className="w-full h-full bg-transparent text-[18px] font-normal leading-normal tracking-wider outline-none resize-none font-chatwindow p-1 placeholder:text-zinc-500 max-h-[54px] overflow-hidden line-clamp-2"
                  placeholder="대사를 입력하세요..."
                  autoFocus
                  style={{ color: 'white' }}
                />
              ) : (
                <div 
                  className="h-full text-[18px] font-normal leading-normal tracking-wider font-chatwindow p-1 whitespace-pre-wrap drop-shadow-sm max-h-[54px] overflow-hidden line-clamp-2"
                  style={{ color: 'white'   }}
                >
                  {text || "..."}
                </div>
              )}
            </div>
          </div>
        )}
        {step >= 7 && (
          <>
            <img src="/black_mode_1.png" className="absolute top-0 right-0 z-40 w-1/2" />
            <img src="/black_mode_2.png" className="absolute right-0 z-40 w-1/4 h-auto" style={{ top: `40px` }} />
          </>
        )}
      </div>
    </div>
  );
}