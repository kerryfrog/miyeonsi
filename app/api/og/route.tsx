// app/api/og/route.tsx
import { ImageResponse } from '@vercel/og';
import * as fs from 'fs'; // Import fs
import * as path from 'path'; // Import path

export const runtime = 'nodejs'; // Corrected runtime

export async function POST(request: Request) {
  try {
    const { text, bgImage, targetImage, speakerImage } = await request.json();

    // Construct the absolute path to the font file
    const fontPath = path.join(process.cwd(), 'public', 'font', 'GulimChe.ttf');
    const fontData = fs.readFileSync(fontPath); // Read font file synchronously

    return new ImageResponse(
      (
        <div style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#000',
          position: 'relative',
          fontFamily: 'GulimCheCustom',
        }}>
          {/* 배경 이미지 */}
          {bgImage && (
            <img
              src={bgImage}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}

          {/* 주인공 이미지 */}
          {targetImage && (
            <img
              src={targetImage}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                height: '90%',
                objectFit: 'contain',
              }}
            />
          )}

         {/* 하단 대화창 */}
          <div
            style={{
              position: 'absolute',
              bottom: '24px',
              left: '24px',
              right: '24px',
              height: '110px',
              backgroundColor: 'rgba(0, 0, 0, 0.66)',
              display: 'flex',
              alignItems: 'center',
              padding: '0 20px',
              borderRadius: '20px',
              border: '1px solid #fbbf24',
            }}
          >
            {/* ✅ 스피커 아바타: 위로 뚫고 나오게 (top: -40px) */}
            <div
              style={{
                position: 'absolute',
                top: '-40px',
                left: '20px',
                width: '100px',
                height: '100px',
                border: '2px solid #fbbf24',
                backgroundColor: '#27272a',
                borderRadius: '8px',
                overflow: 'hidden',
                display: 'flex',
                zIndex: 100,
              }}
            >
              {speakerImage && <img src={speakerImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
            </div>
            
            {/* ✅ 텍스트 영역: 왼쪽 마진을 이미지 크기만큼 확보 (marginLeft: '120px') */}
            <div
              style={{
                color: 'white',
                fontSize: '20px',
                fontWeight: 400,
                marginLeft: '120px', // 이미지 자리 비워두기
                fontFamily: 'GulimCheCustom',
                lineHeight: '1.5',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                maxHeight: '3em', // 2 lines * 1.5 line-height = 3em
              }}
            >
              {text}
            </div>
          </div>  
        </div>
      ),
      {
        width: 960, 
        height: 720,
        fonts: [
          {
            name: 'GulimCheCustom',
            data: fontData,
            style: 'normal',
          },
        ],
      }
    );
  } catch (e: any) {
    console.error(e.message);
    return new Response(`이미지 생성 실패: ${e.message}`, { status: 500 });
  }
}