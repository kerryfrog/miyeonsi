'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { toPng } from 'html-to-image';

export default function MobilePrototype() {
  const [step, setStep] = useState(1);
  const [theme, setTheme] = useState<'black' | 'pink'>('black');
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [targetImage, setTargetImage] = useState<string | null>(null);
  const [speakerImage, setSpeakerImage] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const captureRef = useRef<HTMLDivElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const targetInputRef = useRef<HTMLInputElement>(null);
  const speakerInputRef = useRef<HTMLInputElement>(null);

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
        alert('파일을 처리하는 중 오류가 발생했습니다.');
      }
    }
  };

  const saveImage = async () => {
    if (!captureRef.current) return;
    try {
      const dataUrl = await toPng(captureRef.current, {
        pixelRatio: 3,
        cacheBust: true,
        backgroundColor: theme === 'black' ? '#000' : '#fff',
      });
      
      const link = document.createElement('a');
      link.download = 'miyeonsi.png';
      link.href = dataUrl;
      link.click();

      setPreviewUrl(dataUrl);
    } catch (err) {
      console.error(err);
      alert('이미지 저장에 실패했습니다.');
    }
  };

  const NavButtons = ({ nextDisabled = false, onNext }: { nextDisabled?: boolean, onNext: () => void }) => (
    <div className="flex justify-between mt-4 text-sm font-bold">
      {step > 1 && <button onClick={() => setStep(step - 1)} className="text-gray-400">&lt; 이전</button>}
      <button 
        onClick={onNext} 
        disabled={nextDisabled} 
        className={`ml-auto ${step === 6 ? 'text-pink-500' : 'text-blue-500'} disabled:opacity-30`}
      >
        {step === 6 ? '저장' : '다음 >'}
      </button>
    </div>
  );

  return (
    <main className="min-h-screen flex flex-col bg-black text-white overflow-hidden font-sans">
      <header className="flex-none h-20 flex items-center p-6 relative z-10">
        <img src="/trash.png" alt="reset" onClick={() => window.location.reload()} className="w-8 h-8 absolute left-4 top-4 cursor-pointer" />
        <h1 className="w-full text-center text-xl font-bold tracking-widest opacity-80">
          {step === 1 ? "레트로 미연시 만들기" : "만드는 중.."}
        </h1>
      </header>

      {/* === 2. 중앙 게임 화면 프리뷰 (16:9) === */}
      <div className="flex-1 w-full flex items-center justify-center relative">
        <div 
          ref={captureRef}
          className={`relative w-full aspect-video bg-zinc-900 overflow-hidden shadow-2xl border-y-4 ${theme === 'black' ? 'border-zinc-800' : 'border-pink-200'}`}
        >
          {/* [Step 2] 배경 선택 */}
          {step === 2 && (
            <div onClick={() => bgInputRef.current?.click()} className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer bg-black/20 group">
              {!bgImage && <div className="w-16 h-16 bg-white/10 border-2 border-dashed border-white/30 rounded-full flex items-center justify-center text-4xl font-thin group-hover:bg-white/20 transition-all">+</div>}
            </div>
          )}

          {bgImage && <img src={bgImage} alt="bg" className="absolute inset-0 w-full h-full object-cover" />}

          {/* [Step 4] 주인공 선택 박스 */}
          {step === 4 && (
            <div 
              onClick={() => targetInputRef.current?.click()}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-24 h-32 bg-white/20 border-2 border-dashed border-white/50 flex items-center justify-center cursor-pointer shadow-lg animate-pulse"
            >
              {targetImage ? (
                <img src={targetImage} alt="target" className="w-full h-full object-contain" />
              ) : (
                <span className="text-white text-4xl font-thin">+</span>
              )}
            </div>
          )}

          {targetImage && step >= 5 && (
            <img 
              src={targetImage} 
              alt="target" 
              className="absolute top-1/2 left-1/2 w-auto h-[90%] object-contain drop-shadow-xl animate-float-center" 
            />
          )}

          {/* [Step 3] 아바타 선택 박스 */}
          {step === 3 && (
            <div 
              onClick={() => speakerInputRef.current?.click()}
              className="absolute bottom-4 left-4 z-30 w-20 h-20 bg-white border-2 border-zinc-300 flex items-center justify-center cursor-pointer shadow-lg animate-pulse"
            >
              {speakerImage ? (
                <img src={speakerImage} alt="speaker" className="w-full h-full object-cover" />
              ) : (
                <span className="text-zinc-400 text-3xl font-light">+</span>
              )}
            </div>
          )}

          {/* [Step 5 수정] 이미지 내부 대화창 직접 입력 */}
          {(step >= 5) && (
            <div className={`absolute bottom-0 inset-x-0 h-24 bg-black/70 border-t border-white/20 p-3 flex items-end backdrop-blur-sm ${step === 5 ? 'ring-2 ring-blue-400 ring-inset' : ''}`}>
              <div className="relative z-10 -ml-1 -mb-1 w-18 h-18 border-2 border-yellow-400 bg-zinc-800 overflow-hidden shrink-0 shadow-lg -rotate-2">
                {speakerImage && <img src={speakerImage} alt="speaker" className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 ml-4 pb-1 relative h-full">
                {step === 5 ? (
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full h-full bg-transparent text-xs sm:text-sm leading-relaxed text-zinc-100 font-medium outline-none resize-none placeholder:text-zinc-500 font-chatwindow"
                    placeholder="여기에 직접 대사를 입력하세요..."
                    autoFocus
                  />
                ) : (
                  <div className="text-xs sm:text-sm leading-relaxed text-zinc-100 font-medium break-words whitespace-pre-wrap">
                    {text || "대사를 입력해주세요."}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* === 3. 하단 컨트롤 영역 === */}
      <footer className="flex-none h-48 w-full p-4 pb-8 flex items-end relative z-10">
        <img src="/character.png" alt="character" className="absolute left-2 bottom-2 w-20 h-32 object-contain animate-bounce-slow" />

        <div className="flex-1 ml-24 bg-white text-black p-5 rounded-3xl rounded-bl-none shadow-xl relative">
          {step === 1 && (
            <div className="text-center font-bold">
              <p className="mb-4 text-lg">무슨 느낌으로 만들래??</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => {setTheme('black'); setStep(2)}} className={`px-4 py-2 border-2 rounded-lg ${theme === 'black' ? 'bg-black text-white border-black' : 'border-zinc-300'}`}>블랙</button>
                <button onClick={() => {setTheme('pink'); setStep(2)}} className={`px-4 py-2 border-2 rounded-lg ${theme === 'pink' ? 'bg-pink-400 text-white border-pink-400' : 'border-zinc-300'}`}>핑크</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="text-center font-bold mb-1">배경을 선택해줘!!</p>
              <p className="text-center text-[10px] text-zinc-400 mb-2 italic">화면 중앙을 터치해 사진을 올리세요.</p>
              <NavButtons onNext={() => setStep(3)} nextDisabled={!bgImage} />
            </div>
          )}

          {step === 3 && (
            <div>
              <p className="text-center font-bold mb-1">아바타 사진을 선택해줘!!</p>
              <p className="text-center text-[10px] text-zinc-400 mb-2 italic">화면 왼쪽 하단의 + 박스를 누르세요.</p>
              <NavButtons onNext={() => setStep(4)} nextDisabled={!speakerImage} />
            </div>
          )}

          {step === 4 && (
            <div>
              <p className="text-center font-bold mb-1">주인공 사진을 선택해줘!!</p>
              <p className="text-center text-[10px] text-zinc-400 mb-2 italic">화면 중앙의 큰 + 박스를 누르세요.</p>
              <NavButtons onNext={() => setStep(5)} nextDisabled={!targetImage} />
            </div>
          )}

          {/* [Step 5 수정] 하단 UI는 안내 가이드만 제공 */}
          {step === 5 && (
            <div className="text-center">
              <p className="font-bold mb-1 text-sm">대사를 작성해줘!!</p>
              <p className="text-[10px] text-zinc-400 mb-4 italic">위 이미지의 대화창 내부를 클릭하여 내용을 작성하세요.</p>
              <NavButtons onNext={() => setStep(6)} nextDisabled={!text} />
            </div>
          )}

          {step === 6 && (
            <div className="text-center">
              <p className="font-bold text-lg mb-6 italic tracking-tighter">저장할까?</p>
              <NavButtons onNext={saveImage} />
            </div>
          )}
        </div>
      </footer>

      {/* Hidden Inputs */}
      <input type="file" accept="image/*" ref={bgInputRef} onChange={(e) => handleUpload(e, setBgImage)} className="hidden" />
      <input type="file" accept="image/*" ref={targetInputRef} onChange={(e) => handleUpload(e, setTargetImage)} className="hidden" />
      <input type="file" accept="image/*" ref={speakerInputRef} onChange={(e) => handleUpload(e, setSpeakerImage)} className="hidden" />

      {previewUrl && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-6" onClick={() => setPreviewUrl(null)}>
          <p className="text-white font-bold mb-4 text-lg text-center animate-pulse">이미지를 길게 눌러 저장하세요!</p>
          <img src={previewUrl} alt="final" className="w-full border-2 border-white shadow-2xl" />
          <button className="mt-8 px-10 py-3 bg-white text-black font-bold rounded-full">닫기</button>
        </div>
      )}

      <style jsx global>{`
        @keyframes float-center {
          0%, 100% { transform: translate(-50%, -50%); }
          50% { transform: translate(-50%, -55%); }
        }
        .animate-float-center { animation: float-center 4s ease-in-out infinite; }
        
        @keyframes bounce-custom {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-bounce-slow { animation: bounce-custom 3s infinite; }
      `}</style>
    </main>
  );
}