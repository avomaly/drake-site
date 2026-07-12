import React, { createContext, useState, useEffect, useRef } from 'react';
import { albums } from '../data/albums';
import { getAlbumArt } from '../utils/albumArt';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Global States
  const [mood, setMood] = useState('HAPPY'); // 'HAPPY' or 'CRYING' (determines hero rain animation)
  const [ovoMode, setOvoMode] = useState(false);
  const [activeEra, setActiveEra] = useState('CLB'); // 'EARLY', 'OVOXO', 'MORE_LIFE', 'CLB', 'ERA_2026'
  const [hotlineCursor, setHotlineCursor] = useState(false); // Hotline Bling dancing emoji cursor mode

  // Nokia Phone States
  const [nokiaStatus, setNokiaStatus] = useState('IDLE'); // 'IDLE', 'RINGING', 'ACTIVE', 'MISSED'
  const [nokiaScreen, setNokiaScreen] = useState('HOME'); // 'HOME', 'CALLING', 'VOICEMAIL', 'MISSED_NOTIF'
  const [missedCount, setMissedCount] = useState(0);

  // Voicemail States
  const [voicemailStatus, setVoicemailStatus] = useState('IDLE'); // 'IDLE', 'LOADING', 'PLAYING_FILE', 'TYPING_FALLBACK'
  const [typedVoicemailText, setTypedVoicemailText] = useState('');

  // Album Artwork States
  const [albumCovers, setAlbumCovers] = useState({});
  const [coversLoading, setCoversLoading] = useState(true);

  // Simping Views Counter
  const [simpingCount, setSimpingCount] = useState(() => {
    return Math.floor(Math.random() * (5000000 - 2000000) + 2000000);
  });

  // Audio Refs & Web Audio Context
  const audioCtxRef = useRef(null);
  const ambientOscsRef = useRef([]);
  const ringtoneIntervalRef = useRef(null);
  const voicemailAudioRef = useRef(null);
  const typingIntervalRef = useRef(null);

  // Initialize or resume AudioContext
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Fetch Album Cover Arts on Mount
  useEffect(() => {
    const fetchCovers = async () => {
      const newCovers = {};
      await Promise.all(albums.map(async (album) => {
        try {
          const artist = "Drake";
          const query = album.slug === 'some-sexy-songs' 
            ? "Drake PARTYNEXTDOOR" 
            : album.title;
          const cover = await getAlbumArt(artist, query);
          newCovers[album.slug] = cover || album.coverUrl;
        } catch (e) {
          newCovers[album.slug] = album.coverUrl;
        }
      }));
      setAlbumCovers(newCovers);
      setCoversLoading(false);
    };
    fetchCovers();
  }, []);

  // 1. Nokia Hotline Bling Ringtone Synth (Retro Monophonic)
  const startRingtone = () => {
    const ctx = getAudioContext();
    setNokiaStatus('RINGING');
    setNokiaScreen('CALLING');

    const melody = [
      { note: 329.63, dur: 0.25 }, // E4
      { note: 392.00, dur: 0.25 }, // G4
      { note: 440.00, dur: 0.5 },  // A4
      { note: 0, dur: 0.2 },       // Rest
      { note: 440.00, dur: 0.25 }, // A4
      { note: 392.00, dur: 0.25 }, // G4
      { note: 329.63, dur: 0.5 },  // E4
      { note: 0, dur: 0.3 }        // Rest
    ];

    let playMelody = () => {
      let time = ctx.currentTime;
      melody.forEach((item) => {
        if (item.note > 0) {
          const osc = ctx.createOscillator();
          const gainNode = ctx.createGain();
          
          osc.type = 'square';
          osc.frequency.setValueAtTime(item.note, time);
          
          gainNode.gain.setValueAtTime(0.08, time);
          gainNode.gain.exponentialRampToValueAtTime(0.001, time + item.dur - 0.02);
          
          osc.connect(gainNode);
          gainNode.connect(ctx.destination);
          
          osc.start(time);
          osc.stop(time + item.dur);
        }
        time += item.dur;
      });
    };

    playMelody();
    ringtoneIntervalRef.current = setInterval(playMelody, 2500);
  };

  const stopRingtone = () => {
    if (ringtoneIntervalRef.current) {
      clearInterval(ringtoneIntervalRef.current);
      ringtoneIntervalRef.current = null;
    }
  };

  // 2. Play Audio voicemail or type out fallback transcript
  const playVoicemail = async () => {
    stopRingtone();
    setNokiaStatus('ACTIVE');
    setNokiaScreen('VOICEMAIL');
    setVoicemailStatus('LOADING');

    const audioUrl = '/voicemail.mp3';

    const startTypingFallback = () => {
      setVoicemailStatus('TYPING_FALLBACK');
      const fullText = "Yo... it's Drizzy. You already know what it is. From the 6. 🦉 More Life.";
      const words = fullText.split(' ');
      let currentIdx = 0;
      setTypedVoicemailText('');

      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }

      typingIntervalRef.current = setInterval(() => {
        if (currentIdx < words.length) {
          setTypedVoicemailText(prev => prev + (currentIdx === 0 ? '' : ' ') + words[currentIdx]);
          currentIdx++;
        } else {
          clearInterval(typingIntervalRef.current);
          setTimeout(() => {
            hangupCall();
          }, 3000);
        }
      }, 450); // type word-by-word slowly
    };

    try {
      const response = await fetch(audioUrl, { method: 'HEAD' });
      if (response.ok) {
        const audio = new Audio(audioUrl);
        voicemailAudioRef.current = audio;
        
        audio.addEventListener('playing', () => {
          setVoicemailStatus('PLAYING_FILE');
        });

        audio.addEventListener('ended', () => {
          hangupCall();
        });

        audio.addEventListener('error', () => {
          startTypingFallback();
        });

        audio.play().catch(() => {
          startTypingFallback();
        });
      } else {
        startTypingFallback();
      }
    } catch (e) {
      startTypingFallback();
    }
  };

  const declineCall = () => {
    stopRingtone();
    setNokiaStatus('IDLE');
    setNokiaScreen('HOME');
    setMissedCount(prev => prev + 1);
  };

  const hangupCall = () => {
    stopRingtone();
    
    if (voicemailAudioRef.current) {
      try {
        voicemailAudioRef.current.pause();
      } catch (e) {}
      voicemailAudioRef.current = null;
    }

    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }

    setNokiaStatus('IDLE');
    setNokiaScreen('HOME');
    setVoicemailStatus('IDLE');
    setTypedVoicemailText('');
  };

  // 3. Ambient Mood Pad Synthesizer
  const stopAmbient = () => {
    ambientOscsRef.current.forEach(osc => {
      try { osc.stop(); } catch(e) {}
    });
    ambientOscsRef.current = [];
  };

  const startAmbient = (type) => {
    stopAmbient();
    const ctx = getAudioContext();
    const time = ctx.currentTime;

    const freqs = type === 'CRYING' 
      ? [110.00, 130.81, 164.81] // A minor sad chord
      : [130.81, 164.81, 196.00]; // C major happy chord

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gainNode = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.2 + (idx * 0.1);
      lfoGain.gain.value = 1.5;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, time);

      gainNode.gain.setValueAtTime(0.0, time);
      gainNode.gain.linearRampToValueAtTime(0.04, time + 2);

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start();
      ambientOscsRef.current.push(osc);
    });
  };

  // Trigger ambient background audio whenever mood changes
  useEffect(() => {
    if (audioCtxRef.current) {
      startAmbient(mood);
    }
  }, [mood]);

  // Views Counter Live Auto-increment
  useEffect(() => {
    const timer = setInterval(() => {
      setSimpingCount(prev => prev + Math.floor(Math.random() * 4) + 1);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  // Flashing Tab Title on Idle
  useEffect(() => {
    let idleTimer;
    let flashInterval;
    let isOriginalTitle = true;

    const startFlashing = () => {
      flashInterval = setInterval(() => {
        document.title = isOriginalTitle 
          ? "📱 YOU USED TO CALL ME" 
          : "📱 ON MY CELL PHONE";
        isOriginalTitle = !isOriginalTitle;
      }, 1500);
    };

    const resetIdle = () => {
      clearInterval(flashInterval);
      document.title = "6 CATALOGUE — DRAKE";
      clearTimeout(idleTimer);
      idleTimer = setTimeout(startFlashing, 30000); // 30 seconds idle
    };

    window.addEventListener('mousemove', resetIdle);
    window.addEventListener('keydown', resetIdle);
    window.addEventListener('click', resetIdle);

    idleTimer = setTimeout(startFlashing, 30000);

    return () => {
      clearTimeout(idleTimer);
      clearInterval(flashInterval);
      window.removeEventListener('mousemove', resetIdle);
      window.removeEventListener('keydown', resetIdle);
      window.removeEventListener('click', resetIdle);
      document.title = "6 CATALOGUE — DRAKE";
    };
  }, []);

  // OVO Mode 5-second golden shimmer
  useEffect(() => {
    if (ovoMode) {
      const ctx = getAudioContext();
      const time = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.05, time + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, time + idx * 0.1 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time + idx * 0.1);
        osc.stop(time + idx * 0.1 + 0.5);
      });

      const timer = setTimeout(() => {
        setOvoMode(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [ovoMode]);

  return (
    <AppContext.Provider value={{
      mood,
      setMood,
      ovoMode,
      setOvoMode,
      activeEra,
      setActiveEra,
      hotlineCursor,
      setHotlineCursor,
      
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
      albumCovers,
      coversLoading,

      simpingCount,
      getAudioContext
    }}>
      {children}
    </AppContext.Provider>
  );
};
export default AppProvider;
