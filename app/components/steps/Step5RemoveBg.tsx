'use client';

interface Step5RemoveBgProps {
  targetImage: string | null;
  isProcessing: boolean;
  progress: number;
  onRemoveBg: () => void;
  onCancel: () => void;
}

export default function Step5RemoveBg({
  targetImage,
  isProcessing,
  progress,
  onRemoveBg,
  onCancel,
}: Step5RemoveBgProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-black p-4">
      <p className="text-xl font-bold mb-4">
        {isProcessing ? "배경 제거 중..." : "주인공 이미지의 배경을 제거할까요?"}
      </p>
      <div className="w-full max-w-xs aspect-square relative mb-8">
        {targetImage && (
          <img src={targetImage} alt="Target" className="object-contain w-full h-full" />
        )}
        {isProcessing && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
            <div className="w-3/4 bg-zinc-700 rounded-full h-2.5">
              <div 
                className="bg-yellow-400 h-2.5 rounded-full transition-all" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-white mt-3 text-sm">{progress}%</p>
          </div>
        )}
      </div>
      <div className="flex gap-4">
        {!isProcessing ? (
          <button
            onClick={onRemoveBg}
            disabled={isProcessing}
            className="w-32 py-3 bg-yellow-400 text-black font-extrabold rounded-full shadow-lg hover:bg-yellow-300 active:scale-95 transition-transform disabled:opacity-50"
          >
            배경 제거
          </button>
        ) : (
          <button
            onClick={onCancel}
            className="w-32 py-3 bg-red-500 text-white font-extrabold rounded-full shadow-lg hover:bg-red-600 active:scale-95 transition-transform"
          >
            취소
          </button>
        )}
      </div>
    </div>
  );
}
