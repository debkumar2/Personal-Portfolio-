import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Database } from 'lucide-react';
import TiltCard from './TiltCard';

gsap.registerPlugin(ScrollTrigger);

const skillsData = {
  frontend: {
    icon: <Code2 size={16} />,
    color: '#fff',
    skills: [
      { name: 'React.js', level: 90, desc: 'Component architecture, hooks, context, Redux' },
      { name: 'Next.js', level: 85, desc: 'SSR, SSG, API routes, middleware' },
      { name: 'Tailwind CSS', level: 95, desc: 'Utility-first, custom themes, responsive design' },
      { name: 'JavaScript (ES6+)', level: 90, desc: 'Async/await, closures, prototypes, modules' },
      { name: 'Framer Motion', level: 80, desc: 'Spring physics, layout animations, gestures' },
      { name: 'GSAP', level: 70, desc: 'Timelines, ScrollTrigger, complex sequences' },
    ]
  },
  'data & tools': {
    icon: <Database size={16} />,
    color: '#fff',
    skills: [
      { name: 'PostgreSQL', level: 75, desc: 'Joins, views, queries, data extraction' },
      { name: 'Basic Python', level: 65, desc: 'Scripts, data manipulation, automation' },
      { name: 'Git & GitHub', level: 90, desc: 'Branching, PRs, CI/CD workflows' },
      { name: 'Figma', level: 75, desc: 'UI design, prototyping, design systems' },
      { name: 'Power BI', level: 65, desc: 'Dashboards, DAX, data modeling' },
      { name: 'Excel/Sheets', level: 80, desc: 'Pivot tables, VLOOKUP, charts, macros' },
    ]
  }
};

const SkillBar = ({ skill, index, isActive }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group/skill relative p-3 -mx-3 rounded-xl hover:bg-foreground/[0.02] transition-colors duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
          <span className="font-mono text-sm font-semibold text-muted group-hover/skill:text-foreground transition-colors duration-300 whitespace-nowrap">
            {skill.name}
          </span>
          <AnimatePresence>
            {isHovered && (
              <motion.span 
                initial={{ opacity: 0, x: -10, filter: 'blur(4px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: -10, filter: 'blur(4px)' }}
                className="text-xs text-muted font-mono truncate hidden md:block"
              >
                — {skill.desc}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <span className="font-mono text-xs font-bold text-foreground/80 tabular-nums flex-shrink-0">{skill.level}%</span>
      </div>
      
      <div className="h-[4px] w-full bg-border/40 rounded-full overflow-hidden relative shadow-inner">
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isActive ? 1 : 0 }}
          transition={{ duration: 1.2, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="h-full bg-gradient-to-r from-foreground/40 to-foreground origin-left rounded-full relative"
          style={{ width: `${skill.level}%` }}
        >
          {/* Animated glowing tip */}
          <div className="absolute right-0 top-0 bottom-0 w-6 bg-white blur-[3px] opacity-60" />
        </motion.div>
        {/* Glow on hover */}
        <motion.div 
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute top-0 left-0 h-full bg-foreground/30 rounded-full blur-[4px]"
          style={{ width: `${skill.level}%` }}
        />
      </div>
    </motion.div>
  );
};

const TechnicalMatrix = () => {
  const container = useRef();
  const [activeTab, setActiveTab] = useState('frontend');
  const categories = Object.keys(skillsData);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    });

    tl.fromTo('.skills-header', 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    )
    .fromTo('.skills-tabs',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
      '-=0.6'
    )
    .fromTo('.skills-panel',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
      '-=0.5'
    );
  }, { scope: container });

  const activeCategory = skillsData[activeTab];

  return (
    <section id="skills" ref={container} className="py-24 px-6 max-w-6xl mx-auto">
      <div className="skills-header mb-14">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-3 h-3 bg-foreground rounded-full animate-pulse" />
          <span className="font-mono text-xs text-muted tracking-[0.3em] uppercase">My Expertise</span>
        </div>
        <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-heading-start to-heading-end">
          TECHNICAL ARSENAL
        </h2>
        <div className="w-full h-[1px] bg-gradient-to-r from-border to-transparent mt-6" />
      </div>

      {/* Interactive Tab Bar */}
      <div className="skills-tabs flex flex-wrap items-center gap-3 mb-12 p-2 bg-card/40 backdrop-blur-md rounded-2xl border border-border/60 w-fit shadow-xl">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`relative px-6 py-3 rounded-xl font-mono text-sm uppercase tracking-widest transition-all duration-300 ${
              activeTab === cat 
                ? 'text-background font-bold shadow-lg shadow-foreground/20' 
                : 'text-muted hover:text-foreground'
            }`}
          >
            {activeTab === cat && (
              <motion.div
                layoutId="activeSkillTab"
                className="absolute inset-0 bg-foreground rounded-xl"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {skillsData[cat].icon}
              {cat}
            </span>
          </button>
        ))}
      </div>

      {/* Skills Panel */}
      <div className="skills-panel grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        
        {/* Left: Skill Bars */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-2"
            >
              {activeCategory.skills.map((skill, idx) => (
                <SkillBar key={skill.name} skill={skill} index={idx} isActive={true} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: Premium Live Stats Panel */}
        <div className="lg:col-span-5 h-full">
          <AnimatePresence mode="wait">
            <TiltCard
              key={activeTab}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              tiltAmount={3}
              className="bg-card/30 backdrop-blur-xl rounded-[2rem] border border-foreground/10 p-8 h-full flex flex-col justify-between hover:border-foreground/30 transition-all duration-700 group relative overflow-hidden shadow-2xl"
            >
              {/* Ambient Glow Blob */}
              <div className="absolute -top-32 -right-32 w-72 h-72 bg-foreground/[0.07] rounded-full blur-3xl pointer-events-none group-hover:bg-foreground/[0.12] transition-colors duration-700" />
              <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-foreground/[0.04] rounded-full blur-3xl pointer-events-none group-hover:bg-foreground/[0.08] transition-colors duration-700" />
              
              <div className="relative z-10" style={{ transform: "translateZ(40px)" }}>
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 rounded-2xl bg-foreground text-background flex items-center justify-center shadow-lg shadow-foreground/20">
                    {activeCategory.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground uppercase tracking-widest">{activeTab}</h3>
                    <p className="text-xs text-muted font-mono mt-1">LIVESTATS_ACTIVE</p>
                  </div>
                </div>

                {/* Stat numbers */}
                <div className="grid grid-cols-2 gap-8 mb-10">
                  <div className="group/stat">
                    <div className="text-4xl md:text-5xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/50 transition-transform duration-300 group-hover/stat:scale-105 origin-left">
                      {activeCategory.skills.length}
                    </div>
                    <div className="text-[10px] text-muted mt-2 font-mono tracking-[0.2em] uppercase">Total Skills</div>
                  </div>
                  <div className="group/stat">
                    <div className="text-4xl md:text-5xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/50 transition-transform duration-300 group-hover/stat:scale-105 origin-left">
                      {Math.round(activeCategory.skills.reduce((a, s) => a + s.level, 0) / activeCategory.skills.length)}<span className="text-2xl">%</span>
                    </div>
                    <div className="text-[10px] text-muted mt-2 font-mono tracking-[0.2em] uppercase">Avg Mastery</div>
                  </div>
                  <div className="group/stat">
                    <div className="text-4xl md:text-5xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/50 transition-transform duration-300 group-hover/stat:scale-105 origin-left">
                      {Math.max(...activeCategory.skills.map(s => s.level))}<span className="text-2xl">%</span>
                    </div>
                    <div className="text-[10px] text-muted mt-2 font-mono tracking-[0.2em] uppercase">Peak Skill</div>
                  </div>
                  <div className="group/stat">
                    <div className="text-4xl md:text-5xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/50 transition-transform duration-300 group-hover/stat:scale-105 origin-left">
                      {activeCategory.skills.filter(s => s.level >= 80).length}
                    </div>
                    <div className="text-[10px] text-muted mt-2 font-mono tracking-[0.2em] uppercase">Advanced</div>
                  </div>
                </div>

                {/* Premium visual — skill distribution */}
                <div className="pt-8 relative before:absolute before:top-0 before:left-0 before:w-full before:h-[1px] before:bg-gradient-to-r before:from-border before:via-border/50 before:to-transparent">
                  <div className="flex justify-between items-center mb-6">
                    <div className="text-[10px] text-muted font-mono tracking-[0.2em] uppercase">Proficiency Map</div>
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
                  </div>
                  
                  <div className="flex items-end gap-2 h-24">
                    {activeCategory.skills.map((skill, i) => (
                      <motion.div
                        key={skill.name}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="flex-1 bg-gradient-to-t from-foreground/5 to-foreground/20 border-t-2 border-foreground/50 rounded-t-md origin-bottom hover:to-foreground/40 transition-all duration-300 cursor-crosshair relative group/bar shadow-lg"
                        style={{ height: `${skill.level}%` }}
                      >
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-xs font-mono text-background opacity-0 group-hover/bar:opacity-100 group-hover/bar:-translate-y-2 transition-all duration-300 whitespace-nowrap bg-foreground px-2.5 py-1 rounded-md shadow-xl pointer-events-none z-20 font-bold">
                          {skill.level}%
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-3">
                    {activeCategory.skills.map((skill, i) => (
                      <div key={i} className="flex-1 text-[9px] font-mono text-muted text-center truncate group-hover/bar:text-foreground transition-colors">
                        {skill.name.split(' ')[0]}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TiltCard>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default TechnicalMatrix;
