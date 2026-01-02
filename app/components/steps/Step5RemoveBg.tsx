'use client';

interface Step5RemoveBgProps {
  targetImage: string | null;
}

export default function Step5RemoveBg({
  targetImage,
}: Step5RemoveBgProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-black p-4">
      <p className="text-xl font-bold mb-4">주인공 이미지의 배경을 제거할까요?</p>
      <div className="w-full max-w-xs aspect-square relative mb-8">
        {targetImage && (
          <img src={targetImage} alt="Target" className="object-contain w-full h-full" />
        )}
      </div>
    </div>
  );
}
