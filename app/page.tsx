'use client';

import { useState, useRef, ChangeEvent } from 'react';
import html2canvas from 'html2canvas';

// Component Imports
import Step1Theme from './components/steps/Step1Theme';
import Step2Background from './components/steps/Step2Background';
import Step3Canvas from './components/steps/Step3Canvas';
import GuideFooter from './components/GuideFooter';
import { BACKGROUND_PRESETS } from './lib/constants';

export default function MobilePrototype() {
  // State
  const [step, setStep] = useState(1);
  const [theme, setTheme] = useState<'black' | 'pink'>('black');
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [targetImage, setTargetImage] = useState<string | null>(null);
  const [speakerImage, setSpeakerImage] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Refs
  const captureRef = useRef<HTMLDivElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const targetInputRef = useRef<HTMLInputElement>(null);
  const speakerInputRef = useRef<HTMLInputElement>(null);

  // Helper Functions
  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await toBase64(file);
        setter(base64);
      } catch (error) {
        console.error('Error converting file to base64', error);
      }
    }
  };

  const saveImage = async () => {
    if (!captureRef.current) return;
    try {
      await document.fonts.ready;
      const canvas = await html2canvas(captureRef.current, {
        scale: 3,
        backgroundColor: theme === 'black' ? '#000' : '#fff',
        useCORS: true,
        allowTaint: true,
        logging: false,
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `miyeonsi-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      setPreviewUrl(dataUrl);
    } catch (err) {
      console.error('이미지 생성 오류:', err);
    }
  };

  return (
    <main className="min-h-screen flex justify-center bg-black font-chatwindow text-white">
      <div className="w-full max-w-md min-h-screen bg-black shadow-2xl border-x-2 border-red-600 flex flex-col relative overflow-hidden">
        
        <header className="flex-none flex flex-col items-center justify-center p-6 border-b border-white/10 bg-black z-10">
          <img src="/trash.png" alt="reset" onClick={() => window.location.reload()} className="w-6 h-6 cursor-pointer invert absolute left-4 top-8 opacity-60" />
          <div className="text-center">
            <h1 className="text-xl font-bold tracking-widest text-white">
              {step === 1 ? "레트로 미연시 만들기" : "만드는 중.."}
            </h1>
            {step === 1 && <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-widest">준비물: 배경, 캐릭터, 대사</p>}
          </div>
        </header>

        <div className="flex-1 flex flex-col relative overflow-hidden bg-black">
          {step === 1 && <Step1Theme theme={theme} setTheme={setTheme} />}
          
          {step === 2 && (
            <Step2Background
              bgImage={bgImage}
              setBgImage={setBgImage}
              selectedPreset={selectedPreset}
              setSelectedPreset={setSelectedPreset}
              bgInputRef={bgInputRef}
            />
          )}

          {step >= 3 && (
            <Step3Canvas
              captureRef={captureRef}
              theme={theme}
              bgImage={bgImage}
              targetImage={targetImage}
              speakerImage={speakerImage}
              step={step}
              text={text}
              setText={setText}
            />
          )}
        </div>

        <GuideFooter
          step={step}
          setStep={setStep}
          saveImage={saveImage}
          bgImage={bgImage}
          speakerImage={speakerImage}
          targetImage={targetImage}
          text={text}
        />
      </div>

      <style jsx global>{`
        @keyframes bounce-custom { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .animate-bounce-slow { animation: bounce-custom 3s infinite; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.4s ease-out; }
      `}</style>
      
      <input type="file" accept="image/*" ref={bgInputRef} onChange={(e) => handleUpload(e, setBgImage)} className="hidden" />
      <input type="file" accept="image/*" ref={targetInputRef} onChange={(e) => handleUpload(e, setTargetImage)} className="hidden" />
      <input type="file" accept="image/*" ref={speakerInputRef} onChange={(e) => handleUpload(e, setSpeakerImage)} className="hidden" />

      {previewUrl && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-6 backdrop-blur-sm" onClick={() => setPreviewUrl(null)}>
          <p className="text-white font-bold mb-6 text-lg text-center animate-pulse">이미지를 길게 눌러 저장하세요!</p>
          <img src={previewUrl} alt="final" className="w-full max-w-md border-4 border-white shadow-2xl rounded-lg" />
          <button className="mt-8 px-8 py-3 bg-zinc-800 text-white font-bold rounded-full border border-zinc-600">닫기</button>
        </div>
      )}
    </main>
  );
}