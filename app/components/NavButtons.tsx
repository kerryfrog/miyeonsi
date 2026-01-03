'use client';

interface NavButtonsProps {
  step: number;
  setStep: (step: number) => void;
  onNext: () => void;
  nextDisabled?: boolean;
}

export default function NavButtons({ step, setStep, onNext, nextDisabled = false }: NavButtonsProps) {
  return (
    <div className="flex justify-between mt-4 text-sm font-bold">
      {step > 1 && step !== 5 && <button onClick={() => setStep(step - 1)} className="text-zinc-500 hover:text-white transition-colors">&lt; 이전</button>}
      <button 
        onClick={onNext} 
        disabled={nextDisabled} 
        className={`ml-auto font-black italic tracking-tighter transition-all ${
          step === 7 ? 'text-pink-500' : 'text-blue-500'
        } disabled:opacity-20`}
      >
        {step === 7 ? '저장하기' : '다음 >'}
      </button>
    </div>
  );
}
