import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const TopNavBar = () => {
  const location = useLocation();
  const path = location.pathname;

  const isActive = (target) => {
    if (target === '/') {
      return path === '/';
    }
    return path.startsWith(target);
  };

  const linkClass = (target) => {
    return `font-bebas text-sm tracking-widest pb-1 transition-all duration-300 ${
      isActive(target)
        ? 'text-rose-gold border-b-2 border-rose-gold'
        : 'text-cream/60 hover:text-cream'
    }`;
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-16 py-4 bg-base/80 backdrop-blur-xl border-b border-rose-gold/10 shadow-[0_15px_30px_-15px_rgba(196,154,108,0.15)]">
      {/* Brand Title */}
      <Link 
        to="/" 
        className="font-cormorant text-2xl md:text-3xl text-rose-gold tracking-tighter uppercase font-semibold hover:opacity-80 transition-opacity"
      >
        6 CATALOGUE
      </Link>

      {/* Navigation Menu */}
      <nav className="hidden md:flex items-center gap-10">
        <Link to="/" className={linkClass('/')}>
          CATALOGUE
        </Link>
        <Link to="/timeline" className={linkClass('/timeline')}>
          TIMELINE
        </Link>
        <Link to="/credits" className={linkClass('/credits')}>
          CREDITS
        </Link>
      </nav>

      {/* Controls / OVO Owl Emblem Icon */}
      <div className="flex items-center gap-4 text-rose-gold">
        <Link 
          to="/timeline"
          title="View Timeline"
          className="hover:text-cream transition-colors active:scale-95 duration-200"
        >
          <span className="material-symbols-outlined text-xl">route</span>
        </Link>
        <div className="w-8 h-8 rounded-full border border-rose-gold/20 flex items-center justify-center bg-black/40">
          <span className="font-bebas text-[11px] text-rose-gold font-bold">6ix</span>
        </div>
      </div>
    </header>
  );
};
export default TopNavBar;
