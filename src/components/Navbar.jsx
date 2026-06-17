import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { Sun, Moon } from 'lucide-react';

// Scramble Text Utility for the Toast
const useScrambleText = (text, trigger) => {
  const [displayText, setDisplayText] = useState(text);
  const chars = '!<>-_\\/[]{}—=+*^?#________';
  
  useEffect(() => {
    if (!trigger) return;
    let frame = 0;
    const queue = text.split('').map((char) => ({
      from: chars[Math.floor(Math.random() * chars.length)],
      to: char,
      start: Math.floor(Math.random() * 20),
      end: Math.floor(Math.random() * 20) + 20,
      char: ''
    }));
    
    let animationFrame;
    const update = () => {
      let output = '';
      let complete = 0;
      for (let i = 0, n = queue.length; i < n; i++) {
        let { from, to, start, end, char } = queue[i];
        if (frame >= end) {
          complete++;
          output += to;
        } else if (frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = chars[Math.floor(Math.random() * chars.length)];
            queue[i].char = char;
          }
          output += `<span class="text-foreground/50">${char}</span>`;
        } else {
          output += from;
        }
      }
      setDisplayText(output);
      if (complete === queue.length) return;
      frame++;
      animationFrame = requestAnimationFrame(update);
    };
    update();
    return () => cancelAnimationFrame(animationFrame);
  }, [text, trigger]);

  return <span dangerouslySetInnerHTML={{ __html: displayText }} />;
};

const MagneticItem = ({ children }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className="cursor-pointer"
    >
      {children}
    </motion.div>
  );
};

const Navbar = () => {
  const [isLight, setIsLight] = useState(() => document.documentElement.classList.contains('light'));
  const [showToast, setShowToast] = useState(false);
  const toastRef = useRef(null);

  const toggleTheme = () => {
    const newIsLight = !isLight;
    
    // Cinematic Zoom Transition
    gsap.to('main', {
      scale: 0.95,
      opacity: 0,
      filter: 'blur(10px)',
      duration: 0.4,
      ease: 'power2.inOut',
      onComplete: () => {
        setIsLight(newIsLight);
        document.documentElement.classList.toggle('light');
        triggerToast();
        
        // Zoom back in
        gsap.to('main', {
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.8,
          ease: 'power3.out',
          clearProps: 'all'
        });
      }
    });
  };

  const triggerToast = () => {
    setShowToast(true);
    
    // Wait for render
    setTimeout(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setTimeout(() => setShowToast(false), 200);
        }
      });

      tl.fromTo(toastRef.current,
        { y: 100, opacity: 0, scale: 0.8, rotationX: 45 },
        { y: 0, opacity: 1, scale: 1, rotationX: 0, duration: 0.8, ease: "back.out(1.5)", transformPerspective: 800 }
      )
      .fromTo('.toast-line',
        { scaleX: 0 },
        { scaleX: 1, duration: 0.5, ease: "power3.inOut" },
        "-=0.4"
      )
      .fromTo('.toast-progress',
        { width: "0%" },
        { width: "100%", duration: 1.5, ease: "power1.inOut" },
        "+=0.2"
      )
      .to(toastRef.current,
        { y: -50, opacity: 0, scale: 0.9, duration: 0.5, ease: "power3.in" }
      );
    }, 0);
  };

  const scrambledText = useScrambleText(`SWITCHED TO ${isLight ? 'LIGHT' : 'DARK'} MODE`, showToast);

  return (
    <>
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center justify-between px-8 py-3 bg-background/60 backdrop-blur-xl border border-border rounded-full w-[90%] max-w-4xl shadow-xl transition-colors duration-500"
      >
        <MagneticItem>
          <div className="text-xl font-bold font-sans tracking-tighter text-foreground">
            D<span className="text-foreground">.</span>
          </div>
        </MagneticItem>
        
        <div className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-widest text-muted">
          <MagneticItem><a href="#about" className="hover:text-foreground transition-colors block p-2">About</a></MagneticItem>
          <MagneticItem><a href="#projects" className="hover:text-foreground transition-colors block p-2">Work</a></MagneticItem>
          <MagneticItem><a href="#skills" className="hover:text-foreground transition-colors block p-2">Skills</a></MagneticItem>
          <MagneticItem><a href="#contact" className="hover:text-foreground transition-colors block p-2">Contact</a></MagneticItem>
        </div>

        <div className="flex items-center gap-4">
          <MagneticItem>
            <button 
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full bg-border flex items-center justify-center text-foreground hover:bg-foreground hover:text-background transition-all duration-300"
              aria-label="Toggle theme"
            >
              {isLight ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </MagneticItem>
          
          <MagneticItem>
            <a href="#contact" className="px-5 py-2.5 bg-foreground text-background rounded-full hover:scale-105 transition-all font-bold text-sm hidden md:block">
              Hire Me
            </a>
          </MagneticItem>
        </div>
      </motion.nav>

      {/* GSAP Premium Toast */}
      {showToast && (
        <div className="fixed bottom-12 left-0 w-full pointer-events-none z-[100] flex justify-center">
          <div 
            ref={toastRef} 
            className="relative bg-card/80 backdrop-blur-xl border border-border px-8 py-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col items-center gap-4 min-w-[320px]"
          >
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-foreground rounded-tl-xl opacity-50" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-foreground rounded-tr-xl opacity-50" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-foreground rounded-bl-xl opacity-50" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-foreground rounded-br-xl opacity-50" />

            {/* Content */}
            <div className="flex flex-col items-center gap-1 w-full text-center">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">System Override</span>
              <div className="toast-line w-full h-[1px] bg-border my-1 origin-center" />
              <div className="font-mono text-sm tracking-widest text-foreground font-bold mt-1">
                {scrambledText}
              </div>
            </div>

            {/* GSAP Progress Bar */}
            <div className="w-full h-[2px] bg-border rounded-full overflow-hidden mt-1">
              <div className="toast-progress h-full bg-foreground" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
