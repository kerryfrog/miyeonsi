'use client';

import NavButtons from './NavButtons';

interface GuideFooterProps {
  step: number;
  setStep: (step: number) => void;
  onSave: () => void;
  bgImage: string | null;
  speakerImage: string | null;
  targetImage: string | null;
  setTargetImage: (url: string | null) => void;
  text: string;
  theme: 'black' | 'pink';
  onRemoveBg: () => void;
  onSkipRemoveBg: () => void;
  isProcessing: boolean;
}

export default function GuideFooter({
  step,
  setStep,
  onSave,
  bgImage,
  speakerImage,
  targetImage,
  setTargetImage,
  text,
  theme,
  onRemoveBg,
  onSkipRemoveBg,
  isProcessing,
}: GuideFooterProps) {
  const getStepText = () => {
    switch (step) {
      case 1:
        return (
          <>
            무슨느낌으로 만들래 ???
            <br className="mb-2" />
            {/* 배경이 흰색이므로 '블랙' 텍스트를 진한 회색이나 검정으로 표현합니다. */}
            (<span className="text-zinc-900 font-extrabold decoration-zinc-300 underline-offset-4">블랙</span> / <span style={{ color: '#ff69b4' }} className="font-extrabold">핑크</span>)
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
        return "효과가 추가된 이미지를 저장할까요?";
      default:
        return "";
    }
  };

  return (
    <footer className="flex-none h-64 w-full p-4 pb-12 flex items-end relative z-20 bg-black border-t border-white/5">
      {/* 가이드 캐릭터 */}
      <img src="/character.png" alt="guide" className="absolute left-2 bottom-2 w-28 h-48 object-contain animate-bounce-slow z-30" />
      
      {/* ✅ 말풍선: 흰색 배경(bg-white)과 검정 글씨(text-black) 적용 */}
      <div
        style={{ backgroundColor: '#ffffff', color: '#000000' }} 
        className="flex-1 ml-24 bg-white text-black p-6 rounded-3xl rounded-bl-none border border-white relative min-h-[160px] flex flex-col justify-between shadow-[0_10px_40px_rgba(255,255,255,0.1)]">
        
        {/* 말풍선 꼬리 부분 (CSS 삼각형 대신 absolute div로 꼬리 느낌 구현 가능하지만, 이미 rounded-bl-none으로 구현됨) */}
        
        <div className="font-bold text-[17px] leading-relaxed break-keep">
          {getStepText()}
        </div>

        <NavButtons
          step={step}
          setStep={setStep}
          setTargetImage={setTargetImage}
          onNext={
            step === 5 ? onSkipRemoveBg :
            step === 7 ? onSave : 
            () => setStep(step + 1)
          }
          nextDisabled={
            (step === 2 && !bgImage) || 
            (step === 3 && !speakerImage) || 
            (step === 4 && !targetImage) || 
            (step === 6 && !text) ||
            (step === 5 && isProcessing) // Disable Next button on step 5 if processing
          } 
        />
      </div>
    </footer>
  );
}