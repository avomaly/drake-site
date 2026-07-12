import React, { useState, useEffect, useRef, useContext } from 'react';
import { AppContext } from '../context/AppContext';

export const FootstepCursor = () => {
  const { hotlineCursor } = useContext(AppContext);
  const [steps, setSteps] = useState([]);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const lastPos = useRef({ x: 0, y: 0 });
  const stepSide = useRef('L');

  // Track cursor position when hotlineCursor mode is active
  useEffect(() => {
    const handlePos = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    if (hotlineCursor) {
      window.addEventListener('mousemove', handlePos);
      document.body.style.cursor = 'none'; // hide normal cursor
    } else {
      document.body.style.cursor = 'auto'; // show normal cursor
    }
    return () => {
      window.removeEventListener('mousemove', handlePos);
      document.body.style.cursor = 'auto';
    };
  }, [hotlineCursor]);

  useEffect(() => {
    const threshold = hotlineCursor ? 40 : 100; // leaves trail more frequently in hotline mode!

    const handleMouseMove = (e) => {
      const { clientX: x, clientY: y } = e;
      const dx = x - lastPos.current.x;
      const dy = y - lastPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > threshold) {
        const id = Date.now() + Math.random().toString();
        const side = stepSide.current;
        
        // Append trail element
        setSteps((prev) => [...prev, { id, x, y, side }]);
        
        // Toggle side
        stepSide.current = side === 'L' ? 'R' : 'L';
        lastPos.current = { x, y };

        // Auto-remove after time: 2s for hotline, 1s for footsteps
        const fadeTime = hotlineCursor ? 2000 : 1000;
        setTimeout(() => {
          setSteps((prev) => prev.filter((step) => step.id !== id));
        }, fadeTime);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [hotlineCursor]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[200] overflow-hidden">
      {/* Active Cursor Follower (🕺) */}
      {hotlineCursor && (
        <div 
          className="absolute z-50 text-2xl select-none pointer-events-none transition-transform duration-75"
          style={{
            left: mousePos.x - 12,
            top: mousePos.y - 12,
          }}
        >
          🕺
        </div>
      )}

      {/* Trail elements */}
      {steps.map((step) => (
        <div
          key={step.id}
          className="absolute select-none pointer-events-none transition-opacity duration-1000 ease-out"
          style={{
            left: step.x - 12,
            top: step.y - 12,
            opacity: 0.6,
            animation: hotlineCursor ? 'fadeOut 2s forwards' : 'fadeOut 1s forwards',
          }}
        >
          {hotlineCursor ? (
            <span className="text-xl">💃</span>
          ) : (
            <div
              className="font-bebas text-rose-gold opacity-60 flex flex-col items-center justify-center"
              style={{
                transform: step.side === 'R' ? 'scaleX(-1) rotate(15deg)' : 'rotate(-15deg)',
                filter: 'drop-shadow(0 0 4px #C49A6C)',
              }}
            >
              <span className="material-symbols-outlined text-[24px]">footprint</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
export default FootstepCursor;
