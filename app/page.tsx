'use client';

import { useState, useRef, ChangeEvent } from 'react';

// Component Imports
import Step1Theme from './components/steps/Step1Theme';
import Step2Background from './components/steps/Step2Background';
import Step3Canvas from './components/steps/Step3Canvas';
import Step5RemoveBg from './components/steps/Step5RemoveBg';
import GuideFooter from './components/GuideFooter';
import { BACKGROUND_PRESETS } from './lib/constants';
import { handleUpload, saveImage, processRemoveBackground } from './lib/utils'; // Import from utils

export default function MobilePrototype() {
  // State
  const [step, setStep] = useState(1);
  const [theme, setTheme] = useState<'black' | 'pink'>('black');
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null); // Keep this state
  const [targetImage, setTargetImage] = useState<string | null>(null);
  const [speakerImage, setSpeakerImage] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false); // New State
  const [progress, setProgress] = useState(0); // New State

  // Refs
  const captureRef = useRef<HTMLDivElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const targetInputRef = useRef<HTMLInputElement>(null);
  const speakerInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // New ref

  // New saveImage handler to pass correct props from page.tsx to utils.saveImage
  const handleSaveImage = () => saveImage({ captureRef, theme, setPreviewUrl });

  const handleRemoveBg = async () => {
    if (!targetImage || isProcessing) return;

    setIsProcessing(true);
    setProgress(0);
    try {
      const result = await processRemoveBackground(targetImage, setProgress);
      setTargetImage(result);
    } catch (error) {
      console.error(error);
      alert("배경 제거에 실패했습니다.");
    } finally {
      setIsProcessing(false);
      setStep(6);
    }
  };

  const handleSkipRemoveBg = () => {
    setStep(6);
  };

  return (
    <main className="min-h-screen flex justify-center bg-black font-chatwindow text-white select-none">
      <div className="w-full max-w-md flex flex-col relative overflow-hidden bg-black shadow-2xl">
        
        <header className="flex-none flex flex-col items-center justify-center p-6 border-b border-white/10 bg-black z-10">
          <img src="/trash.png" alt="reset" onClick={() => window.location.reload()} className="w-6 h-6 cursor-pointer invert absolute left-4 top-8 opacity-60 hover:opacity-100 transition-opacity" />
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-widest text-white">
              {step === 1 ? "레트로 미연시 만들기" : "만드는 중.."}
            </h1>
            {step === 1 && <p className="text-[15px] text-zinc-500 mt-1 uppercase tracking-widest">준비물: 배경, 캐릭터, 대사</p>}
          </div>
        </header>

        {/* 메인 컨테이너 - min-h-0 maintained for flexbox */}
        <div className="flex-1 flex flex-col relative overflow-hidden min-h-0">
          {step === 1 && <Step1Theme theme={theme} setTheme={setTheme} />}
          
          {step === 2 && (
            <Step2Background
              bgImage={bgImage} // Corrected
              setBgImage={setBgImage}
              selectedPreset={selectedPreset} // Corrected
              setSelectedPreset={setSelectedPreset} // Corrected
              bgInputRef={bgInputRef}
            />
          )}

          {(step === 3 || step === 4) && (
            <Step3Canvas
              captureRef={captureRef}
              theme={theme}
              bgImage={bgImage}
              targetImage={targetImage}
              speakerImage={speakerImage}
              step={step}
              text={text}
              setText={setText}
              // ✅ Ref 전달 추가
              targetInputRef={targetInputRef}
              speakerInputRef={speakerInputRef}
            />
          )}
          
          {step === 5 && (
            <Step5RemoveBg
              targetImage={targetImage}
              isProcessing={isProcessing}
              progress={progress}
            />
          )}

          {step >= 6 && (
            <Step3Canvas
              captureRef={captureRef}
              theme={theme}
              bgImage={bgImage}
              targetImage={targetImage}
              speakerImage={speakerImage}
              step={step}
              text={text}
              setText={setText}
              // ✅ Ref 전달 추가
              targetInputRef={targetInputRef}
              speakerInputRef={speakerInputRef}
            />
          )}
        </div>
        {/* 푸터 */}
        <GuideFooter
          step={step}
          setStep={setStep}
          theme={theme}
          bgImage={bgImage}
          speakerImage={speakerImage}
          targetImage={targetImage}
          setTargetImage={setTargetImage}
          text={text}
          onSave={handleSaveImage}
          onRemoveBg={handleRemoveBg}
          onSkipRemoveBg={handleSkipRemoveBg}
          isProcessing={isProcessing}
        />

      </div>
      
      {/* Hidden Inputs */}
      <input type="file" accept="image/*" ref={bgInputRef} onChange={(e) => handleUpload(e, setBgImage)} className="hidden" />
      <input type="file" accept="image/*" ref={targetInputRef} onChange={(e) => handleUpload(e, setTargetImage)} className="hidden" />
      <input type="file" accept="image/*" ref={speakerInputRef} onChange={(e) => handleUpload(e, setSpeakerImage)} className="hidden" />
      <input type="file" accept="image/*" ref={fileInputRef} onChange={(e) => handleUpload(e, () => {})} className="hidden" /> {/* Added and simplified */}
    </main>
  );
}