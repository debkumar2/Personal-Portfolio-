import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

const Preloader = ({ onComplete }) => {
  const [counter, setCounter] = useState(0);
  const [text, setText] = useState('');
  const preloaderRef = useRef();
  const topRef = useRef();
  const bottomRef = useRef();
  const counterRef = useRef();
  const nameRef = useRef();
  const lineRef = useRef();

  const fullName = 'DEBKUMAR MONDAL';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&01';

  // Scramble text effect
  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setText(
        fullName.split('').map((char, i) => {
          if (char === ' ') return ' ';
          if (i < iteration) return fullName[i];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('')
      );
      iteration += 0.4;
      if (iteration >= fullName.length) {
        clearInterval(interval);
        setText(fullName);
      }
    }, 40);
    return () => clearInterval(interval);
  }, []);

  // Counter animation
  useEffect(() => {
    const duration = 2200;
    const start = Date.now();
    
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      // Eased progress for smooth feel
      const eased = 1 - Math.pow(1 - progress, 3);
      setCounter(Math.floor(eased * 100));
      
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };
    requestAnimationFrame(tick);
  }, []);

  // Exit animation when counter reaches 100
  useEffect(() => {
    if (counter === 100) {
      const tl = gsap.timeline({
        onComplete: () => onComplete(),
      });

      tl.to(counterRef.current, {
        opacity: 0,
        y: -30,
        duration: 0.4,
        ease: 'power2.in',
      })
      .to(nameRef.current, {
        opacity: 0,
        y: -30,
        duration: 0.4,
        ease: 'power2.in',
      }, '-=0.2')
      .to(lineRef.current, {
        scaleX: 0,
        duration: 0.3,
        ease: 'power2.in',
      }, '-=0.2')
      .to(topRef.current, {
        yPercent: -100,
        duration: 0.8,
        ease: 'power4.inOut',
      }, '-=0.1')
      .to(bottomRef.current, {
        yPercent: 100,
        duration: 0.8,
        ease: 'power4.inOut',
      }, '<')
    }
  }, [counter, onComplete]);

  return (
    <div ref={preloaderRef} className="fixed inset-0 z-[200] pointer-events-none">
      {/* Top half */}
      <div
        ref={topRef}
        className="absolute top-0 left-0 w-full h-1/2 bg-[#0a0a0a] flex items-end justify-center"
      >
        <div className="mb-0 text-center pb-4">
          <div
            ref={nameRef}
            className="text-4xl md:text-6xl font-bold tracking-tighter text-white font-mono"
          >
            {text}
          </div>
        </div>
      </div>

      {/* Center line */}
      <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 z-10 px-12 md:px-24">
        <div ref={lineRef} className="h-[1px] bg-white/20 origin-left" />
      </div>

      {/* Bottom half */}
      <div
        ref={bottomRef}
        className="absolute bottom-0 left-0 w-full h-1/2 bg-[#0a0a0a] flex items-start justify-between px-12 md:px-24"
      >
        <div className="pt-6">
          <div className="text-[10px] font-mono text-gray-500 tracking-[0.3em] uppercase">
            Portfolio · 2026
          </div>
        </div>
        <div ref={counterRef} className="pt-4">
          <div className="text-5xl md:text-7xl font-bold font-mono text-white tabular-nums">
            {counter}
            <span className="text-gray-600 text-3xl md:text-5xl">%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
