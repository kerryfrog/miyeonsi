'use client';

import { RefObject, useState } from 'react'; // ✅ useState 추가
import { processRemoveBackground } from '../../lib/utils'; // ✅ 추가

interface Step3CanvasProps {
  captureRef: RefObject<HTMLDivElement>;
  theme: 'black' | 'pink';
  bgImage: string | null;
  targetImage: string | null;
  setTargetImage: (url: string | null) => void; // ✅ 이미지 변경을 위해 추가 필요
  speakerImage: string | null;
  step: number;
  text: string;
  setText: (text: string) => void;
  targetInputRef: RefObject<HTMLInputElement>;
  speakerInputRef: RefObject<HTMLInputElement>;
}

export default function Step3Canvas({
  captureRef,
  theme,
  bgImage,
  targetImage,
  setTargetImage,
  speakerImage,
  step,
  text,
  setText,
  targetInputRef,
  speakerInputRef,
}: Step3CanvasProps) {
  const [isProcessing, setIsProcessing] = useState(false); // ✅ 로딩 상태 관리

  const handleRemoveBg = async (e: React.MouseEvent) => {
    e.stopPropagation(); // 부모 클릭(업로드창 열기) 방지
    if (!targetImage || isProcessing) return;

    setIsProcessing(true);
    try {
      const result = await processRemoveBackground(targetImage);
      setTargetImage(result); // ✅ 누끼 따진 이미지로 교체
    } catch (error) {
      console.error(error); // ✅ 에러 메시지 변경
      alert("배경 제거에 실패했습니다.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    // ✅ justify-center를 추가하여 4:3 캔버스가 수직 중앙에 오도록 설정
    <div className="flex-1 flex flex-col items-center justify-center bg-black">
      <div 
        ref={captureRef} 
        // 가로를 가득 채우는 w-full과 4:3 비율은 그대로 유지합니다.
        className={`relative w-full aspect-[4/3] bg-zinc-900 overflow-hidden shadow-2xl border-y-4 ${
          theme === 'black' ? 'border-zinc-800' : 'border-pink-300'
        }`}
      >
        {bgImage && <img src={bgImage} className="absolute inset-0 w-full h-full object-cover" />}
        
        {/* Speaker image selection UI for step 3 */}
        {step === 3 && (
          <div
            onClick={() => speakerInputRef.current?.click()}
            // Position and size for the interactive area. No background or borders.
            className="absolute bottom-4 left-4 w-20 h-20 flex items-center justify-center cursor-pointer z-30" 
          >
            {speakerImage ? (
              <img src={speakerImage} alt="speaker" className="w-full h-full object-cover" />
            ) : (
              // Replace the entire placeholder with the new image
              <img src="/add_small_character.png" alt="add speaker" className="w-full h-full object-contain p-0" />
            )}
          </div>
        )}

        {/* Step 4: 주인공 선택 UI */}
        {step === 4 && (
          <div 
            onClick={() => !isProcessing && targetInputRef.current?.click()}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-40 h-56 bg-white/10 border-2 border-dashed border-white/50 flex flex-col items-center justify-center cursor-pointer shadow-lg transition-all hover:bg-white/20"
          >
            {targetImage ? (
              <div className="relative w-full h-full group">
                <img src={targetImage} className="w-full h-full object-contain" />
                {/* ✅ 누끼 따기 버튼 (업로드된 이미지가 있을 때만 노출) */}
                <button
                  onClick={handleRemoveBg}
                  disabled={isProcessing}
                  className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-32 py-2 bg-yellow-400 text-black text-xs font-black rounded-full shadow-xl hover:bg-yellow-300 active:scale-95 disabled:opacity-50"
                >
                  {isProcessing ? "처리 중..." : "AI 배경 제거"}
                </button>
              </div>
            ) : (
              <>
                <span className="text-white text-4xl font-thin">+</span>
                <span className="text-white/50 text-[10px] mt-2">주인공 사진 업로드</span>
              </>
            )}
          </div>
        )}

        {/* 주인공 캐릭터 이미지 */}
        {targetImage && step >= 5 && (
          <img src={targetImage} className="absolute top-1/2 left-1/2 w-auto h-[85%] object-contain -translate-x-1/2 -translate-y-1/2 drop-shadow-2xl" />
        )}

        {/* 대사창 영역 */}
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