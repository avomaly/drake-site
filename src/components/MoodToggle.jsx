import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export const MoodToggle = () => {
  const { mood, setMood, getAudioContext } = useContext(AppContext);

  const toggleMood = () => {
    // Resume context on user click to comply with autoplay policy
    try {
      getAudioContext();
    } catch(e) {}

    setMood(prev => prev === 'HAPPY' ? 'CRYING' : 'HAPPY');
  };

  return (
    <button
      onClick={toggleMood}
      className={`fixed top-4 right-4 z-[90] flex items-center gap-3 px-4 py-2 border rounded-full transition-all duration-500 hover:scale-105 active:scale-95 shadow-lg backdrop-blur-md ${
        mood === 'HAPPY'
          ? 'bg-wine/40 border-rose-gold/30 text-rose-gold shadow-[0_0_15px_rgba(196,154,108,0.2)]'
          : 'bg-[#080d1a]/50 border-sky-400/30 text-sky-300 shadow-[0_0_15px_rgba(79,195,247,0.2)]'
      }`}
    >
      {/* Dynamic Drake Face Vectors */}
      <div className="w-8 h-8 rounded-full overflow-hidden relative flex-shrink-0 bg-base border border-rose-gold/20 flex items-center justify-center">
        {mood === 'HAPPY' ? (
          // Happy Drake SVG Vector
          <svg className="w-6 h-6 text-rose-gold" viewBox="0 0 24 24" fill="currentColor">
            {/* Styled Hairline & Beard */}
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-3-9c.83 0 1.5-.67 1.5-1.5S9.83 6 9 6s-1.5.67-1.5 1.5S8.17 11 9 11zm6 0c.83 0 1.5-.67 1.5-1.5S15.83 6 15 6s-1.5.67-1.5 1.5S14.17 11 15 11zm-6 4c1.5 2 4.5 2 6 0" />
            <circle cx="9" cy="9.5" r="1.5" />
            <circle cx="15" cy="9.5" r="1.5" />
            {/* Smile */}
            <path d="M8 14.5c2 2 6 2 8 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          </svg>
        ) : (
          // Crying Drake SVG Vector
          <svg className="w-6 h-6 text-sky-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            {/* Sad Eyes */}
            <path d="M8 9.5c0-.5.5-1 1-1s1 .5 1 1" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M14 9.5c0-.5.5-1 1-1s1 .5 1 1" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            {/* Tears */}
            <path d="M9 11v2M15 11v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="9" cy="13" r="1" className="fill-sky-300" />
            <circle cx="15" cy="13" r="1" className="fill-sky-300" />
            {/* Frown */}
            <path d="M9 16c1.5-1.5 4.5-1.5 6 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          </svg>
        )}
      </div>

      <div className="flex flex-col text-left">
        <span className="font-bebas text-xs tracking-wider">DRAKE MOOD</span>
        <span className="font-inter text-[9px] opacity-75 uppercase">
          {mood === 'HAPPY' ? '😊 HAPPY DRIZZY' : '😢 CRYING DRIZZY'}
        </span>
      </div>
    </button>
  );
};
export default MoodToggle;
