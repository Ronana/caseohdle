import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt     = 'CaseOhdle — Daily CaseOh stream game guessing game';
export const size    = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width:           '100%',
          height:          '100%',
          display:         'flex',
          flexDirection:   'column',
          alignItems:      'center',
          justifyContent:  'center',
          backgroundColor: '#0b0d14',
          fontFamily:      'system-ui, sans-serif',
          position:        'relative',
          overflow:        'hidden',
        }}
      >
        {/* Background waffle scatter — decorative */}
        {(['10%,8%','85%,12%','5%,78%','90%,72%','50%,5%','20%,92%','75%,88%'] as const).map((pos, i) => {
          const [left, top] = pos.split(',');
          return (
            <div
              key={i}
              style={{
                position:   'absolute',
                left,
                top,
                fontSize:   i % 2 === 0 ? '72px' : '56px',
                opacity:    0.08,
                transform:  `rotate(${i * 23 - 30}deg)`,
              }}
            >
              🧇
            </div>
          );
        })}

        {/* Card */}
        <div
          style={{
            display:         'flex',
            flexDirection:   'column',
            alignItems:      'center',
            justifyContent:  'center',
            backgroundColor: '#141720',
            border:          '1px solid #252b3b',
            borderRadius:    '24px',
            padding:         '64px 80px',
            gap:             '24px',
            maxWidth:        '860px',
            width:           '100%',
          }}
        >
          {/* Waffle emoji header */}
          <div style={{ fontSize: '64px', lineHeight: 1 }}>🧇</div>

          {/* Title */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0px' }}>
            <span
              style={{
                fontSize:   '96px',
                fontWeight: 900,
                color:      '#ffffff',
                lineHeight: 1,
                letterSpacing: '-2px',
              }}
            >
              Case
            </span>
            <span
              style={{
                fontSize:   '96px',
                fontWeight: 900,
                color:      '#6366f1',
                lineHeight: 1,
                letterSpacing: '-2px',
              }}
            >
              Ohdle
            </span>
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize:    '28px',
              color:       '#94a3b8',
              textAlign:   'center',
              lineHeight:  1.4,
              maxWidth:    '600px',
            }}
          >
            Guess the CaseOh stream game of the day
          </div>

          {/* Divider */}
          <div
            style={{
              width:           '120px',
              height:          '3px',
              backgroundColor: '#6366f1',
              borderRadius:    '9999px',
              opacity:         0.6,
            }}
          />

          {/* URL */}
          <div
            style={{
              fontSize:  '22px',
              color:     '#475569',
              letterSpacing: '1px',
            }}
          >
            caseohdle.vercel.app
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
