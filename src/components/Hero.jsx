/* eslint-disable */
import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ─────────────── Reactive Wave Mesh ─────────────── */
const WaveMesh = () => {
  const mesh = useRef();
  const { pointer } = useThree();
  const mousePos = useRef({ x: 0, y: 0 });

  // Create the plane geometry with enough segments for smooth deformation
  const geometry = useMemo(() => new THREE.PlaneGeometry(14, 14, 50, 50), []);
  const originalPositions = useMemo(() => {
    return new Float32Array(geometry.attributes.position.array);
  }, [geometry]);

  useFrame((state) => {
    if (!mesh.current) return;

    // Smooth mouse interpolation
    mousePos.current.x += (pointer.x * 5 - mousePos.current.x) * 0.05;
    mousePos.current.y += (pointer.y * 5 - mousePos.current.y) * 0.05;

    const positions = mesh.current.geometry.attributes.position.array;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < positions.length; i += 3) {
      const ox = originalPositions[i];
      const oy = originalPositions[i + 1];

      // Distance from mouse
      const dx = ox - mousePos.current.x;
      const dy = oy - mousePos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Mouse ripple - creates a wave around cursor
      const mouseWave = Math.exp(-dist * 0.4) * Math.sin(dist * 2 - time * 3) * 0.35;

      // Ambient wave motion
      const wave1 = Math.sin(ox * 0.4 + time * 0.6) * 0.08;
      const wave2 = Math.cos(oy * 0.3 + time * 0.4) * 0.08;
      const wave3 = Math.sin((ox + oy) * 0.2 + time * 0.5) * 0.05;

      positions[i + 2] = mouseWave + wave1 + wave2 + wave3;
    }

    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <mesh ref={mesh} rotation={[-Math.PI / 2.5, 0, 0]} position={[0, -2, -1]}>
      <primitive object={geometry} attach="geometry" />
      <meshBasicMaterial color="#888888" wireframe transparent opacity={0.06} />
    </mesh>
  );
};

/* ─────────────── Constellation Particles ─────────────── */
const ConstellationParticles = () => {
  const groupRef = useRef();
  const linesRef = useRef();
  const count = 35;
  const connectionDistance = 2.8;
  const { pointer } = useThree();

  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 14,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 6
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.005,
          (Math.random() - 0.5) * 0.005,
          (Math.random() - 0.5) * 0.003
        ),
        size: Math.random() * 0.04 + 0.01,
      });
    }
    return arr;
  }, []);

  const pointsGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    particles.forEach((p, i) => {
      positions[i * 3] = p.position.x;
      positions[i * 3 + 1] = p.position.y;
      positions[i * 3 + 2] = p.position.z;
      sizes[i] = p.size;
    });
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [particles]);

  useFrame((state) => {
    const positions = pointsGeometry.attributes.position.array;
    const mouseX = pointer.x * 5;
    const mouseY = pointer.y * 4;

    // Update particle positions
    particles.forEach((p, i) => {
      // Drift
      p.position.add(p.velocity);

      // Mouse attraction
      const dx = mouseX - p.position.x;
      const dy = mouseY - p.position.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 4) {
        p.position.x += dx * 0.002;
        p.position.y += dy * 0.002;
      }

      // Boundary wrap
      if (p.position.x > 7) p.position.x = -7;
      if (p.position.x < -7) p.position.x = 7;
      if (p.position.y > 5) p.position.y = -5;
      if (p.position.y < -5) p.position.y = 5;

      positions[i * 3] = p.position.x;
      positions[i * 3 + 1] = p.position.y;
      positions[i * 3 + 2] = p.position.z;
    });
    pointsGeometry.attributes.position.needsUpdate = true;

    // Draw connection lines
    if (linesRef.current) {
      const linePositions = [];
      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const dx = particles[i].position.x - particles[j].position.x;
          const dy = particles[i].position.y - particles[j].position.y;
          const dz = particles[i].position.z - particles[j].position.z;
          const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (d < connectionDistance) {
            linePositions.push(
              particles[i].position.x, particles[i].position.y, particles[i].position.z,
              particles[j].position.x, particles[j].position.y, particles[j].position.z
            );
          }
        }
      }
      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
      linesRef.current.geometry.dispose();
      linesRef.current.geometry = lineGeo;
    }
  });

  return (
    <>
      <points geometry={pointsGeometry}>
        <pointsMaterial size={0.05} color="#888888" transparent opacity={0.8} sizeAttenuation />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial color="#888888" transparent opacity={0.15} />
      </lineSegments>
    </>
  );
};

/* ─────────────── Combined Scene ─────────────── */
const Background3D = () => {
  return (
    <>
      <WaveMesh />
      <ConstellationParticles />
    </>
  );
};

/* ─────────────── Text Scramble Hook ─────────────── */
const useTextScramble = (text, trigger = true) => {
  const [displayed, setDisplayed] = useState('');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';

  useEffect(() => {
    if (!trigger) return;
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayed(
        text.split('').map((char, i) => {
          if (char === ' ') return ' ';
          if (i < iteration) return text[i];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('')
      );
      iteration += 1 / 2;
      if (iteration >= text.length) {
        clearInterval(interval);
        setDisplayed(text);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [text, trigger]);

  return displayed;
};

/* ─────────────── Marquee Component ─────────────── */
const Marquee = () => {
  const items = ['FRONTEND DEVELOPER', '✦', 'DATA ANALYST', '✦', 'UI ENGINEER', '✦', 'REACT SPECIALIST', '✦'];
  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div className="hero-marquee w-full overflow-hidden border-y border-white/5 py-5 mt-16">
      <div className="marquee-track flex items-center gap-12 whitespace-nowrap">
        {repeated.map((item, i) => (
          <span
            key={i}
            className={`text-xl md:text-2xl font-bold tracking-widest ${
              item === '✦' ? 'text-foreground/30 text-sm' : 'text-foreground/20 hover:text-foreground transition-colors duration-300'
            }`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ─────────────── Main Hero ─────────────── */
const Hero = () => {
  const container = useRef();
  const [roleIndex, setRoleIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const roles = ['PIXEL-PERFECT UIs', 'DATA DASHBOARDS', 'WEB EXPERIENCES', 'REACT APPS'];

  const scrambledName1 = useTextScramble('DEBKUMAR', isLoaded);
  const scrambledName2 = useTextScramble('MONDAL.', isLoaded);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  useGSAP(() => {
    // Entrance timeline
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.fromTo('.hero-badge',
      { y: 50, opacity: 0, scale: 0.8 },
      { y: 0, opacity: 1, scale: 1, duration: 1 }
    )
    .fromTo('.hero-name',
      { y: 120, opacity: 0, skewY: 8 },
      { y: 0, opacity: 1, skewY: 0, duration: 1.4, stagger: 0.12 },
      '-=0.6'
    )
    .fromTo('.hero-role-bar',
      { width: 0, opacity: 0 },
      { width: '100%', opacity: 1, duration: 1.2 },
      '-=1'
    )
    .fromTo('.hero-bio',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 },
      '-=0.8'
    )
    .fromTo('.hero-btn',
      { y: 30, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.12, ease: 'back.out(1.7)' },
      '-=0.6'
    )
    .fromTo('.hero-marquee',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 },
      '-=0.5'
    )
    .fromTo('.hero-stat',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 },
      '-=0.8'
    );

    // Marquee infinite scroll
    gsap.to('.marquee-track', {
      xPercent: -50,
      ease: 'none',
      duration: 30,
      repeat: -1,
    });


  }, { scope: container });

  return (
    <section ref={container} className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">

      {/* 3D Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 7], fov: 45 }} dpr={[1, 1.5]}>
          <Background3D />
        </Canvas>
      </div>

      {/* Content */}
      <div className="max-w-7xl w-full z-10 flex flex-col items-center text-center mt-28">

        {/* Badge */}
        <div className="hero-badge mb-6">
          <div className="px-5 py-2.5 border border-border rounded-full bg-foreground/[0.03] backdrop-blur-xl text-[11px] tracking-[0.3em] font-mono text-muted flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-foreground animate-pulse shadow-[0_0_12px_var(--fg)]" />
            FRONTEND DEVELOPER · DATA ANALYST
          </div>
        </div>

        {/* Name with scramble effect */}
        <div className="overflow-hidden">
          <h1 className="hero-name hero-name-1 text-[4.5rem] md:text-[9rem] lg:text-[12rem] font-bold tracking-tighter leading-[0.85] text-foreground font-mono select-none">
            {scrambledName1}
          </h1>
        </div>
        <div className="overflow-hidden">
          <h1 className="hero-name hero-name-2 text-[4.5rem] md:text-[9rem] lg:text-[12rem] font-bold tracking-tighter leading-[0.85] select-none text-muted opacity-80" style={{
            background: 'linear-gradient(90deg, var(--muted) 0%, var(--fg) 30%, var(--muted) 60%, var(--fg) 80%, var(--muted) 100%)',
            backgroundSize: '200% 100%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'shimmer 4s ease-in-out infinite',
          }}>
            {scrambledName2}
          </h1>
        </div>

        {/* Vertical scrolling role */}
        <div className="hero-content-fade">
          <div className="hero-role-bar mt-8 flex items-center justify-center gap-4 text-lg md:text-2xl font-mono border-t border-b border-border py-4">
            <span className="text-muted tracking-widest">I CRAFT</span>
            <div className="h-8 md:h-9 overflow-hidden relative w-[250px] md:w-[340px]">
              <div
                className="flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.87,0,0.13,1)]"
                style={{ transform: `translateY(-${roleIndex * 36}px)` }}
              >
                {roles.map((role, i) => (
                  <div key={i} className="h-8 md:h-9 flex items-center justify-center text-foreground font-bold whitespace-nowrap tracking-wider">
                    {role}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bio */}
          <p className="hero-bio mt-6 text-base md:text-lg text-muted font-sans max-w-xl mx-auto leading-relaxed">
            Frontend developer who breathes React & pixel-perfect design. Aspiring data analyst turning raw numbers into visual stories. Based in India.
          </p>

          {/* CTA */}
          <div className="flex items-center gap-5 mt-10 justify-center flex-wrap">
            <a href="#projects" className="hero-btn group relative px-8 py-4 bg-foreground text-background rounded-full font-bold text-base overflow-hidden">
              <span className="relative z-10">View Projects</span>
              <div className="absolute inset-0 bg-muted translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </a>
            <a href="#contact" className="hero-btn px-8 py-4 border border-border text-foreground rounded-full font-bold text-base hover:bg-foreground hover:text-background transition-all duration-300">
              Let's Talk
            </a>
            <a href="https://github.com/debkumar2" target="_blank" rel="noopener noreferrer" className="hero-btn w-14 h-14 border border-border rounded-full flex items-center justify-center text-muted hover:bg-foreground hover:text-background transition-all duration-300">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
          </div>
        </div>
      </div>

      {/* Marquee */}
      <Marquee />

      {/* Stats strip */}
      <div className="hero-content-fade w-full max-w-4xl mx-auto grid grid-cols-3 gap-6 mt-10 mb-6 z-10">
        <div className="hero-stat text-center">
          <div className="text-3xl md:text-4xl font-bold text-foreground font-mono">15+</div>
          <div className="text-xs text-muted mt-1 tracking-widest uppercase font-mono">Projects</div>
        </div>
        <div className="hero-stat text-center border-x border-border">
          <div className="text-3xl md:text-4xl font-bold text-foreground font-mono">2+</div>
          <div className="text-xs text-muted mt-1 tracking-widest uppercase font-mono">Years Exp</div>
        </div>
        <div className="hero-stat text-center">
          <div className="text-3xl md:text-4xl font-bold text-foreground font-mono">∞</div>
          <div className="text-xs text-muted mt-1 tracking-widest uppercase font-mono">Curiosity</div>
        </div>
      </div>

    </section>
  );
};

export default Hero;
