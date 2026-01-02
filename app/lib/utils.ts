import html2canvas from 'html2canvas';
import { removeBackground } from '@imgly/background-removal';

export const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

// ✅ 주인공 배경 제거(누끼) 함수 추가
export const processRemoveBackground = async (imageSrc: string): Promise<string> => {
  try {
    // 라이브러리 실행 (설정에 따라 public 경로 조정 가능)
    const blob = await removeBackground(imageSrc, {
      progress: (key, current, total) => {
        console.log(`Downloading ${key}: ${Math.round((current / total) * 100)}%`);
      },
    });
    
    // Blob 결과를 다시 Base64 문장열로 변환
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('배경 제거 중 오류 발생:', error);
    throw error;
  }
};

export const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
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

interface SaveImageProps {
  captureRef: React.RefObject<HTMLDivElement>;
  theme: 'black' | 'pink';
  setPreviewUrl: (url: string | null) => void;
}

export const saveImage = async ({ captureRef, theme, setPreviewUrl }: SaveImageProps) => {
  if (!captureRef.current) return;
  try {
    // Assuming document.fonts.ready is still needed for fonts to load correctly before capture
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
