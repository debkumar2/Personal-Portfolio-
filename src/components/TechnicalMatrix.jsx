import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import TiltCard from './TiltCard';

gsap.registerPlugin(ScrollTrigger);

const skillsData = {
  frontend: {
    icon: '◆',
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
  backend: {
    icon: '▲',
    color: '#fff',
    skills: [
      { name: 'Node.js', level: 85, desc: 'Express, REST APIs, middleware chains' },
      { name: 'Express.js', level: 85, desc: 'Routing, authentication, error handling' },
      { name: 'MongoDB', level: 80, desc: 'Aggregation, indexing, Mongoose ODM' },
      { name: 'PostgreSQL', level: 75, desc: 'Joins, views, migrations, Prisma ORM' },
      { name: 'Firebase', level: 80, desc: 'Firestore, Auth, hosting, cloud functions' },
      { name: 'REST APIs', level: 90, desc: 'Design, versioning, documentation, testing' },
    ]
  },
  'data & tools': {
    icon: '●',
    color: '#fff',
    skills: [
      { name: 'Python (Pandas)', level: 70, desc: 'Data wrangling, analysis, visualization' },
      { name: 'Git & GitHub', level: 90, desc: 'Branching, PRs, CI/CD workflows' },
      { name: 'Figma', level: 75, desc: 'UI design, prototyping, design systems' },
      { name: 'Power BI', level: 65, desc: 'Dashboards, DAX, data modeling' },
      { name: 'Postman', level: 85, desc: 'API testing, collections, environments' },
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
      transition={{ delay: index * 0.05, duration: 0.4, ease: 'easeOut' }}
      className="group/skill relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm text-muted group-hover/skill:text-foreground transition-colors duration-300">
            {skill.name}
          </span>
          <AnimatePresence>
            {isHovered && (
              <motion.span 
                initial={{ opacity: 0, x: -10, width: 0 }}
                animate={{ opacity: 1, x: 0, width: 'auto' }}
                exit={{ opacity: 0, x: -10, width: 0 }}
                className="text-xs text-muted font-mono overflow-hidden whitespace-nowrap"
              >
                — {skill.desc}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <span className="font-mono text-xs text-foreground/60 tabular-nums">{skill.level}%</span>
      </div>
      
      <div className="h-[3px] w-full bg-border rounded-full overflow-hidden relative">
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isActive ? 1 : 0 }}
          transition={{ duration: 1.2, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="h-full bg-foreground origin-left rounded-full"
          style={{ width: `${skill.level}%` }}
        />
        {/* Glow on hover */}
        <motion.div 
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute top-0 left-0 h-full bg-foreground/20 rounded-full blur-sm"
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
    <section id="skills" ref={container} className="py-20 px-6 max-w-6xl mx-auto">
      <div className="skills-header mb-12">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-heading-start to-heading-end">
          TECHNICAL ARSENAL
        </h2>
        <div className="w-full h-[1px] bg-border mt-6" />
      </div>

      {/* Interactive Tab Bar */}
      <div className="skills-tabs flex items-center gap-2 mb-10 p-1.5 bg-foreground/[0.03] rounded-2xl border border-border w-fit">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`relative px-6 py-3 rounded-xl font-mono text-xs uppercase tracking-widest transition-all duration-300 ${
              activeTab === cat 
                ? 'text-background' 
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
              <span>{skillsData[cat].icon}</span>
              {cat}
            </span>
          </button>
        ))}
      </div>

      {/* Skills Panel */}
      <div className="skills-panel grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-0">
        
        {/* Left: Skill Bars */}
        <div className="space-y-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              {activeCategory.skills.map((skill, idx) => (
                <SkillBar key={skill.name} skill={skill} index={idx} isActive={true} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: Live Stats Panel */}
        <div className="mt-10 md:mt-0">
          <AnimatePresence mode="wait">
            <TiltCard
              key={activeTab}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              tiltAmount={2}
              className="bg-card rounded-3xl border border-border p-8 h-full flex flex-col justify-between hover:border-foreground/20 transition-colors duration-500 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-foreground/0 to-foreground/0 group-hover:from-foreground/[0.03] group-hover:to-transparent transition-all duration-500 pointer-events-none" />
              
              <div className="relative z-10" style={{ transform: "translateZ(30px)" }}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">{activeCategory.icon}</span>
                  <h3 className="text-xl font-bold text-foreground uppercase tracking-wider">{activeTab}</h3>
                </div>

                {/* Stat numbers */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div>
                    <div className="text-3xl font-bold text-foreground font-mono">
                      {activeCategory.skills.length}
                    </div>
                    <div className="text-xs text-muted mt-1 font-mono tracking-wider">SKILLS</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-foreground font-mono">
                      {Math.round(activeCategory.skills.reduce((a, s) => a + s.level, 0) / activeCategory.skills.length)}%
                    </div>
                    <div className="text-xs text-muted mt-1 font-mono tracking-wider">AVG MASTERY</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-foreground font-mono">
                      {Math.max(...activeCategory.skills.map(s => s.level))}%
                    </div>
                    <div className="text-xs text-muted mt-1 font-mono tracking-wider">PEAK SKILL</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-foreground font-mono">
                      {activeCategory.skills.filter(s => s.level >= 80).length}
                    </div>
                    <div className="text-xs text-muted mt-1 font-mono tracking-wider">ADVANCED</div>
                  </div>
                </div>

                {/* Mini visual — skill distribution */}
                <div className="border-t border-border pt-6">
                  <div className="text-xs text-muted font-mono mb-4 tracking-wider">PROFICIENCY MAP</div>
                  <div className="flex items-end gap-1.5 h-20">
                    {activeCategory.skills.map((skill, i) => (
                      <motion.div
                        key={skill.name}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="flex-1 bg-border rounded-t-sm origin-bottom hover:bg-foreground/30 transition-colors duration-300 cursor-crosshair relative group/bar"
                        style={{ height: `${skill.level}%` }}
                        title={`${skill.name}: ${skill.level}%`}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-mono text-background opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap bg-foreground/80 px-2 py-1 rounded">
                          {skill.level}%
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex gap-1.5 mt-2">
                    {activeCategory.skills.map((skill, i) => (
                      <div key={i} className="flex-1 text-[8px] font-mono text-muted text-center truncate">
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
