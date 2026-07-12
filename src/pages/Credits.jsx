import React from 'react';
import { Heart, Globe, Terminal, Code2, Paintbrush } from 'lucide-react';

export const Credits = () => {
  return (
    <div className="min-h-screen bg-base relative overflow-hidden pt-28 pb-16">
      
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-wine/20 blur-[150px] rounded-full pointer-events-none z-0" />
      
      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-16 text-left">
        
        {/* Page Header */}
        <header className="mb-16">
          <h1 className="font-bebas text-[60px] md:text-[100px] leading-none text-rose-gold tracking-widest uppercase">
            THE ARCHITECTS
          </h1>
          <p className="font-cormorant italic text-cream/60 text-lg md:text-xl -mt-1">
            Tribute to Toronto, OVO Sound, and the engineering details of 6 CATALOGUE.
          </p>
          <div className="h-[1px] w-full bg-gradient-to-r from-rose-gold/40 to-transparent mt-4"></div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Side: Toronto Tribute & Image */}
          <div className="lg:col-span-7 space-y-8">
            <h2 className="font-cormorant italic text-3xl md:text-5xl text-cream font-bold leading-tight">
              "Toronto didn't just inspire the sound, it is the sound."
            </h2>
            
            <p className="font-inter text-cream/70 text-base md:text-lg leading-relaxed font-light">
              6 CATALOGUE is a digital tribute to the career of Aubrey "Drake" Graham. From the early hallways of Degrassi to global streaming domination, Drizzy's legacy is tied to the cold winters, the CN Tower views, and late night penthouses of Toronto. Through rose-gold accents, late-night wine backgrounds, and retro monophonic widgets, this experience is designed to embody OVO luxury.
            </p>

            <div className="relative w-full h-[280px] border border-rose-gold/20 overflow-hidden shadow-2xl">
              <div 
                className="w-full h-full bg-cover bg-center opacity-40 hover:scale-105 transition-transform duration-[3s]"
                style={{ 
                  backgroundImage: `url('https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop')` 
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-base via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 font-bebas text-xs text-rose-gold tracking-widest">
                TORONTO SKYLINE · NOCTURNAL BLUE
              </div>
            </div>
          </div>

          {/* Right Side: Engineering Specs */}
          <div className="lg:col-span-5 space-y-8 glass-panel p-8 rounded-none border border-rose-gold/20 shadow-2xl">
            <div>
              <span className="font-bebas text-xs tracking-[0.2em] text-rose-gold block mb-2">SYSTEM SPECS</span>
              <h3 className="font-bebas text-2xl text-cream tracking-wider">ENGINEERING</h3>
            </div>

            <div className="space-y-4 font-inter text-sm text-cream/80">
              
              {/* Tech 1 */}
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-rose-gold/10 flex items-center justify-center flex-shrink-0 text-rose-gold">
                  <Code2 size={16} />
                </div>
                <div>
                  <h4 className="font-bebas text-xs tracking-wider text-rose-gold">CORE FRAMEWORK</h4>
                  <p className="text-[12px] opacity-70">React 18 + Vite (SPA scaffolding)</p>
                </div>
              </div>

              {/* Tech 2 */}
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-rose-gold/10 flex items-center justify-center flex-shrink-0 text-rose-gold">
                  <Paintbrush size={16} />
                </div>
                <div>
                  <h4 className="font-bebas text-xs tracking-wider text-rose-gold">STYLING DIRECTIVES</h4>
                  <p className="text-[12px] opacity-70">Tailwind CSS (Vanilla CSS fallbacks + Glassmorphism + 3D Card flips)</p>
                </div>
              </div>

              {/* Tech 3 */}
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-rose-gold/10 flex items-center justify-center flex-shrink-0 text-rose-gold">
                  <Terminal size={16} />
                </div>
                <div>
                  <h4 className="font-bebas text-xs tracking-wider text-rose-gold">AMBIENT SYNTHESIZER</h4>
                  <p className="text-[12px] opacity-70">Web Audio API (Oscillators, Gains, minor/major pads, keypress sound effects)</p>
                </div>
              </div>

              {/* Tech 4 */}
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-rose-gold/10 flex items-center justify-center flex-shrink-0 text-rose-gold">
                  <Globe size={16} />
                </div>
                <div>
                  <h4 className="font-bebas text-xs tracking-wider text-rose-gold">SPEECH VOICEMAIL</h4>
                  <p className="text-[12px] opacity-70">Web Speech API (SpeechSynthesisUtterance) for interactive voicemails</p>
                </div>
              </div>

            </div>

            <div className="h-[1px] w-full bg-rose-gold/10 my-6"></div>

            <div className="flex flex-col gap-2 font-inter text-[10px] uppercase tracking-wider text-cream/40">
              <div className="flex items-center gap-1.5 justify-center lg:justify-start">
                Made with <Heart size={10} className="text-red-800 fill-red-800 animate-pulse" /> for Toronto.
              </div>
              <div>© {new Date().getFullYear()} OVO SOUND HISTORY PROJECT.</div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
export default Credits;
