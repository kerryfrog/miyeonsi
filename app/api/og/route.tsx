// app/api/og/route.tsx
import { ImageResponse } from '@vercel/og';

export const runtime = 'edge'; // Edge 런타임 권장

export async function POST(request: Request) {
  try {
    const { text, bgImage, targetImage, speakerImage } = await request.json();

    // 1. 폰트 로드: public/fonts/GulimChe.ttf 경로 확인 필수
    // baseUrl을 사용하여 경로 문제를 방지합니다.
    const fontData = await fetch(
      new URL('/fonts/GulimChe.ttf', request.url)
    ).then((res) => {
      if (!res.ok) throw new Error('폰트 파일을 찾을 수 없습니다. 경로를 확인하세요.');
      return res.arrayBuffer();
    });

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
              bottom: 0,
              left: 0,
              right: 0,
              height: '100px',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              padding: '0 20px',
              borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            {/* 스피커 아바타 */}
            <div
              style={{
                width: '70px',
                height: '70px',
                border: '2px solid #fbbf24',
                backgroundColor: '#27272a',
                overflow: 'hidden',
                display: 'flex',
                marginRight: '20px',
              }}
            >
              {speakerImage && <img src={speakerImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
            </div>
            
            {/* 대사 텍스트 */}
            <div style={{ 
              color: 'white', 
              fontSize: '24px', 
              flex: 1,
              fontFamily: 'GulimCheCustom',
            }}>
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