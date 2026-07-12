import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Phone, PhoneOff, Mail, Battery, SignalHigh, X, Volume2 } from 'lucide-react';

export const NokiaWidget = () => {
  const {
    nokiaStatus,
    nokiaScreen,
    setNokiaScreen,
    missedCount,
    setMissedCount,
    startRingtone,
    stopRingtone,
    playVoicemail,
    declineCall,
    hangupCall,
    voicemailStatus,
    typedVoicemailText,
    getAudioContext
  } = useContext(AppContext);

  const [isOpen, setIsOpen] = useState(false);

  // Play keypad beep sound
  const playBeep = (freq = 800) => {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch(e) {}
  };

  const handleOpenPhone = () => {
    playBeep(600);
    setIsOpen(true);
    if (nokiaStatus === 'IDLE') {
      startRingtone();
    }
  };

  const handleDecline = () => {
    playBeep(400);
    declineCall();
  };

  const handleAnswer = () => {
    playBeep(900);
    playVoicemail();
  };

  const handleHangup = () => {
    playBeep(300);
    hangupCall();
  };

  const handleClose = (e) => {
    e.stopPropagation();
    playBeep(300);
    stopRingtone();
    hangupCall();
    setIsOpen(false);
  };

  return (
    <>
      {/* 1. Small Floating Widget (Bottom Left) */}
      {!isOpen && (
        <div 
          onClick={handleOpenPhone}
          className="fixed bottom-6 left-6 z-[90] cursor-pointer group transition-all duration-300 transform hover:scale-105"
        >
          <div className="glass-panel hover:bg-wine/60 border border-rose-gold/30 p-4 rounded-xl w-48 shadow-[0_0_20px_rgba(196,154,108,0.15)] flex flex-col gap-2 relative overflow-hidden">
            {nokiaStatus === 'RINGING' && (
              <div className="absolute inset-0 border border-rose-gold/60 animate-pulse rounded-xl pointer-events-none" />
            )}

            <div className="flex justify-between items-center border-b border-rose-gold/10 pb-1">
              <span className="font-bebas text-[11px] text-rose-gold tracking-widest flex items-center gap-1">
                <Volume2 size={10} className="animate-bounce" /> 3310 WIDGET
              </span>
              <Battery size={12} className="text-rose-gold" />
            </div>

            <div className="py-1">
              {nokiaStatus === 'RINGING' ? (
                <>
                  <p className="font-bebas text-rose-gold text-[10px] tracking-wider animate-pulse">INCOMING CALL:</p>
                  <p className="font-cormorant text-cream italic text-sm font-semibold truncate">The 6 God 🦉</p>
                </>
              ) : nokiaStatus === 'ACTIVE' ? (
                <>
                  <p className="font-bebas text-rose-gold text-[10px] tracking-wider">CALL ACTIVE:</p>
                  <p className="font-cormorant text-cream italic text-sm font-semibold truncate">
                    {voicemailStatus === 'LOADING' ? 'Loading message...' : 'Playing voicemail...'}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-bebas text-rose-gold text-[10px] tracking-wider">NOKIA DIALER:</p>
                  <p className="font-inter text-cream text-[11px] opacity-70">
                    {missedCount > 0 ? `⚠️ ${missedCount} Missed Calls` : 'Click to call Drake'}
                  </p>
                </>
              )}
            </div>

            <div className="flex justify-center border-t border-rose-gold/10 pt-2 text-rose-gold group-hover:text-cream transition-colors">
              <Mail size={14} className={nokiaStatus === 'RINGING' ? 'animate-bounce' : ''} />
            </div>
          </div>
        </div>
      )}

      {/* 2. Expanded Nokia 3310 Phone Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-base/80 backdrop-blur-md p-4 select-none">
          <div className="relative animate-in zoom-in duration-300 flex flex-col items-center">
            
            <button 
              onClick={handleClose}
              className="absolute -top-12 right-0 md:-right-16 text-cream/70 hover:text-rose-gold flex items-center gap-2 font-bebas text-sm tracking-widest transition-colors"
            >
              DISMISS <X size={16} />
            </button>

            {/* Premium Nokia 3310 Chassis */}
            <div className="w-[310px] h-[610px] rounded-[50px] p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] flex flex-col items-center relative overflow-hidden bg-gradient-to-br from-[#2D0810] via-[#1A0810] to-[#0D0608] border border-rose-gold/30">
              
              <div className="w-16 h-1.5 bg-black/60 rounded-full mb-6"></div>
              
              <div className="font-bebas text-[11px] text-rose-gold/60 tracking-[0.3em] mb-4">6 CATALOGUE</div>
              
              {/* LCD BACKLIGHT SCREEN */}
              <div className="nokia-screen-glow w-full h-[200px] rounded border-[6px] border-[#0A0A0A] p-3 flex flex-col justify-between select-none relative font-mono text-black">
                
                {/* Header: Signal & Battery */}
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <div className="flex items-center gap-0.5">
                    <SignalHigh size={10} />
                    <span>OVO</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <Battery size={10} />
                    <span>100%</span>
                  </div>
                </div>

                {/* Main Screen Body */}
                <div className="flex-grow flex flex-col justify-center py-1">
                  {nokiaScreen === 'CALLING' && (
                    <div className="text-center">
                      <div className="text-sm font-bold tracking-tight mb-0.5">The 6 God 🦉</div>
                      <div className="text-[9px] tracking-widest animate-pulse font-bold">CALLING...</div>
                      <div className="text-[9px] mt-2 opacity-70">"Best I Ever Had"</div>
                    </div>
                  )}

                  {nokiaScreen === 'VOICEMAIL' && (
                    <div className="text-center w-full flex flex-col items-center justify-between h-[135px] py-0.5">
                      <div className="text-[10px] font-bold tracking-wider border-b border-black/10 w-full pb-0.5">VOICEMAIL</div>
                      
                      <div className="flex-grow flex items-center justify-center text-[10px] text-center w-full px-1 py-1 leading-tight font-bold">
                        {voicemailStatus === 'LOADING' && (
                          <div className="animate-pulse flex flex-col items-center gap-1">
                            <span>🎵</span>
                            <span>Loading voicemail...</span>
                          </div>
                        )}
                        {voicemailStatus === 'PLAYING_FILE' && (
                          <div className="flex flex-col items-center gap-1.5">
                            <span className="text-[9px] uppercase tracking-wider animate-pulse">🔊 Playing mp3</span>
                            <div className="flex items-end justify-center gap-0.5 h-6 w-20">
                              <span className="w-0.5 bg-black rounded animate-[pulse_0.6s_infinite_alternate]" style={{ height: '70%' }}></span>
                              <span className="w-0.5 bg-black rounded animate-[pulse_0.8s_infinite_alternate_0.2s]" style={{ height: '40%' }}></span>
                              <span className="w-0.5 bg-black rounded animate-[pulse_0.5s_infinite_alternate_0.1s]" style={{ height: '90%' }}></span>
                              <span className="w-0.5 bg-black rounded animate-[pulse_0.7s_infinite_alternate_0.3s]" style={{ height: '50%' }}></span>
                            </div>
                          </div>
                        )}
                        {voicemailStatus === 'TYPING_FALLBACK' && (
                          <div className="text-[9px] text-left leading-normal font-sans font-bold whitespace-normal break-words w-full h-[65px] overflow-y-auto">
                            {typedVoicemailText}
                          </div>
                        )}
                      </div>

                      <button 
                        onClick={handleHangup}
                        className="bg-black text-[#7dbd7d] border border-black hover:bg-black/95 hover:text-white px-3 py-0.5 text-[8px] font-bold tracking-widest uppercase rounded cursor-pointer"
                      >
                        END CALL
                      </button>
                    </div>
                  )}

                  {nokiaScreen === 'HOME' && (
                    <div className="text-center">
                      <div className="text-lg font-bold tracking-wide">NOKIA 3310</div>
                      <div className="text-[9px] opacity-75 mt-1">
                        {missedCount > 0 ? `⚠️ ${missedCount} Missed Calls` : 'System Connected'}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer labels */}
                <div className="flex justify-between items-center text-[9px] font-bold border-t border-black/20 pt-1">
                  {nokiaScreen === 'CALLING' ? (
                    <>
                      <span>[CALL] ANSR</span>
                      <span>[END] DECL</span>
                    </>
                  ) : nokiaScreen === 'VOICEMAIL' ? (
                    <>
                      <span>VOICEPLAY</span>
                      <span>[END] HANG</span>
                    </>
                  ) : (
                    <>
                      <span>MENU</span>
                      <span>CONTACTS</span>
                    </>
                  )}
                </div>
              </div>

              {/* Physical Keypad */}
              <div className="w-full mt-6 flex-grow flex flex-col justify-between">
                
                <div className="grid grid-cols-3 gap-x-2 gap-y-1 justify-items-center">
                  <button 
                    onClick={handleAnswer}
                    disabled={nokiaStatus === 'ACTIVE'}
                    className="w-12 h-8 rounded-full bg-[#1A4E1A] hover:bg-[#256e25] flex items-center justify-center text-white shadow-md active:scale-95 transition-transform"
                  >
                    <Phone size={14} />
                  </button>

                  <div className="w-16 h-8 rounded-full border border-rose-gold/20 bg-black/30 flex items-center justify-center">
                    <div className="w-10 h-1.5 bg-rose-gold/40 rounded-full"></div>
                  </div>

                  <button 
                    onClick={nokiaStatus === 'ACTIVE' ? handleHangup : handleDecline}
                    className="w-12 h-8 rounded-full bg-[#5C1A1A] hover:bg-[#822525] flex items-center justify-center text-white shadow-md active:scale-95 transition-transform"
                  >
                    <PhoneOff size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 text-rose-gold">
                  {[
                    { num: '1', letters: 'o_o' },
                    { num: '2', letters: 'abc' },
                    { num: '3', letters: 'def' },
                    { num: '4', letters: 'ghi' },
                    { num: '5', letters: 'jkl' },
                    { num: '6', letters: 'mno' },
                    { num: '7', letters: 'pqrs' },
                    { num: '8', letters: 'tuv' },
                    { num: '9', letters: 'wxyz' },
                    { num: '*', letters: '+' },
                    { num: '0', letters: '_' },
                    { num: '#', letters: '♫' }
                  ].map((key) => (
                    <button
                      key={key.num}
                      onClick={() => playBeep(500 + parseInt(key.num || 0) * 50)}
                      className="flex flex-col items-center justify-center p-2 rounded-lg bg-black/40 border border-rose-gold/10 hover:bg-rose-gold/10 active:scale-95 transition-all"
                    >
                      <span className="font-bebas text-lg leading-none text-cream">{key.num}</span>
                      <span className="text-[7px] tracking-wider uppercase opacity-45">{key.letters}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="font-bebas text-[9px] text-rose-gold/30 tracking-[0.2em] mt-3">MADE IN THE 6IX</div>
            </div>

            <div className="text-center mt-4 max-w-[280px]">
              <h4 className="font-cormorant italic text-lg text-rose-gold">"You Used To Call Me..."</h4>
              <p className="font-inter text-cream/60 text-[11px] leading-relaxed">
                Answer the phone to play Drake's real voicemail MP3 or read the transcript.
              </p>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
export default NokiaWidget;
