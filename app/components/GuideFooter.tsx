'use client';

import { useState } from 'react'; // Added useState
import NavButtons from './NavButtons';
import { processRemoveBackground } from '../lib/utils';

interface GuideFooterProps {
  step: number;
  setStep: (step: number) => void;
  onSave: () => void;
  bgImage: string | null;
  speakerImage: string | null;
  targetImage: string | null;
  setTargetImage: (url: string | null) => void; // Added
  text: string;
  theme: 'black' | 'pink';
}

export default function GuideFooter({
  step,
  setStep,
  onSave,
  bgImage,
  speakerImage,
  targetImage,
  setTargetImage, // Destructured
  text,
}: GuideFooterProps) {
  const [isProcessing, setIsProcessing] = useState(false); // Added state

  const getStepText = () => {
    switch (step) {
      case 1:
        return (
          <>
            무슨느낌으로 만들래 ???
            <br className="mb-2" />
            (<span className="text-zinc-400">블랙</span> / <span style={{ color: '#ff69b4' }} className="font-extrabold">핑크</span>)
          </>
        );
      case 2:
        return "좋아! 배경 이미지를 불러와줘.";
      case 3:
        return "말하는 사람(화자)의 이미지는 뭐가 좋을까?";
      case 4:
        return "화면 중앙에 나올 주인공 이미지를 넣어줘!";
      case 5:
        return "주인공 이미지의 배경을 제거할까요?";
      case 6:
        return "가장 중요한 대사를 입력해봐.";
      case 7:
        return "완벽해! 이제 이미지를 저장해볼까?";
      default:
        return "";
    }
  };

  const handleRemoveBg = async () => {
    if (!targetImage || isProcessing) return;

    setIsProcessing(true);
    try {
      const result = await processRemoveBackground(targetImage);
      setTargetImage(result);
    } catch (error) {
      console.error(error);
      alert("배경 제거에 실패했습니다.");
    } finally {
      setIsProcessing(false);
      setStep(6); // Move to the next step regardless of success or failure
    }
  };

  const handleSkip = () => {
    setStep(6); // Skip to the next step
  };


  return (
    <footer className="flex-none h-64 w-full p-4 pb-12 flex items-end relative z-20 bg-black border-t border-white/5">
      <img src="/character.png" alt="guide" className="absolute left-2 bottom-2 w-28 h-48 object-contain animate-bounce-slow z-30" />
      
      <div className="flex-1 ml-24 bg-zinc-900 text-white p-6 rounded-3xl rounded-bl-none border border-white/10 relative min-h-[160px] flex flex-col justify-between shadow-2xl">
        <div className="font-bold text-[15px] leading-relaxed break-keep">
          {getStepText()}
        </div>

        {step === 5 ? ( // Conditional rendering for step 5 buttons
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleRemoveBg}
              disabled={isProcessing}
              className="w-32 py-3 bg-yellow-400 text-black font-bold rounded-full shadow-xl hover:bg-yellow-300 active:scale-95 disabled:opacity-50"
            >
              {isProcessing ? "처리 중..." : "네"}
            </button>
            <button
              onClick={handleSkip}
              disabled={isProcessing}
              className="w-32 py-3 bg-zinc-700 text-white font-bold rounded-full shadow-xl hover:bg-zinc-600 active:scale-95 disabled:opacity-50"
            >
              아니요
            </button>
          </div>
        ) : (
          <NavButtons
            step={step}
            setStep={setStep}
            onNext={step === 7 ? onSave : () => setStep(step + 1)}
            nextDisabled={
              (step === 2 && !bgImage) || 
              (step === 3 && !speakerImage) || 
              (step === 4 && !targetImage) || 
              (step === 6 && !text)
            } 
          />
        )}
      </div>
    </footer>
  );
}

