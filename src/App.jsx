import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import Preloader from './components/Preloader';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutBento from './components/AboutTerminal';
import ProjectsSlider from './components/ProjectsSlider';
import TechnicalMatrix from './components/TechnicalMatrix';
import Contact from './components/Contact';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoading) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, [isLoading]);

  return (
    <div className="bg-background min-h-screen text-foreground overflow-x-hidden selection:bg-white selection:text-black relative">
      
      {/* Preloader */}
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}

      {/* Premium Grain Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-[99] opacity-[0.04]" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />
      
      <CustomCursor />
      {!isLoading && (
        <>
          <Navbar />
          <main>
            <Hero />
            <AboutBento />
            <ProjectsSlider />
            <TechnicalMatrix />
            <Contact />
          </main>
        </>
      )}
    </div>
  );
}

export default App;
