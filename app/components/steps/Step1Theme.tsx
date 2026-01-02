'use client';

interface Step1ThemeProps {
  theme: 'black' | 'pink';
  setTheme: (theme: 'black' | 'pink') => void;
}

export default function Step1Theme({ theme, setTheme }: Step1ThemeProps) {
  return (
    <div className="flex-1 flex flex-col h-full p-4 gap-4 animate-fade-in">
      {/* 블랙 테마 카드 */}
      <div 
        onClick={() => setTheme('black')}
        className={`flex-1 relative cursor-pointer overflow-hidden rounded-2xl transition-all duration-300 border-2 ${
          theme === 'black' ? 'border-yellow-400 scale-[0.98] bg-zinc-900 shadow-[0_0_15px_rgba(250,204,21,0.3)]' : 'border-white/5 opacity-30 bg-zinc-950 hover:opacity-100'
        }`}
      >
        <img src="/black_character.png" alt="Black" className="absolute inset-0 w-full h-full object-contain p-6" />
        {theme === 'black' && <div className="absolute top-3 right-3 bg-yellow-400 text-black text-[10px] px-2 py-0.5 font-black rounded-full shadow-lg">SELECTED</div>}
      </div>

      {/* 핑크 테마 카드 */}
      <div 
        onClick={() => setTheme('pink')}
        className={`flex-1 relative cursor-pointer overflow-hidden rounded-2xl transition-all duration-300 border-2 ${
          theme === 'pink' ? 'border-pink-500 scale-[0.98] bg-zinc-900 shadow-[0_0_15px_rgba(236,72,153,0.3)]' : 'border-white/5 opacity-30 bg-zinc-950 hover:opacity-100'
        }`}
      >
        <img src="/pink_character.png" alt="Pink" className="absolute inset-0 w-full h-full object-contain p-4" />
        {theme === 'pink' && <div className="absolute top-3 right-3 bg-pink-500 text-white text-[10px] px-2 py-0.5 font-black rounded-full shadow-lg">SELECTED</div>}
      </div>
    </div>
  );
}
