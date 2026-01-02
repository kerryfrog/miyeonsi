import html2canvas from 'html2canvas';

export const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

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
