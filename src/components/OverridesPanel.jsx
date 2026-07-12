import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Flame, Sparkles, BookOpen, ShieldCheck, HelpCircle, X, Check, Eye } from 'lucide-react';

const DRAKE_LYRICS = [
  "Tables turn, bridges burn, you live and learn.",
  "Started from the bottom, now we're here.",
  "You used to call me on my cell phone...",
  "Know yourself, know your worth.",
  "I only love my bed and my momma, I'm sorry.",
  "God's plan. I can't do this on my own.",
  "I cannot see heaven being much better than this.",
  "Sweatpants, hair tied, chilling with no make-up on.",
  "Live for today, plan for tomorrow, party tonight.",
  "Best I ever had.",
  "Free smoke, free smoke, ay!",
  "Passionate from miles away, active with the talk.",
  "My line blowin' up, she say, 'Do you love me?' I tell her, 'Only partly.'",
  "Tuscan leather smelling like a brick.",
  "Keep the family close.",
  "Doing it wrong, but it feels so right.",
  "You know it's real when you are who you think you are.",
  "Just hold on, we're going home.",
  "Workin' on the weekend like usual."
];

// 10 Round Quiz Quotes
const QUIZ_ROUNDS = [
  { text: "I'm not confrontational, but if someone challenges me, I'm not going to back down", ans: "DRIZZY" },
  { text: "I like when money makes a difference but don't make you different", ans: "DRIZZY" },
  { text: "The more you love, the more you lose", ans: "CAP" },
  { text: "I've been down so long it looks like up to me", ans: "DRIZZY" },
  { text: "Started from the penthouse now I'm here", ans: "CAP" },
  { text: "Know yourself, know your worth", ans: "DRIZZY" },
  { text: "I only love my bed and my mama, I'm sorry", ans: "DRIZZY" },
  { text: "Never let success go to your head, never let failure go to your heart", ans: "CAP" },
  { text: "Trigger fingers turn to twitter fingers", ans: "DRIZZY" },
  { text: "0 to 100, real quick", ans: "DRIZZY" }
];

export const OverridesPanel = () => {
  const {
    ovoMode,
    setOvoMode,
    hotlineCursor,
    setHotlineCursor,
    mood,
    setMood,
    getAudioContext
  } = useContext(AppContext);

  // States
  const [showBeefModal, setShowBeefModal] = useState(false);
  const [showDizzyModal, setShowDizzyModal] = useState(false);
  const [showConfessionModal, setShowConfessionModal] = useState(false);
  const [showPrayerModal, setShowPrayerModal] = useState(false);

  // Drizzy or Dizzy states
  const [quizRound, setQuizRound] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Confession Booth states
  const [hotTake, setHotTake] = useState('');
  const [confessionLoading, setConfessionLoading] = useState(false);
  const [confessionResponse, setConfessionResponse] = useState('');

  // 6 God Prayer states
  const [lyricLoading, setLyricLoading] = useState(false);
  const [activeLyric, setActiveLyric] = useState('');

  // Owl flight animation helper
  const [owls, setOwls] = useState([]);
  useEffect(() => {
    if (ovoMode) {
      const list = Array.from({ length: 25 }).map((_, idx) => ({
        id: idx,
        size: 50 + Math.random() * 60,
        yStart: 5 + Math.random() * 85,
        delay: idx * 0.12,
        duration: 2.2 + Math.random() * 1.5
      }));
      setOwls(list);
      const timer = setTimeout(() => setOwls([]), 5500);
      return () => clearTimeout(timer);
    }
  }, [ovoMode]);

  const handleOvoClick = () => {
    try { getAudioContext(); } catch(e) {}
    setOvoMode(true);
  };

  // Beef History Modal Trigger
  const handleBeefClick = () => {
    try { getAudioContext(); } catch(e) {}
    setShowBeefModal(true);
  };

  // Quiz Modal Trigger
  const handleQuizClick = () => {
    try { getAudioContext(); } catch(e) {}
    setQuizRound(0);
    setQuizScore(0);
    setQuizFinished(false);
    setShowDizzyModal(true);
  };

  const handleQuizAnswer = (userChoice) => {
    const currentQuestion = QUIZ_ROUNDS[quizRound];
    if (userChoice === currentQuestion.ans) {
      setQuizScore(prev => prev + 1);
    }
    
    if (quizRound < 9) {
      setQuizRound(prev => prev + 1);
    } else {
      setQuizFinished(true);
      // Trigger rose gold / gold confetti celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C49A6C', '#FAF3E8', '#4A0E1A']
      });
    }
  };

  // Confession Booth Modal Trigger
  const handleConfessionClick = () => {
    try { getAudioContext(); } catch(e) {}
    setHotTake('');
    setConfessionResponse('');
    setShowConfessionModal(true);
  };

  // Simulated Claude API request for Confession Booth
  const handleSubmitConfession = (e) => {
    e.preventDefault();
    if (!hotTake.trim() || hotTake.length > 100) return;

    setConfessionLoading(true);

    // Audio cue
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(90, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch(err) {}

    setTimeout(() => {
      const take = hotTake.toLowerCase();
      let response = '';

      if (take.includes('kendrick') || take.includes('kdot') || take.includes('larmar') || take.includes('family matters')) {
        response = "Trigger fingers turn to twitter fingers. You think you won, but I've been down so long it looks like up to me. The 6ix never sleeps on a challenge.";
      } else if (take.includes('ghost') || take.includes('writer') || take.includes('quentin')) {
        response = "You know it's real when you are who you think you are. The pen has never lied, but the critics always do.";
      } else if (take.includes('flop') || take.includes('washed') || take.includes('fell off') || take.includes('bad')) {
        response = "Started from the bottom, now we're here. Tell me how the view is from down there while I keep breaking records.";
      } else if (take.includes('mid') || take.includes('overrated') || take.includes('views') || take.includes('clb')) {
        response = "I cannot see heaven being much better than this. Keep talking, it just feeds the Views.";
      } else if (take.includes('meek') || take.includes('mill') || take.includes('back to back')) {
        response = "Back to back for the niggas that didn't get the message. I don't settle for less than a win.";
      } else if (take.includes('sing') || take.includes('crying') || take.includes('simp') || take.includes('sad')) {
        response = "I only love my bed and my momma, I'm sorry. Sometimes you just gotta confess it all on the track.";
      } else {
        const fallbackLyrics = [
          "Know yourself, know your worth. That take is cap, but I appreciate you tuning in to the archive.",
          "Best I ever had. That take is classic, but you need to check the history.",
          "Tables turn, bridges burn, you live and learn. I'll let the numbers speak for themselves.",
          "Just hold on, we're going home. No need to stress over opinions from the bleachers."
        ];
        response = fallbackLyrics[Math.floor(Math.random() * fallbackLyrics.length)];
      }

      setConfessionResponse(response);
      setConfessionLoading(false);
    }, 2000);
  };

  // 6 God Prayer Trigger
  const handleConsultGod = () => {
    try { getAudioContext(); } catch(e) {}
    setLyricLoading(true);
    setShowPrayerModal(true);

    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(65, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 2.5);
    } catch(e) {}

    setTimeout(() => {
      const idx = Math.floor(Math.random() * DRAKE_LYRICS.length);
      setActiveLyric(DRAKE_LYRICS[idx]);
      setLyricLoading(false);
    }, 2500);
  };

  // Handle ESC key close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowBeefModal(false);
        setShowDizzyModal(false);
        setShowConfessionModal(false);
        setShowPrayerModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* Owls flying animation overlay (OVO Mode) */}
      {ovoMode && (
        <div className="fixed inset-0 pointer-events-none z-[190] overflow-hidden">
          {owls.map(owl => (
            <motion.div
              key={owl.id}
              initial={{ x: '-20vw', y: `${owl.yStart}vh` }}
              animate={{ x: '120vw' }}
              transition={{
                delay: owl.delay,
                duration: owl.duration,
                ease: 'linear'
              }}
              className="absolute select-none pointer-events-none"
              style={{ fontSize: owl.size, filter: 'drop-shadow(0 0 15px #C49A6C)' }}
            >
              🦉
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0.25, 0.4, 0] }}
            transition={{ duration: 5 }}
            className="absolute inset-0 bg-yellow-500/10 mix-blend-color-dodge z-[180] pointer-events-none shadow-[inset_0_0_120px_rgba(196,154,108,0.7)] animate-pulse"
          />
        </div>
      )}

      {/* Floating Side Panel Control Dashboard */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[80] flex flex-col items-end space-y-4 select-none">
        <div className="font-bebas text-[11px] text-rose-gold/40 tracking-[0.2em] uppercase select-none rotate-90 origin-right translate-x-4 mb-16">
          SYSTEM OVERRIDES
        </div>

        <div className="flex flex-col space-y-3 p-4 glass-panel rounded-none shadow-[0_15px_30px_-5px_rgba(0,0,0,0.8)] animate-float">
          
          {/* BEEF HISTORY */}
          <button 
            onClick={handleBeefClick}
            className="flex items-center justify-between w-56 bg-[#0D0608]/90 hover:bg-[#4A0E1A]/40 border border-rose-gold/30 hover:border-rose-gold text-rose-gold hover:text-cream px-4 py-3 text-left transition-all duration-300 active:scale-95 group rounded-none"
          >
            <span className="font-bebas text-xs tracking-widest">🥊 BEEF HISTORY</span>
            <Flame size={14} className="group-hover:animate-bounce text-rose-gold" />
          </button>

          {/* DRIZZY OR DIZZY */}
          <button 
            onClick={handleQuizClick}
            className="flex items-center justify-between w-56 bg-[#0D0608]/90 hover:bg-[#4A0E1A]/40 border border-rose-gold/30 hover:border-rose-gold text-rose-gold hover:text-cream px-4 py-3 text-left transition-all duration-300 active:scale-95 group rounded-none"
          >
            <span className="font-bebas text-xs tracking-widest">🤔 DRIZZY OR DIZZY?</span>
            <HelpCircle size={14} className="text-rose-gold" />
          </button>

          {/* 6 GOD CONFESSION BOOTH */}
          <button 
            onClick={handleConfessionClick}
            className="flex items-center justify-between w-56 bg-[#0D0608]/90 hover:bg-[#4A0E1A]/40 border border-rose-gold/30 hover:border-rose-gold text-rose-gold hover:text-cream px-4 py-3 text-left transition-all duration-300 active:scale-95 group rounded-none"
          >
            <span className="font-bebas text-xs tracking-widest">⛪ CONFESSION BOOTH</span>
            <Eye size={14} className="text-rose-gold" />
          </button>

          {/* OVO MODE */}
          <button 
            onClick={handleOvoClick}
            className="flex items-center justify-between w-56 bg-[#0D0608]/90 hover:bg-[#4A0E1A]/40 border border-rose-gold/30 hover:border-rose-gold text-rose-gold hover:text-cream px-4 py-3 text-left transition-all duration-300 active:scale-95 group rounded-none"
          >
            <span className="font-bebas text-xs tracking-widest">🦉 OVO OWL FLYBY</span>
            <Sparkles size={14} className="text-rose-gold" />
          </button>

          {/* 6 GOD PRAYER */}
          <button 
            onClick={handleConsultGod}
            className="flex items-center justify-between w-56 bg-[#0D0608]/90 hover:bg-[#4A0E1A]/40 border border-rose-gold/30 hover:border-rose-gold text-rose-gold hover:text-cream px-4 py-3 text-left transition-all duration-300 active:scale-95 group rounded-none"
          >
            <span className="font-bebas text-xs tracking-widest">🙏 6 GOD PRAYER</span>
            <BookOpen size={14} className="text-rose-gold" />
          </button>

          {/* HOTLINE BLING CURSOR */}
          <button 
            onClick={() => setHotlineCursor(prev => !prev)}
            className="flex items-center justify-between w-56 bg-[#0D0608]/90 hover:bg-[#4A0E1A]/40 border border-rose-gold/30 hover:border-rose-gold text-rose-gold hover:text-cream px-4 py-3 text-left transition-all duration-300 active:scale-95 group rounded-none"
          >
            <span className="font-bebas text-xs tracking-widest">🕺 HOTLINE CURSOR</span>
            <span className="text-xs">{hotlineCursor ? '🟢 ON' : '🔴 OFF'}</span>
          </button>

          {/* DRAKE MOOD */}
          <button 
            onClick={() => setMood(prev => prev === 'HAPPY' ? 'CRYING' : 'HAPPY')}
            className="flex items-center justify-between w-56 bg-[#0D0608]/90 hover:bg-[#4A0E1A]/40 border border-rose-gold/30 hover:border-rose-gold text-rose-gold hover:text-cream px-4 py-3 text-left transition-all duration-300 active:scale-95 group rounded-none"
          >
            <span className="font-bebas text-xs tracking-widest">😢 / 😊 DRAKE MOOD</span>
            <span className="text-xs">{mood === 'HAPPY' ? '😊' : '😢'}</span>
          </button>
        </div>
      </div>

      {/* 1. BEEF HISTORY SCOREBOARD MODAL (Full Screen Overlay) */}
      <AnimatePresence>
        {showBeefModal && (
          <div className="fixed inset-0 z-[210] flex items-center justify-center bg-black/95 backdrop-blur-md p-6 select-none">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-3xl w-full relative p-8 glass-panel border border-rose-gold/30 text-cream"
            >
              <button 
                onClick={() => setShowBeefModal(false)}
                className="absolute top-6 right-6 text-cream/70 hover:text-rose-gold transition-colors"
              >
                <X size={24} />
              </button>

              <div className="border-b border-rose-gold/20 pb-4 mb-8 text-center md:text-left">
                <span className="font-bebas text-rose-gold text-2xl tracking-[0.3em] block">🥊 BEEF SCOREBOARD</span>
                <span className="text-[10px] uppercase text-cream/50 tracking-wider">Drake's Career Clashes</span>
              </div>

              {/* Staggered Row Animation List */}
              <div className="space-y-4">
                {[
                  { opp: "Meek Mill", emoji: "🤐", year: "2015", track: "Back to Back", badge: "DRAKE WIN 🏆", color: "text-emerald-500 bg-emerald-950/40 border-emerald-500/20" },
                  { opp: "Diddy", emoji: "🕶️", year: "2017", track: "No Shopping", badge: "SETTLED 🤝", color: "text-slate-300 bg-slate-900/40 border-slate-500/20" },
                  { opp: "Pusha T", emoji: "💊", year: "2018", track: "Duppy / Adidon", badge: "DISPUTED ⚖️", color: "text-amber-500 bg-amber-950/40 border-amber-500/20" },
                  { opp: "Kendrick Lamar", emoji: "👑", year: "2024", track: "Family Matters", badge: "KENDRICK WIN 💀", color: "text-red-500 bg-red-950/40 border-red-500/20" },
                  { opp: "Everyone", emoji: "🥊", year: "2025", track: "No Friends in the Industry", badge: "DRAKE COMEBACK 👑", color: "text-cyan-500 bg-cyan-950/40 border-cyan-500/20" }
                ].map((row, index) => (
                  <motion.div
                    key={row.opp}
                    initial={{ opacity: 0, x: -60 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.15 }}
                    className="flex flex-col md:flex-row justify-between items-center p-4 border border-rose-gold/15 bg-white/[0.02] hover:bg-white/[0.05] transition-colors gap-3"
                  >
                    <div className="flex items-center gap-3 w-full md:w-1/3">
                      <span className="text-2xl">{row.emoji}</span>
                      <div>
                        <h4 className="font-bebas text-cream tracking-widest text-base leading-none">{row.opp}</h4>
                        <span className="text-[10px] text-cream/40 font-mono mt-1 block">YEAR: {row.year}</span>
                      </div>
                    </div>

                    <div className="text-center md:text-left w-full md:w-1/3">
                      <span className="font-cormorant italic text-cream/70 text-sm">Key Track: "{row.track}"</span>
                    </div>

                    <div className="w-full md:w-1/3 text-right">
                      <span className={`font-bebas text-[11px] tracking-widest px-3 py-1 border ${row.color}`}>
                        {row.badge}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. DRIZZY OR DIZZY QUIZ MODAL (Full Screen Overlay) */}
      <AnimatePresence>
        {showDizzyModal && (
          <div className="fixed inset-0 z-[215] flex items-center justify-center bg-black/95 backdrop-blur-md p-6 select-none text-cream">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-2xl w-full relative p-8 md:p-12 glass-panel border border-rose-gold/30 shadow-2xl"
            >
              <button 
                onClick={() => setShowDizzyModal(false)}
                className="absolute top-6 right-6 text-cream/70 hover:text-rose-gold transition-colors"
              >
                <X size={20} />
              </button>

              <div className="border-b border-rose-gold/20 pb-4 mb-8">
                <span className="font-bebas text-rose-gold tracking-[0.2em] text-xl block">🤔 DRIZZY OR DIZZY?</span>
                <span className="text-[10px] uppercase text-cream/50 tracking-wider">Round {quizRound + 1} of 10</span>
              </div>

              {!quizFinished ? (
                <div>
                  <h3 className="font-cormorant italic text-3xl md:text-4xl text-cream leading-tight text-center mb-10 h-32 flex items-center justify-center max-w-xl mx-auto">
                    "{QUIZ_ROUNDS[quizRound].text}"
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => handleQuizAnswer('DRIZZY')}
                      className="w-full py-4 bg-transparent border border-rose-gold text-rose-gold font-bebas text-sm tracking-widest hover:bg-rose-gold hover:text-base transition-all rounded-none cursor-pointer flex items-center justify-center gap-2"
                    >
                      DRIZZY SAID IT 🦉
                    </button>
                    <button
                      onClick={() => handleQuizAnswer('CAP')}
                      className="w-full py-4 bg-transparent border border-white/20 text-cream/80 font-bebas text-sm tracking-widest hover:border-cream hover:text-white transition-all rounded-none cursor-pointer flex items-center justify-center gap-2"
                    >
                      NAH THAT'S CAP 🧢
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-20 h-20 bg-rose-gold/20 flex items-center justify-center rounded-full mx-auto mb-6 border border-rose-gold">
                    <Check size={40} className="text-rose-gold" />
                  </div>
                  <h3 className="font-bebas text-rose-gold text-3xl tracking-[0.25em] mb-2">QUIZ COMPLETED</h3>
                  <div className="font-bebas text-cream text-5xl tracking-widest mb-6">
                    {quizScore} / 10
                  </div>
                  
                  {/* Grading message */}
                  <p className="font-cormorant italic text-2xl text-cream/90 mb-10">
                    {quizScore === 10 && "CERTIFIED 6 GOD 🦉"}
                    {quizScore >= 7 && quizScore <= 9 && "SOLID STAN 💯"}
                    {quizScore < 7 && "YOU NEED TO STREAM MORE 😭"}
                  </p>

                  <button
                    onClick={handleQuizClick}
                    className="px-10 py-3.5 font-bebas text-xs tracking-widest bg-rose-gold text-[#0D0608] hover:bg-cream transition-colors rounded-none"
                  >
                    PLAY AGAIN
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. 6 GOD CONFESSION BOOTH MODAL (Full Screen Overlay) */}
      <AnimatePresence>
        {showConfessionModal && (
          <div className="fixed inset-0 z-[220] flex items-center justify-center bg-black/95 backdrop-blur-md p-6 select-none text-cream">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-2xl w-full relative p-8 md:p-12 glass-panel border border-rose-gold/30 shadow-2xl text-center"
            >
              <button 
                onClick={() => setShowConfessionModal(false)}
                className="absolute top-6 right-6 text-cream/70 hover:text-rose-gold transition-colors"
              >
                <X size={20} />
              </button>

              <div className="border-b border-rose-gold/20 pb-4 mb-8">
                <span className="font-bebas text-rose-gold tracking-[0.2em] text-xl block">⛪ 6 GOD CONFESSION BOOTH</span>
                <span className="text-[10px] uppercase text-cream/50 tracking-wider">Submit your hot take to Drake</span>
              </div>

              {confessionResponse ? (
                <div className="py-6 flex flex-col items-center">
                  <span className="font-bebas text-rose-gold/40 text-xs tracking-[0.4em] block mb-8">
                    THE 6 GOD DISPENSATION
                  </span>
                  <blockquote className="font-cormorant text-2xl md:text-3xl text-cream italic leading-relaxed mb-10 max-w-xl text-center">
                    "{confessionResponse}"
                  </blockquote>
                  <div className="h-[1px] w-16 bg-rose-gold mb-8"></div>
                  <button
                    onClick={() => setConfessionResponse('')}
                    className="px-10 py-3.5 font-bebas text-xs tracking-widest bg-transparent border border-rose-gold text-rose-gold hover:bg-rose-gold hover:text-base transition-colors rounded-none"
                  >
                    CONFESS ANOTHER TAKE
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitConfession} className="space-y-6">
                  <h3 className="font-cormorant italic text-2xl text-cream">What is your ultimate Drake hot take?</h3>
                  
                  <div className="relative">
                    <textarea
                      value={hotTake}
                      onChange={(e) => setHotTake(e.target.value)}
                      maxLength={100}
                      placeholder="e.g. Honestly Nevermind was his best album..."
                      rows={4}
                      className="w-full bg-[#0D0608]/80 border border-rose-gold/20 focus:border-rose-gold focus:outline-none p-4 font-inter text-cream text-sm placeholder:opacity-40 rounded-none resize-none"
                      disabled={confessionLoading}
                    />
                    <div className="absolute bottom-3 right-3 text-[10px] text-cream/40 font-mono">
                      {hotTake.length} / 100
                    </div>
                  </div>

                  {confessionLoading ? (
                    <div className="py-4 text-center">
                      <span className="animate-pulse font-bebas text-rose-gold tracking-widest text-sm flex items-center justify-center gap-2">
                        Submitting to the 6 God... 🙏
                      </span>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      disabled={!hotTake.trim()}
                      className="w-full py-4 bg-rose-gold text-[#0D0608] disabled:bg-rose-gold/30 disabled:text-cream/30 font-bebas text-sm tracking-widest hover:bg-cream transition-all rounded-none cursor-pointer"
                    >
                      SUBMIT TO 6 GOD
                    </button>
                  )}
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. 6 God Prayer Modal (Standard Overlay) */}
      <AnimatePresence>
        {showPrayerModal && (
          <div className="fixed inset-0 z-[210] flex items-center justify-center bg-black/95 backdrop-blur-md p-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-4xl w-full text-center relative p-8 md:p-16 flex flex-col items-center justify-center min-h-[400px] border border-rose-gold/25"
            >
              <button 
                onClick={() => setShowPrayerModal(false)}
                className="absolute top-6 right-6 text-cream/70 hover:text-rose-gold transition-colors"
              >
                <X size={24} />
              </button>

              {lyricLoading ? (
                <div className="flex flex-col items-center justify-center gap-6">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="text-8xl select-none"
                  >
                    🙏
                  </motion.div>
                  <h3 className="font-bebas text-rose-gold tracking-[0.3em] text-xl mt-4">
                    CONSULTING THE 6 GOD...
                  </h3>
                </div>
              ) : (
                <div className="py-6 flex flex-col items-center">
                  <span className="font-bebas text-rose-gold/40 text-xs tracking-[0.4em] block mb-8">
                    THE 6 GOD PRAYER
                  </span>
                  <blockquote className="font-cormorant text-4xl md:text-6xl text-cream italic leading-tight mb-12 max-w-3xl">
                    "{activeLyric}"
                  </blockquote>
                  <div className="h-[1px] w-24 bg-rose-gold mb-10"></div>
                  <button
                    onClick={() => setShowPrayerModal(false)}
                    className="px-12 py-4 font-bebas text-sm tracking-widest bg-transparent border border-rose-gold text-rose-gold hover:bg-rose-gold hover:text-base transition-colors rounded-none"
                  >
                    AMEN
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
export default OverridesPanel;
