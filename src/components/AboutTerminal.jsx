import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Terminal, Cpu, MapPin, GraduationCap, Briefcase } from 'lucide-react';
import TiltCard from './TiltCard';

gsap.registerPlugin(ScrollTrigger);

const CountUp = ({ target, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef();
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered) {
          setHasTriggered(true);

          const duration = 1500;
          const startTime = Date.now();
          const tick = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, hasTriggered]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const AboutBento = () => {
  const container = useRef();

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    });

    tl.fromTo('.about-header', 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    )
    .fromTo('.bento-card', 
      { y: 80, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 1, stagger: 0.12, ease: 'power4.out' },
      "-=0.6"
    );
  }, { scope: container });

  return (
    <section id="about" ref={container} className="py-24 px-6 max-w-6xl mx-auto">
      <div className="about-header mb-14">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-3 h-3 bg-foreground rounded-full" />
          <span className="font-mono text-xs text-muted tracking-[0.3em] uppercase">Who I Am</span>
        </div>
        <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-heading-start to-heading-end">
          ABOUT
        </h2>
        <div className="w-full h-[1px] bg-border mt-6" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Main Bio Box */}
        <div className="bento-card md:col-span-2 h-full">
          <TiltCard className="bg-card rounded-3xl p-8 md:p-10 border border-border hover:border-foreground/20 transition-all duration-500 group relative overflow-hidden h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-foreground/0 to-foreground/0 group-hover:from-foreground/[0.03] group-hover:to-transparent transition-all duration-700 pointer-events-none" />
            <Terminal className="text-foreground/40 group-hover:text-foreground mb-6 relative z-10 transition-colors duration-500" size={28} />
            <h3 className="text-2xl font-bold text-foreground mb-5 relative z-10" style={{ transform: "translateZ(30px)" }}>The Developer</h3>
            <p className="text-muted font-sans leading-relaxed mb-5 relative z-10" style={{ transform: "translateZ(40px)" }}>
              I'm a Frontend Developer who lives and breathes React, crafting pixel-perfect interfaces with obsessive attention to detail. I turn Figma designs into performant, responsive, and silky-smooth web experiences.
            </p>
            <p className="text-muted font-sans leading-relaxed relative z-10" style={{ transform: "translateZ(40px)" }}>
              Beyond the frontend, I'm an aspiring Data Analyst — fascinated by the stories hidden inside raw data. I combine my eye for design with analytical thinking to build dashboards and visualizations that actually make sense.
            </p>
          </TiltCard>
        </div>

        {/* Quick Facts */}
        <div className="bento-card h-full">
          <TiltCard className="bg-card rounded-3xl p-8 border border-border flex flex-col justify-between group hover:border-foreground/20 transition-all duration-500 relative overflow-hidden h-full">
            <div className="absolute inset-0 bg-gradient-to-tl from-foreground/0 to-foreground/0 group-hover:from-foreground/[0.03] group-hover:to-transparent transition-all duration-700 pointer-events-none" />
            <div className="relative z-10">
              <Cpu className="text-foreground/40 group-hover:text-foreground mb-6 transition-colors duration-500" size={28} />
              <h3 className="text-2xl font-bold text-foreground mb-8" style={{ transform: "translateZ(30px)" }}>Quick Facts</h3>
            </div>
            
            <div className="space-y-5 relative z-10" style={{ transform: "translateZ(40px)" }}>
              <div className="flex items-center gap-3 text-sm group/item">
                <MapPin size={14} className="text-muted group-hover/item:text-foreground transition-colors" />
                <span className="text-muted font-mono">Location</span>
                <span className="text-foreground ml-auto font-mono">India 🇮🇳</span>
              </div>
              <div className="w-full h-[1px] bg-border" />
              <div className="flex items-center gap-3 text-sm group/item">
                <GraduationCap size={14} className="text-muted group-hover/item:text-foreground transition-colors" />
                <span className="text-muted font-mono">Education</span>
                <span className="text-foreground ml-auto font-mono">CS Degree</span>
              </div>
              <div className="w-full h-[1px] bg-border" />
              <div className="flex items-center gap-3 text-sm group/item">
                <Briefcase size={14} className="text-muted group-hover/item:text-foreground transition-colors" />
                <span className="text-muted font-mono">Status</span>
                <span className="text-foreground ml-auto font-mono flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Open to Work
                </span>
              </div>
            </div>
          </TiltCard>
        </div>

        {/* Stats Row */}
        <div className="bento-card md:col-span-3">
          <TiltCard tiltAmount={2} className="grid grid-cols-2 md:grid-cols-4 gap-5 bg-card/50 p-3 rounded-3xl border border-border">
            <div className="bg-card rounded-2xl p-6 hover:bg-border/50 hover:border-foreground/20 transition-all duration-500 group text-center" style={{ transform: "translateZ(20px)" }}>
              <div className="text-3xl md:text-4xl font-bold text-foreground font-mono mb-1">
                <CountUp target={15} suffix="+" />
              </div>
              <div className="text-[10px] text-muted font-mono tracking-[0.2em] uppercase">Projects Built</div>
            </div>
            <div className="bg-card rounded-2xl p-6 hover:bg-border/50 hover:border-foreground/20 transition-all duration-500 group text-center" style={{ transform: "translateZ(20px)" }}>
              <div className="text-3xl md:text-4xl font-bold text-foreground font-mono mb-1">
                <CountUp target={2} suffix="+" />
              </div>
              <div className="text-[10px] text-muted font-mono tracking-[0.2em] uppercase">Years Learning</div>
            </div>
            <div className="bg-card rounded-2xl p-6 hover:bg-border/50 hover:border-foreground/20 transition-all duration-500 group text-center" style={{ transform: "translateZ(20px)" }}>
              <div className="text-3xl md:text-4xl font-bold text-foreground font-mono mb-1">
                <CountUp target={10} suffix="+" />
              </div>
              <div className="text-[10px] text-muted font-mono tracking-[0.2em] uppercase">Technologies</div>
            </div>
            <div className="bg-card rounded-2xl p-6 hover:bg-border/50 hover:border-foreground/20 transition-all duration-500 group text-center" style={{ transform: "translateZ(20px)" }}>
              <div className="text-3xl md:text-4xl font-bold text-foreground font-mono mb-1">∞</div>
              <div className="text-[10px] text-muted font-mono tracking-[0.2em] uppercase">Curiosity</div>
            </div>
          </TiltCard>
        </div>

      </div>
    </section>
  );
};

export default AboutBento;
