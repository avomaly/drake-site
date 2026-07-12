import React, { useState, useEffect } from 'react';

export const Footer = () => {
  const [daysSincePusha, setDaysSincePusha] = useState(0);

  useEffect(() => {
    // Release of 'The Story of Adidon': May 25, 2018
    const startDate = new Date('2018-05-25');
    const currentDate = new Date();
    const timeDiff = currentDate.getTime() - startDate.getTime();
    const days = Math.floor(timeDiff / (1000 * 3600 * 24));
    setDaysSincePusha(days);
  }, []);

  return (
    <footer className="w-full bg-[#0D0608] border-t border-rose-gold/10 py-12 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6 text-cream/60 text-xs font-inter relative z-20">
      
      {/* Left side: pusha T counter & beef record */}
      <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
        <span className="font-bebas text-rose-gold tracking-widest text-xs">PUSHA T CLOCK</span>
        <p className="font-inter">
          Days since Pusha T last mentioned Drake: <span className="text-cream font-bold">{daysSincePusha}</span>
        </p>
        <span className="font-bebas text-rose-gold tracking-widest text-xs mt-1.5">
          W/L RECORD: 847W — 2L (we don't count Kendrick)
        </span>
      </div>

      {/* Center: logo tribute */}
      <div className="text-center">
        <div className="font-bebas text-sm text-rose-gold tracking-[0.3em]">6 CATALOGUE</div>
        <p className="text-[10px] uppercase opacity-50 tracking-widest mt-1">From Toronto, with Love</p>
      </div>

      {/* Right side: Copyright & Hidden Wheelchair Jimmy Tooltip */}
      <div className="flex items-center gap-1.5 relative group cursor-help text-center md:text-right">
        <span>© {new Date().getFullYear()} OVO Sound.</span>
        
        {/* Hidden J with tooltip */}
        <span className="text-rose-gold hover:text-cream transition-colors duration-300 font-serif font-bold text-sm">
          J
        </span>
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-1/2 translate-x-1/2 mb-2 w-56 p-2 bg-[#1A0810] border border-rose-gold/40 text-cream text-[10px] leading-relaxed text-center shadow-xl opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 z-50">
          Before he was Drake... he was Jimmy Brooks 🎭
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1A0810]" />
        </div>
      </div>

    </footer>
  );
};
export default Footer;
