import html2canvas from 'html2canvas-pro';
import { removeBackground } from '@imgly/background-removal';

export const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

// ✅ 주인공 배경 제거(누끼) 함수 추가
export const processRemoveBackground = async (imageSrc: string, onProgress: (progress: number) => void): Promise<string> => {
  try {
    // 라이브러리 실행 (설정에 따라 public 경로 조정 가능)
    const blob = await removeBackground(imageSrc, {
      progress: (key, current, total) => {
        const progressPercentage = Math.round((current / total) * 100);
        console.log(`Downloading ${key}: ${progressPercentage}%`);
        onProgress(progressPercentage);
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
  captureRef: React.RefObject<HTMLDivElement | null>;
  theme: 'black' | 'pink';
  setPreviewUrl: (url: string | null) => void;
}

export const saveImage = async ({ captureRef, theme, setPreviewUrl }: SaveImageProps) => {
  if (!captureRef.current) return;

  const loadOverlay = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.crossOrigin = "anonymous"; // CORS 이슈 방지
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
    });
  };

  try {
    // 1. html2canvas로 현재 화면 캡처
    const canvas = await html2canvas(captureRef.current, {
      backgroundColor: '#000',
      useCORS: true,
      allowTaint: true,
      scale: 2, // 고화질 저장을 위해 스케일 업
      logging: false,
    });

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 2. 테마에 맞는 UI 파일 목록 (핑크 테마용 파일이 없다면 블랙으로 대체)
    const uiFiles = theme === 'black' 
      ? ['/black_mode_1.png', '/black_mode_2.png']
      : ['/black_mode_1.png', '/black_mode_2.png']; // 핑크용 UI가 생기면 여기를 수정하세요.

    // 3. 모든 UI 요소를 비동기로 로드
    const overlays = await Promise.all(uiFiles.map(src => loadOverlay(src)));

    // 4. UI 요소를 우측 상단에 그리기
    let currentY = 30; // 상단 여백
    const rightMargin = 30; // 우측 여백

    overlays.forEach((img) => {
      // 원본 이미지의 절반 크기로 조정 (필요에 따라 조절 가능)
      const displayWidth = img.width / 2;
      const displayHeight = img.height / 2;

      ctx.drawImage(
        img, 
        canvas.width - displayWidth - rightMargin, // 우측 정렬
        currentY, 
        displayWidth, 
        displayHeight
      );

      // 다음 UI를 위해 Y축 간격 띄우기
      currentY += displayHeight + 15; 
    });

    // 5. 결과 저장 및 프리뷰 설정
    const dataUrl = canvas.toDataURL('image/png');
    setPreviewUrl(dataUrl);

    const link = document.createElement('a');
    link.download = `miyeonsi-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();

  } catch (err) {
    console.error('이미지 생성 오류:', err);
    alert('이미지 생성에 실패했습니다. 파일 경로(/public/...)를 확인해주세요.');
  }
};
