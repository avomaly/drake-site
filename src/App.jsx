import React, { useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, AppContext } from './context/AppContext';
import TopNavBar from './components/TopNavBar';
import NokiaWidget from './components/NokiaWidget';
import MoodToggle from './components/MoodToggle';
import FootstepCursor from './components/FootstepCursor';
import MoodOverlay from './components/MoodOverlay';
import OverridesPanel from './components/OverridesPanel';
import Footer from './components/Footer';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

// Pages
import Home from './pages/Home';
import AlbumDetail from './pages/AlbumDetail';
import Timeline from './pages/Timeline';
import Credits from './pages/Credits';

const ERAS = {
  EARLY: { base: '#0D1B2A', text: '#E0E1DD' },
  OVOXO: { base: '#0A0A0A', text: '#F5F5F5' },
  MORE_LIFE: { base: '#0D2010', text: '#FAF3E8' },
  CLB: { base: '#0D0608', text: '#FAF3E8' },
  ERA_2026: { base: '#080E1A', text: '#E2E8F0' }
};

function AppContent() {
  const { mood, activeEra } = useContext(AppContext);
  const [merchToast, setMerchToast] = useState(null);

  // OVO Merch Drop timer alerts (random popups every 3-5 mins)
  useEffect(() => {
    const triggerToast = () => {
      const countdownMins = Math.floor(Math.random() * (8 - 2 + 1) + 2); // 2-8 mins
      setMerchToast({
        title: "🦉 OVO MERCH DROP",
        desc: `Limited edition pieces dropping in ${countdownMins} mins`,
        link: "https://www.ovoclothing.com"
      });
      // Dismiss after 8 seconds
      setTimeout(() => setMerchToast(null), 8000);
    };

    // First trigger after 45 seconds for testing visibility
    const firstTimer = setTimeout(triggerToast, 45000);

    const interval = setInterval(() => {
      triggerToast();
    }, 180000 + Math.random() * 120000); // 3 to 5 minutes

    return () => {
      clearTimeout(firstTimer);
      clearInterval(interval);
    };
  }, []);

  const eraStyle = ERAS[activeEra] || ERAS.CLB;

  return (
    <div 
      style={{
        backgroundColor: eraStyle.base,
        color: eraStyle.text,
        transition: 'background-color 0.8s ease-in-out, color 0.8s ease-in-out'
      }} 
      className="relative min-h-screen"
    >
      {/* 1. Global Interactivity overlays */}
      <FootstepCursor />
      <MoodOverlay />

      {/* Under crying mode: simple ambient rain falling filter overlay without desaturation */}
      {mood === 'CRYING' && (
        <div className="fixed inset-0 bg-slate-900/5 pointer-events-none z-30 transition-all duration-1000" />
      )}

      {/* OVO Merch Drop Alert Toast */}
      <AnimatePresence>
        {merchToast && (
          <motion.div
            initial={{ opacity: 0, x: 200, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 200 }}
            className="fixed top-6 right-6 z-[150] w-80 bg-[#0D0608] border border-rose-gold/60 p-4 shadow-2xl flex flex-col gap-2 rounded-none text-cream"
          >
            <div className="flex justify-between items-start border-b border-rose-gold/25 pb-1.5">
              <span className="font-bebas text-rose-gold text-xs tracking-widest flex items-center gap-1.5">
                {merchToast.title}
              </span>
              <button 
                onClick={() => setMerchToast(null)}
                className="text-cream/50 hover:text-white"
              >
                <X size={12} />
              </button>
            </div>
            <p className="font-inter text-[11px] opacity-80">{merchToast.desc}</p>
            <a
              href={merchToast.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 w-full bg-rose-gold text-[#0D0608] font-bebas text-center text-xs tracking-widest py-1.5 hover:bg-cream transition-colors rounded-none"
            >
              SHOP NOW
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Global Widgets */}
      <TopNavBar />
      <MoodToggle />
      <NokiaWidget />
      <OverridesPanel />

      {/* 3. Page Routes Container */}
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/album/:slug" element={<AlbumDetail />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/credits" element={<Credits />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}
