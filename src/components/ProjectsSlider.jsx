import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import TiltCard from './TiltCard';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: "01",
    title: "CommodityChain",
    desc: "Real-time commodity intelligence platform with live prices, AI-driven insights, and interactive charts.",
    stack: ["React", "Node.js", "MongoDB", "WebSockets"],
    link: "#",
    github: "#",
    colSpan: "md:col-span-2",
    bg: "bg-gradient-to-br from-card to-background"
  },
  {
    id: "02",
    title: "Banking Dashboard",
    desc: "Financial analytics dashboard tracking NPA recovery, profit growth.",
    stack: ["Next.js", "Tailwind", "FastAPI"],
    link: "#",
    github: "#",
    colSpan: "md:col-span-1",
    bg: "bg-card"
  },
  {
    id: "03",
    title: "Dollar Hegemony Index",
    desc: "ML-driven study of USD dominance using a custom Index.",
    stack: ["Python", "TensorFlow", "React"],
    link: "#",
    github: "#",
    colSpan: "md:col-span-1",
    bg: "bg-card"
  },
  {
    id: "04",
    title: "Neural Engine",
    desc: "Custom lightweight neural network framework built from scratch in C++ for edge devices.",
    stack: ["C++", "CUDA", "CMake"],
    link: "#",
    github: "#",
    colSpan: "md:col-span-2",
    bg: "bg-gradient-to-tr from-card to-background"
  }
];

const ProjectCard = ({ project }) => {
  return (
    <div className={`project-card ${project.colSpan}`}>
      <TiltCard 
        tiltAmount={5}
        className={`group relative overflow-hidden rounded-3xl border border-border ${project.bg} min-h-[350px] p-8 flex flex-col justify-between hover:border-foreground/30 transition-colors duration-500`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/0 to-foreground/0 group-hover:from-foreground/5 group-hover:to-transparent transition-all duration-500 pointer-events-none" />
        
        <div className="relative z-10 flex justify-between items-start" style={{ transform: "translateZ(30px)" }}>
          <span className="font-mono text-sm text-muted group-hover:text-foreground transition-colors">{project.id}</span>
          <div className="flex gap-3">
            <a href={project.github} className="w-10 h-10 rounded-full bg-border flex items-center justify-center text-muted hover:bg-foreground hover:text-background transition-all">
              <FaGithub size={18} />
            </a>
            <a href={project.link} className="w-10 h-10 rounded-full bg-border flex items-center justify-center text-muted hover:bg-foreground hover:text-background transition-all">
              <ExternalLink size={18} />
            </a>
          </div>
        </div>

        <div className="relative z-10 mt-12" style={{ transform: "translateZ(50px)" }}>
          <h3 className="text-3xl font-bold text-foreground mb-4 tracking-tight">{project.title}</h3>
          <p className="text-muted text-sm md:text-base leading-relaxed mb-8 max-w-lg">
            {project.desc}
          </p>
          
          <div className="flex flex-wrap gap-2">
            {project.stack.map(tech => (
              <span key={tech} className="px-3 py-1 bg-border border border-border rounded-full font-mono text-xs text-muted">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </TiltCard>
    </div>
  );
};

const ProjectsSlider = () => {
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

    tl.fromTo('.projects-header', 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    )
    .fromTo('.project-card', 
      { y: 80, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 1, stagger: 0.15, ease: 'power4.out' },
      "-=0.6"
    );
  }, { scope: container });

  return (
    <section id="projects" ref={container} className="py-20 px-6 max-w-6xl mx-auto" style={{ perspective: "1000px" }}>
      <div className="projects-header mb-12">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-heading-start to-heading-end">
          FEATURED WORK
        </h2>
        <div className="w-full h-[1px] bg-border mt-6" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
};

export default ProjectsSlider;
