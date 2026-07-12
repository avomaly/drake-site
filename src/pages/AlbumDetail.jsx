import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { albums } from '../data/albums';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Volume2, ShieldAlert } from 'lucide-react';

export const AlbumDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [album, setAlbum] = useState(null);
  const [activeTrack, setActiveTrack] = useState(0);
  const { albumCovers, coversLoading } = useContext(AppContext);

  useEffect(() => {
    const found = albums.find(a => a.slug === slug);
    if (found) {
      setAlbum(found);
      setActiveTrack(0);
    }
  }, [slug]);

  if (!album) {
    return (
      <div className="min-h-screen bg-base flex flex-col items-center justify-center p-6 text-center">
        <ShieldAlert size={48} className="text-rose-gold mb-4 animate-bounce" />
        <h2 className="font-bebas text-2xl text-rose-gold tracking-widest mb-2">ALBUM NOT FOUND</h2>
        <button 
          onClick={() => navigate('/')}
          className="px-6 py-2 border border-rose-gold text-rose-gold font-bebas text-xs tracking-widest hover:bg-rose-gold hover:text-base transition-colors"
        >
          RETURN TO CATALOGUE
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-base text-cream">
      
      {/* Era-Specific Breathing Overlay Wrapper */}
      <div 
        style={{ '--breathe-color': album.eraColor }}
        className="fixed inset-0 z-0 animate-breathe opacity-50"
      />

      {/* Large Background Year Watermark */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 opacity-[0.03] select-none">
        <span className="font-bebas text-[45vw] text-rose-gold leading-none">
          {album.year}
        </span>
      </div>

      {/* Main Container */}
      <main className="relative z-10 pt-28 pb-20 px-6 md:px-16 max-w-[1440px] mx-auto">
        
        {/* Back Link & Playing Indicator */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12 border-b border-rose-gold/10 pb-4">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-rose-gold hover:text-cream transition-colors font-bebas text-xs tracking-widest"
          >
            <ArrowLeft size={14} /> BACK TO ARCHIVE
          </button>
          <div className="flex items-center gap-2 font-bebas text-rose-gold text-xs tracking-[0.2em] bg-rose-gold/10 px-3 py-1 border border-rose-gold/25 animate-pulse select-none">
            <span>🎵 PLAYING: {album.title.toUpperCase()}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* LEFT COLUMN: Cover Art & Player */}
          <div className="lg:col-span-5 flex flex-col items-center lg:sticky lg:top-28">
            <div className="relative group w-full max-w-[420px]">
              <div 
                className="absolute -inset-4 blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-700 rounded-full"
                style={{ backgroundColor: album.accentColor }}
              />
              <div className="relative w-full aspect-square border border-rose-gold/20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden">
                {coversLoading || !albumCovers[album.slug] ? (
                  <div className="w-full h-full bg-white/5 border border-white/10 animate-pulse flex items-center justify-center">
                    <span className="text-sm font-bebas text-rose-gold/60 tracking-wider">LOADING COVER...</span>
                  </div>
                ) : (
                  <img 
                    src={albumCovers[album.slug]} 
                    alt={album.title}
                    className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                  />
                )}
              </div>
            </div>

            {/* YouTube Embed Player */}
            <div className="mt-8 w-full max-w-[420px] glass-panel p-2 rounded-none shadow-2xl border border-rose-gold/20 flex flex-col gap-3">
              <div className="relative w-full aspect-video overflow-hidden border border-white/5 bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${album.youtubeId}?autoplay=1&mute=1&controls=1&enablejsapi=1`}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allowFullScreen=""
                  allow="autoplay; encrypted-media; picture-in-picture"
                  loading="lazy"
                  title={`${album.title} YouTube Player`}
                  className="absolute inset-0 w-full h-full"
                ></iframe>
              </div>
              <a
                href={`https://www.youtube.com/watch?v=${album.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 bg-red-700 hover:bg-red-600 text-white font-bebas text-center text-xs tracking-widest transition-colors flex items-center justify-center gap-2 rounded-none"
              >
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.516 0-9.387.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.387.508 9.387.508s7.517 0 9.387-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                WATCH ON YOUTUBE
              </a>
            </div>
          </div>

          {/* RIGHT COLUMN: Album Details & DNA */}
          <div className="lg:col-span-7 space-y-12 text-left">
            <div>
              <span 
                style={{ color: album.accentColor, borderColor: album.accentColor }}
                className="font-bebas text-xs tracking-[0.2em] border px-2.5 py-0.5 inline-block mb-4"
              >
                ERA: {album.year}
              </span>
              <h1 className="font-cormorant italic text-[60px] md:text-[90px] leading-none text-rose-gold mb-6 font-bold">
                {album.title}
              </h1>
              <p className="font-inter text-cream/80 text-base md:text-lg leading-relaxed max-w-2xl font-light">
                {album.description}
              </p>
            </div>

            {/* Tracklist Preview */}
            <div className="space-y-6">
              <h3 className="font-bebas text-xs tracking-[0.25em] text-rose-gold border-b border-rose-gold/20 pb-1.5 inline-block">
                TRACKLIST
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                {album.tracklist.map((track, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveTrack(idx)}
                    className={`flex justify-between items-center py-2 px-3 border-b cursor-pointer transition-all ${
                      activeTrack === idx
                        ? 'border-rose-gold bg-wine/25 text-rose-gold border-l-2 pl-3 font-semibold'
                        : 'border-white/5 text-cream/60 hover:bg-white/5'
                    }`}
                  >
                    <span className="font-inter text-sm truncate pr-2">
                      {(idx + 1).toString().padStart(2, '0')} {track}
                    </span>
                    <span className="font-inter text-[10px] opacity-40">3:42</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Album DNA Stats */}
            <div className="space-y-6 pt-6 border-t border-rose-gold/15">
              <h3 className="font-bebas text-xs tracking-[0.25em] text-rose-gold">
                ALBUM DNA
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                
                {/* Emotion */}
                <div className="space-y-1">
                  <div className="flex justify-between font-inter text-[10px] text-cream/60 uppercase tracking-wider">
                    <span>EMOTIONAL DEPTH</span>
                    <span>{album.dna.emotion}%</span>
                  </div>
                  <div className="h-1 bg-white/5 w-full">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${album.dna.emotion}%` }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                      className="h-full bg-rose-gold shadow-[0_0_10px_rgba(196,154,108,0.5)]"
                    />
                  </div>
                </div>

                {/* Production */}
                <div className="space-y-1">
                  <div className="flex justify-between font-inter text-[10px] text-cream/60 uppercase tracking-wider">
                    <span>PRODUCTION EXPERTISE</span>
                    <span>{album.dna.production}%</span>
                  </div>
                  <div className="h-1 bg-white/5 w-full">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${album.dna.production}%` }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                      className="h-full bg-rose-gold shadow-[0_0_10px_rgba(196,154,108,0.5)]"
                    />
                  </div>
                </div>

                {/* Lyricism */}
                <div className="space-y-1">
                  <div className="flex justify-between font-inter text-[10px] text-cream/60 uppercase tracking-wider">
                    <span>LYRICAL VALUE</span>
                    <span>{album.dna.lyricism}%</span>
                  </div>
                  <div className="h-1 bg-white/5 w-full">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${album.dna.lyricism}%` }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                      className="h-full bg-rose-gold shadow-[0_0_10px_rgba(196,154,108,0.5)]"
                    />
                  </div>
                </div>

                {/* Commercial */}
                <div className="space-y-1">
                  <div className="flex justify-between font-inter text-[10px] text-cream/60 uppercase tracking-wider">
                    <span>COMMERCIAL STREAMS</span>
                    <span>{album.dna.commercial}%</span>
                  </div>
                  <div className="h-1 bg-white/5 w-full">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${album.dna.commercial}%` }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                      className="h-full bg-rose-gold shadow-[0_0_10px_rgba(196,154,108,0.5)]"
                    />
                  </div>
                </div>

                {/* Toronto Energy */}
                <div className="space-y-1 md:col-span-2">
                  <div className="flex justify-between font-inter text-[10px] text-cream/60 uppercase tracking-wider">
                    <span>TORONTO / 6IX ENERGY</span>
                    <span>{album.dna.toronto}%</span>
                  </div>
                  <div className="h-1 bg-white/5 w-full">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${album.dna.toronto}%` }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                      className="h-full bg-rose-gold shadow-[0_0_10px_rgba(196,154,108,0.5)]"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-8">
              <button className="px-10 py-4 font-bebas text-xs tracking-widest bg-rose-gold text-base hover:bg-cream transition-colors rounded-none shadow-lg active:scale-95">
                STREAM NOW
              </button>
              <button 
                onClick={() => navigate('/')}
                className="px-10 py-4 font-bebas text-xs tracking-widest bg-transparent border border-white/10 hover:border-rose-gold/40 text-cream hover:text-rose-gold transition-all rounded-none active:scale-95"
              >
                CLOSE ERA
              </button>
            </div>

          </div>

        </div>
      </main>

    </div>
  );
};
export default AlbumDetail;
