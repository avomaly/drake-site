import React, { useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { albums } from '../data/albums';
import { Calendar, ChevronRight } from 'lucide-react';

export const Timeline = () => {
  const navigate = useNavigate();
  const timelineWrapperRef = useRef(null);
  const { albumCovers, coversLoading } = useContext(AppContext);

  // Sorting albums by year to make sure they are chronological
  const chronologicalAlbums = [...albums].sort((a, b) => a.year - b.year);

  // Mouse Dragging horizontal scroll logic
  useEffect(() => {
    const slider = timelineWrapperRef.current;
    if (!slider) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    const handleMouseDown = (e) => {
      isDown = true;
      slider.classList.add('active');
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
      slider.classList.remove('active');
    };

    const handleMouseUp = () => {
      isDown = false;
      slider.classList.remove('active');
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2; // scroll speed multiplier
      slider.scrollLeft = scrollLeft - walk;
    };

    const handleWheel = (e) => {
      e.preventDefault();
      slider.scrollLeft += e.deltaY;
    };

    slider.addEventListener('mousedown', handleMouseDown);
    slider.addEventListener('mouseleave', handleMouseLeave);
    slider.addEventListener('mouseup', handleMouseUp);
    slider.addEventListener('mousemove', handleMouseMove);
    slider.addEventListener('wheel', handleWheel, { passive: false });

    // Initial center offset scroll
    slider.scrollLeft = 50;

    return () => {
      slider.removeEventListener('mousedown', handleMouseDown);
      slider.removeEventListener('mouseleave', handleMouseLeave);
      slider.removeEventListener('mouseup', handleMouseUp);
      slider.removeEventListener('mousemove', handleMouseMove);
      slider.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-base relative overflow-hidden pt-28 pb-16 flex flex-col justify-between">
      
      {/* 1. Background elements */}
      <div className="fixed bottom-0 right-0 w-full h-[600px] opacity-10 pointer-events-none z-0">
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdfIhleF2f6I12ersyiKqLZINUp9vleB2bidJf09TquJtrYuRBJaFFRAvOdQIKhmDaeaV-VOvQ7_liXDUFuVX36d34Bc62zPHG2nT6-QDQpOrDXSN8PqasCoyq10BIek4AvlRR5bwbJNNdvVHOQJ9TRQaqQs10UEgEVC5NEOKJkBWrppCota26FooeYwlxnjAaRRy0W-h_aaNsrqI3R9H6KkMQBbMDVIh0Q1APbtf-DW6WupgdhzsQ" 
          alt="Toronto Skyline" 
          className="w-full h-full object-cover object-bottom"
        />
        {/* Gradient mask */}
        <div className="absolute inset-0 bg-gradient-to-t from-base via-transparent to-transparent" />
      </div>

      {/* 2. Page Header */}
      <header className="relative z-10 px-6 md:px-16 max-w-[1440px] w-full mx-auto text-left">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-bebas text-[60px] md:text-[100px] leading-none text-rose-gold tracking-widest uppercase">
              THE CHRONICLE
            </h1>
            <p className="font-cormorant italic text-cream/60 text-lg md:text-xl -mt-1">
              A decade of sound, from the cold winters of the 6ix to the global stage.
            </p>
          </div>
          {/* Logo badge */}
          <div className="hidden md:flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-rose-gold/30 p-1.5 bg-black/40">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTgfwo1bMNnT82ba9jHm4CG59fgdJ3l3fDQFLvBPAV6JKzp9t6EdUqGkrD4olbgJpi8dNA54gl9594u2kOcg7idOBmvEtIbZh4yeTeAfeXr-gfLOPhkyGVDmbvli69ptgxKEmfxEdSKdBXVk7E338tN2hB0_I23d1xy18yZb4WsXJ5MgTqoZ_puESoguA6LChvZR23dnGLWX8QPPggpqePxwKgQUUWQOvIpF--ZHybJ6g1RWxucy6H" 
                alt="OVO Owl" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-left font-bebas text-[11px] tracking-wider text-rose-gold/60">
              <div>OVO SOUND</div>
              <div>HISTORICAL SYSTEM</div>
            </div>
          </div>
        </div>
        <div className="h-[1px] w-full bg-gradient-to-r from-rose-gold/40 to-transparent mt-4"></div>
      </header>

      {/* 3. Horizontal Timeline Swiper */}
      <div 
        ref={timelineWrapperRef}
        className="relative z-10 overflow-x-auto select-none timeline-scroll-container py-12 cursor-grab active:cursor-grabbing w-full mt-8"
      >
        {/* Continuous timeline line */}
        <div 
          className="flex items-center relative h-[380px] px-16"
          style={{ width: `${chronologicalAlbums.length * 300 + 400}px` }}
        >
          {/* Axis line */}
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-rose-gold/30 z-0" />

          {/* Album nodes */}
          {chronologicalAlbums.map((album, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div 
                key={album.slug} 
                className="relative flex flex-col items-center flex-shrink-0"
                style={{ width: '300px' }}
              >
                {/* Year Marker */}
                <div className={`font-bebas text-sm text-rose-gold/40 mb-3`}>
                  {album.year}
                </div>

                {/* Node dot */}
                <button
                  onClick={() => navigate(`/album/${album.slug}`)}
                  style={{ backgroundColor: album.accentColor }}
                  className="w-4.5 h-4.5 rounded-full z-10 transition-transform duration-300 hover:scale-150 relative border-4 border-base outline-none shadow-[0_0_12px_rgba(196,154,108,0.5)]"
                />

                {/* Detail Box (Alternates top/bottom) */}
                <div 
                  className={`absolute w-64 text-center ${
                    isEven ? 'bottom-16' : 'top-16'
                  } p-4 glass-panel border border-rose-gold/15 flex flex-col items-center hover:border-rose-gold/40 transition-colors cursor-pointer group`}
                  onClick={() => navigate(`/album/${album.slug}`)}
                >
                  <div className="w-16 h-16 border border-rose-gold/10 p-1 mb-3 bg-black/40 overflow-hidden">
                    {coversLoading || !albumCovers[album.slug] ? (
                      <div className="w-full h-full bg-white/5 animate-pulse flex items-center justify-center">
                        <span className="text-[7px] font-bebas text-rose-gold/40">...</span>
                      </div>
                    ) : (
                      <img 
                        src={albumCovers[album.slug]} 
                        alt={album.title} 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                    )}
                  </div>
                  <h3 className="font-cormorant italic text-lg text-cream group-hover:text-rose-gold transition-colors font-semibold truncate w-full">
                    {album.title}
                  </h3>
                  <span className="font-bebas text-[8px] text-cream/40 tracking-[0.2em] mt-1 flex items-center gap-1">
                    <Calendar size={8} /> {album.year} · ERA {album.suit}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Ending Node */}
          <div className="relative flex flex-col items-center flex-shrink-0" style={{ width: '200px' }}>
            <div className="font-bebas text-sm text-rose-gold/20 mb-3">2026+</div>
            <div className="w-3.5 h-3.5 rounded-full z-10 border border-rose-gold/40 bg-base" />
            <div className="absolute top-16 text-center w-48 italic opacity-40">
              <h3 className="font-cormorant text-md text-cream">To Be Continued...</h3>
              <p className="font-inter text-[9px] mt-1 tracking-wider uppercase">Future Chronicles</p>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Footnote Quote */}
      <section className="relative z-10 px-6 md:px-16 max-w-[1440px] w-full mx-auto text-left mt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-t border-rose-gold/10 pt-8">
          <div className="max-w-xl">
            <blockquote className="font-cormorant italic text-xl text-cream/70">
              "We made it from the bottom to the penthouse view. Every lyric is a bookmark in the story."
            </blockquote>
          </div>
          <div className="flex items-center gap-2 text-rose-gold font-bebas text-xs tracking-widest">
            DRAG TIMELINE OR SCROLL MOUSE WHEEL <ChevronRight size={14} className="animate-ping" />
          </div>
        </div>
      </section>

    </div>
  );
};
export default Timeline;
