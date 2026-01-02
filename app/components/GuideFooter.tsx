'use client';

import NavButtons from './NavButtons';

interface GuideFooterProps {
  step: number;
  setStep: (step: number) => void;
  saveImage: () => void;
  bgImage: string | null;
  speakerImage: string | null;
  targetImage: string | null;
  text: string;
}

export default function GuideFooter({
  step,
  setStep,
  saveImage,
  bgImage,
  speakerImage,
  targetImage,
  text,
}: GuideFooterProps) {
  return (
    <footer className="flex-none h-64 w-full p-4 pb-12 flex items-end relative z-20 bg-black border-t border-white/5">
      <img src="/character.png" alt="guide" className="absolute left-2 bottom-2 w-28 h-48 object-contain animate-bounce-slow z-30" />
      
      <div className="flex-1 ml-24 bg-zinc-900 text-white p-6 rounded-3xl rounded-bl-none border border-white/10 relative min-h-[160px] flex flex-col justify-between shadow-2xl">
        <div className="font-bold text-[15px] leading-relaxed break-keep">
          {step === 1 ? (
            <>
              무슨느낌으로 만들래 ???
              <br className="mb-2" />
              (<span className="text-zinc-400">블랙</span> / <span style={{ color: '#ff69b4' }} className="font-extrabold">핑크</span>)
            </>
          ) : (
            <div className="text-white">
              {step === 2 && "좋아! 배경 이미지를 불러와줘."}
              {step === 3 && "아바타 사진을 선택해줘!!"}
              {step === 4 && "화면 중앙에 나올 주인공 이미지를 넣어줘!"}
              {step === 5 && "가장 중요한 대사를 입력해봐."}
              {step === 6 && "완벽해! 이제 이미지를 저장해볼까?"}
            </div>
          )}
        </div>

        <NavButtons
          step={step}
          setStep={setStep}
          onNext={step === 6 ? saveImage : () => setStep(step + 1)} 
          nextDisabled={
            (step === 2 && !bgImage) || 
            (step === 3 && !speakerImage) || 
            (step === 4 && !targetImage) || 
            (step === 5 && !text)
          } 
        />
      </div>
    </footer>
  );
}
