// PhoneFrame.jsx — minimal realistic iPhone bezel for filming screens.
// Independent status-bar and home-indicator colors so colored headers and
// light footers can coexist on the same screen.
// Screen is a fixed 390 x 846 canvas — design content to fit (no scroll).

function StatusBar({ color = '#000', time = '7:38' }) {
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: 54, zIndex: 40,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 30px 0 34px', boxSizing: 'border-box', pointerEvents: 'none',
    }}>
      <span style={{
        fontFamily: '-apple-system, "SF Pro Text", system-ui',
        fontWeight: 600, fontSize: 17, letterSpacing: 0.2, color,
        paddingTop: 2,
      }}>{time}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        {/* cellular */}
        <svg width="19" height="12" viewBox="0 0 19 12">
          <rect x="0" y="7.5" width="3.2" height="4.5" rx="0.7" fill={color}/>
          <rect x="4.8" y="5" width="3.2" height="7" rx="0.7" fill={color}/>
          <rect x="9.6" y="2.5" width="3.2" height="9.5" rx="0.7" fill={color}/>
          <rect x="14.4" y="0" width="3.2" height="12" rx="0.7" fill={color}/>
        </svg>
        {/* wifi */}
        <svg width="17" height="12" viewBox="0 0 17 12">
          <path d="M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z" fill={color}/>
          <path d="M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z" fill={color}/>
          <circle cx="8.5" cy="10.5" r="1.5" fill={color}/>
        </svg>
        {/* battery */}
        <svg width="27" height="13" viewBox="0 0 27 13">
          <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke={color} strokeOpacity="0.4" fill="none"/>
          <rect x="2" y="2" width="20" height="9" rx="2" fill={color}/>
          <path d="M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z" fill={color} fillOpacity="0.4"/>
        </svg>
      </div>
    </div>
  );
}

function PhoneFrame({
  children,
  statusColor = '#000',
  homeColor = 'rgba(0,0,0,0.32)',
  time = '7:38',
  screenBg = '#ffffff',
}) {
  return (
    <div style={{
      width: 402, height: 858, borderRadius: 56, padding: 6, boxSizing: 'border-box',
      background: 'linear-gradient(155deg,#2a2a2e,#0a0a0c 60%)',
      boxShadow: '0 50px 90px -20px rgba(0,0,0,0.45), 0 0 0 1px rgba(0,0,0,0.5), inset 0 0 0 2px rgba(255,255,255,0.06)',
      position: 'relative',
    }}>
      <div style={{
        width: 390, height: 846, borderRadius: 50, overflow: 'hidden',
        position: 'relative', background: screenBg,
        fontFamily: '-apple-system, "SF Pro Text", Helvetica Neue, system-ui, sans-serif',
        WebkitFontSmoothing: 'antialiased',
      }}>
        {/* dynamic island */}
        <div style={{
          position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)',
          width: 112, height: 33, borderRadius: 20, background: '#000', zIndex: 50,
        }} />
        <StatusBar color={statusColor} time={time} />
        {/* screen content */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>
        {/* home indicator */}
        <div style={{
          position: 'absolute', bottom: 9, left: '50%', transform: 'translateX(-50%)',
          width: 134, height: 5, borderRadius: 100, background: homeColor, zIndex: 60,
          pointerEvents: 'none',
        }} />
      </div>
    </div>
  );
}

window.PhoneFrame = PhoneFrame;
