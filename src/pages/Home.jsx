import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { albums } from '../data/albums';
import { Calendar, CloudSun } from 'lucide-react';

// Isolated AlbumCard sub-component for independent hover states & countup animation
const AlbumCard = ({ album, idx, coverUrl, coversLoading }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [streamDisplay, setStreamDisplay] = useState(0);

  useEffect(() => {
    if (isHovered) {
      const duration = 1500; // 1.5 seconds
      const startTime = performance.now();
      const target = album.streams || 0;

      let animFrame;
      const animate = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        setStreamDisplay(progress * target);
        if (progress < 1) {
          animFrame = requestAnimationFrame(animate);
        }
      };
      animFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animFrame);
    } else {
      setStreamDisplay(0);
    }
  }, [isHovered, album.streams]);

  return (
    <div 
      onClick={() => navigate(`/album/${album.slug}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="card-container h-[460px] group relative cursor-pointer"
    >
      <div className="card-inner relative w-full h-full">
        
        {/* Front Face */}
        <div 
          style={{ backgroundColor: album.eraColor }}
          className="card-front absolute inset-0 w-full h-full border border-rose-gold/20 p-6 flex flex-col justify-between overflow-hidden shadow-2xl rose-gold-glow-hover transition-all duration-300"
        >
          {/* Header */}
          <div className="flex justify-between items-start">
            <span 
              style={{ color: album.accentColor }}
              className="text-4xl font-serif leading-none"
            >
              {album.suit}
            </span>
            <span className="font-bebas text-[11px] text-cream/40 tracking-wider">
              VOL. {(idx + 1).toString().padStart(2, '0')}
            </span>
          </div>

          {/* Cover Art */}
          <div className="flex-grow flex items-center justify-center relative my-4 w-full h-[180px]">
            <div 
              className="absolute inset-0 blur-3xl opacity-20 rounded-full"
              style={{ backgroundColor: album.accentColor }}
            />
            {coversLoading || !coverUrl ? (
              <div className="z-10 w-[70%] aspect-square bg-white/5 border border-white/10 animate-pulse flex items-center justify-center">
                <span className="text-[10px] font-bebas text-rose-gold/60 tracking-wider">LOADING...</span>
              </div>
            ) : (
              <img 
                src={coverUrl}
                alt={album.title}
                className="z-10 w-[70%] aspect-square object-cover shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-700 border border-white/10"
              />
            )}
          </div>

          {/* Info Block with Hover Stream Count */}
          <div className="text-center mt-auto flex flex-col items-center justify-center h-16">
            {isHovered ? (
              <div className="font-bebas text-rose-gold text-lg tracking-widest animate-pulse">
                {streamDisplay.toFixed(1)}B STREAMS
              </div>
            ) : (
              <>
                <h3 className="font-cormorant italic text-2xl text-cream group-hover:text-rose-gold transition-colors font-medium">
                  {album.title}
                </h3>
                <p className="font-bebas text-[10px] text-cream/40 mt-1 tracking-[0.2em]">
                  {album.year}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Back Face (Tracklist) */}
        <div 
          className="card-back absolute inset-0 w-full h-full bg-[#140c0e] border-2 border-rose-gold/60 p-6 flex flex-col justify-between overflow-hidden shadow-2xl"
        >
          <div className="border-b border-rose-gold/20 pb-2 mb-3">
            <span className="font-bebas text-rose-gold text-[11px] tracking-widest block">TRACKLIST PREVIEW</span>
            <h4 className="font-cormorant italic text-lg text-cream font-bold truncate">{album.title}</h4>
          </div>

          <div className="flex-grow overflow-y-auto space-y-1.5 pr-1 text-left">
            {album.tracklist.slice(0, 8).map((track, tIdx) => (
              <div 
                key={tIdx}
                className="flex items-center justify-between border-b border-white/5 py-1 text-cream/70 hover:text-cream transition-colors"
              >
                <span className="font-inter text-xs truncate max-w-[160px] pr-2">
                  {(tIdx + 1).toString().padStart(2, '0')} {track}
                </span>
                <span className="font-bebas text-[8px] tracking-wider text-rose-gold/50">TRACK</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-2 border-t border-rose-gold/25 text-center flex justify-between items-center">
            <span className="font-bebas text-[9px] text-rose-gold tracking-widest">
              {album.streams}B TOTAL STREAMS
            </span>
            <span className="font-bebas text-[10px] text-cream bg-rose-gold/20 px-2 py-0.5 hover:bg-rose-gold hover:text-base transition-all">
              EXAMINE
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export const Home = () => {
  const { simpingCount, mood, albumCovers, coversLoading, activeEra, setActiveEra } = useContext(AppContext);
  const heroRef = useRef(null);
  
  // Parallax / rotate effect state for Hero Text
  const [rotatePos, setRotatePos] = useState({ rx: 0, ry: 0 });

  // Stream Simping Timer state
  const [timeSpent, setTimeSpent] = useState({ min: 0, sec: 0 });

  // Weather state
  const [weather, setWeather] = useState({ temp: '--', cond: 'Loading weather...' });

  const handleMouseMove = (e) => {
    const { clientWidth: width, clientHeight: height } = window;
    const { clientX: x, clientY: y } = e;
    const rx = (height / 2 - y) / 40;
    const ry = (width / 2 - x) / 40;
    setRotatePos({ rx, ry });
  };

  // Simping Timer effect
  useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      const min = Math.floor(elapsed / 60);
      const sec = elapsed % 60;
      setTimeSpent({ min, sec });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Toronto Weather effect (Open-Meteo API)
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=43.65&longitude=-79.38&current_weather=true');
        const data = await res.json();
        if (data.current_weather) {
          const temp = Math.round(data.current_weather.temperature);
          const code = data.current_weather.weathercode;
          let cond = "Clear ☀️";
          if (code >= 1 && code <= 3) cond = "Partly Cloudy ⛅";
          else if (code === 45 || code === 48) cond = "Foggy 🌫️";
          else if (code >= 51 && code <= 55) cond = "Drizzle 🌧️";
          else if (code >= 61 && code <= 65) cond = "Rainy 🌧️";
          else if (code >= 71 && code <= 75) cond = "Snowy ❄️";
          else if (code >= 95) cond = "Stormy ⛈️";
          setWeather({ temp, cond });
        }
      } catch (e) {
        setWeather({ temp: '18', cond: 'Clear ☀️' }); // fallback
      }
    };
    fetchWeather();
    const weatherTimer = setInterval(fetchWeather, 600000); // 10 minutes
    return () => clearInterval(weatherTimer);
  }, []);

  // Filter albums by Era selection
  const filteredAlbums = albums.filter(album => {
    if (activeEra === 'EARLY') return album.year >= 2010 && album.year <= 2013;
    if (activeEra === 'OVOXO') return album.year >= 2015 && album.year <= 2016;
    if (activeEra === 'MORE_LIFE') return album.year >= 2017 && album.year <= 2020;
    if (activeEra === 'CLB') return album.year >= 2021 && album.year <= 2023;
    if (activeEra === 'ERA_2026') return album.year >= 2025;
    return true;
  });

  const eras = [
    { id: 'EARLY', name: 'EARLY DRAKE (2010-2013)' },
    { id: 'OVOXO', name: 'OVOXO ERA (2015-2016)' },
    { id: 'MORE_LIFE', name: 'MORE LIFE ERA (2017-2018)' },
    { id: 'CLB', name: 'CLB ERA (2021-2022)' },
    { id: 'ERA_2026', name: '2026 ERA' }
  ];

  return (
    <div className="min-h-screen" onMouseMove={handleMouseMove}>
      
      {/* 1. HERO CANVAS */}
      <section 
        ref={heroRef}
        className="relative h-screen w-full flex items-center justify-center overflow-hidden"
      >
        {/* Penthouse Toronto Skyline Backdrop */}
        <div className="absolute inset-0 z-0">
          <div 
            className="w-full h-full bg-cover bg-bottom opacity-20 filter grayscale"
            style={{ 
              backgroundImage: `url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1800&auto=format&fit=crop')` 
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0D0608]" />
        </div>

        {/* Faint Golden OVO Owl Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none z-10 scale-150">
          <svg className="w-[600px] h-[600px] text-rose-gold" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
          </svg>
        </div>

        {/* Raindrops overlay for Crying Mode */}
        {mood === 'CRYING' && (
          <div className="absolute inset-0 z-15 pointer-events-none overflow-hidden">
            {Array.from({ length: 80 }).map((_, i) => (
              <div
                key={i}
                className="rain-drop"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 4}s`,
                  animationDuration: `${0.8 + Math.random() * 0.8}s`,
                  top: '-60px'
                }}
              />
            ))}
          </div>
        )}

        {/* Center Title Content */}
        <div className="relative z-20 text-center px-4">
          <h1 
            style={{ 
              transform: `rotateY(${rotatePos.ry}deg) rotateX(${rotatePos.rx}deg)`,
              transition: 'transform 0.1s ease-out'
            }}
            className="font-cormorant text-[90px] md:text-[200px] text-rose-gold italic tracking-tighter leading-none drop-shadow-[0_0_30px_rgba(196,154,108,0.4)] select-none uppercase font-bold"
          >
            DRAKE
          </h1>
          <p className="font-bebas text-cream/80 text-xl md:text-2xl mt-4 opacity-90 tracking-[0.3em]">
            From the 6 with Love
          </p>
          
          {/* Views Counter */}
          <div className="mt-8 flex flex-col items-center">
            <span className="font-bebas text-4xl md:text-6xl text-rose-gold drop-shadow-[0_0_20px_rgba(196,154,108,0.6)] tracking-widest">
              {simpingCount.toLocaleString()}
            </span>
            <span className="font-inter text-[10px] text-cream/50 tracking-[0.25em] uppercase mt-1">
              PEOPLE CURRENTLY SIMPING WORLDWIDE
            </span>
          </div>

          {/* Simp Timer */}
          <div className="mt-4 font-bebas text-xs md:text-sm text-cream/70 tracking-widest uppercase">
            YOU HAVE BEEN SIMPING FOR <span className="text-rose-gold font-bold ml-1">{timeSpent.min}m {timeSpent.sec}s</span>
          </div>

          {/* Toronto Weather Widget */}
          <div className="mt-6 flex items-center justify-center gap-1.5 font-bebas text-xs tracking-[0.25em] text-rose-gold border border-rose-gold/20 px-3 py-1 bg-black/40">
            <CloudSun size={12} className="text-rose-gold animate-pulse" />
            <span>📍 TORONTO RIGHT NOW: {weather.temp}°C {weather.cond}</span>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 text-center animate-bounce">
          <span className="font-bebas text-[10px] text-rose-gold/60 tracking-widest block mb-1">SCROLL CATALOGUE</span>
          <div className="w-1.5 h-6 bg-rose-gold/40 mx-auto rounded-full relative">
            <div className="w-1.5 h-2 bg-rose-gold rounded-full absolute top-1" />
          </div>
        </div>
      </section>

      {/* 2. DISCOGRAPHY GRID SECTION */}
      <section className="py-24 px-6 md:px-16 max-w-[1440px] mx-auto relative z-20">
        
        {/* Section Header */}
        <div className="mb-12 text-center md:text-left">
          <h2 className="font-bebas text-[60px] md:text-[100px] leading-none text-rose-gold opacity-90 tracking-widest">
            THE ARCHIVE
          </h2>
          <p className="font-cormorant italic text-cream/60 text-lg md:text-xl -mt-1">
            Seventeen volumes of vulnerable late-night chronicles.
          </p>
          <div className="h-[1px] w-full bg-gradient-to-r from-rose-gold/40 to-transparent mt-4"></div>
        </div>

        {/* Drake Era Filter Selector Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-16 border-y border-rose-gold/15 py-4">
          {eras.map(era => (
            <button
              key={era.id}
              onClick={() => setActiveEra(era.id)}
              className={`px-5 py-2 font-bebas text-xs md:text-sm tracking-widest transition-all rounded-none duration-300 ${
                activeEra === era.id
                  ? 'bg-rose-gold text-[#0D0608] border border-rose-gold font-bold'
                  : 'bg-transparent border border-rose-gold/30 text-rose-gold hover:text-cream hover:border-rose-gold'
              }`}
            >
              {era.name}
            </button>
          ))}
        </div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredAlbums.map((album, idx) => (
            <AlbumCard 
              key={album.slug}
              album={album}
              idx={idx}
              coverUrl={albumCovers[album.slug]}
              coversLoading={coversLoading}
            />
          ))}
        </div>
      </section>

    </div>
  );
};
export default Home;
