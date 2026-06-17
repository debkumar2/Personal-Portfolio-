import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail } from 'lucide-react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import TiltCard from './TiltCard';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const container = useRef();
  const [status, setStatus] = useState(''); // '', 'loading', 'success', 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const response = await fetch("https://formsubmit.co/ajax/debkumarmondal111@gmail.com", {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            name: e.target.name.value,
            email: e.target.email.value,
            message: e.target.message.value
        })
      });
      
      if (response.ok) {
        setStatus('success');
        e.target.reset();
        setTimeout(() => setStatus(''), 5000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus(''), 5000);
      }
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus(''), 5000);
    }
  };

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    });

    tl.fromTo('.contact-header', 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    )
    .fromTo('.contact-bento', 
      { y: 80, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 1, stagger: 0.15, ease: 'power4.out' },
      "-=0.6"
    );
  }, { scope: container });

  return (
    <section id="contact" ref={container} className="py-20 px-6 max-w-6xl mx-auto border-t border-border mt-12 relative">
      <div className="contact-header mb-12">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-heading-start to-heading-end">
          GET IN TOUCH
        </h2>
        <div className="w-full h-[1px] bg-border mt-6" />
      </div>
      
      <div className="grid md:grid-cols-5 gap-6">
        
        {/* Contact Info Bento */}
        <div className="contact-bento md:col-span-2 h-full">
          <TiltCard tiltAmount={3} className="bg-card rounded-3xl p-8 border border-border flex flex-col justify-between group hover:border-foreground/30 transition-colors duration-500 relative overflow-hidden h-full">
            <div className="absolute inset-0 bg-gradient-to-tr from-foreground/0 to-foreground/0 group-hover:from-foreground/5 group-hover:to-transparent transition-all duration-500 pointer-events-none" />
            <div className="relative z-10" style={{ transform: "translateZ(30px)" }}>
              <p className="text-muted font-sans leading-relaxed mb-10 text-lg">
                I'm currently open to new opportunities and collaborations. Whether you have a project in mind or just want to say hi, I'll try my best to get back to you!
              </p>
              
              <a 
                href="mailto:debkumarmondal111@gmail.com" 
                className="inline-flex items-center gap-2 sm:gap-4 text-sm sm:text-base md:text-xl lg:text-2xl font-bold text-foreground hover:text-foreground/80 transition-colors mb-16 break-words w-full group/mail"
              >
                <Mail size={24} className="text-foreground flex-shrink-0 group-hover/mail:scale-110 transition-transform hidden sm:block" />
                <Mail size={20} className="text-foreground flex-shrink-0 group-hover/mail:scale-110 transition-transform sm:hidden" />
                <span className="truncate">debkumarmondal111@gmail.com</span>
              </a>
            </div>

            <div className="flex gap-4 relative z-10" style={{ transform: "translateZ(40px)" }}>
              <a href="https://github.com/debkumar2" target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-border rounded-2xl flex items-center justify-center text-muted hover:bg-foreground hover:text-background transition-all hover:-translate-y-1">
                <FaGithub size={24} />
              </a>
              <a href="https://linkedin.com/in/debkumarmondal" target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-border rounded-2xl flex items-center justify-center text-muted hover:bg-foreground hover:text-background transition-all hover:-translate-y-1">
                <FaLinkedin size={24} />
              </a>
              <a href="https://twitter.com/debkumarmondal" target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-border rounded-2xl flex items-center justify-center text-muted hover:bg-foreground hover:text-background transition-all hover:-translate-y-1">
                <FaTwitter size={24} />
              </a>
            </div>
          </TiltCard>
        </div>

        {/* Form Bento */}
        <div className="contact-bento md:col-span-3 h-full">
          <TiltCard tiltAmount={2} className="h-full">
            <form onSubmit={handleSubmit} className="bg-gradient-to-br from-card to-background p-8 rounded-3xl border border-border flex flex-col gap-6 group hover:border-foreground/30 transition-colors duration-500 relative overflow-hidden h-full">
              <div className="absolute inset-0 bg-gradient-to-bl from-foreground/0 to-foreground/0 group-hover:from-foreground/5 group-hover:to-transparent transition-all duration-500 pointer-events-none" />
              <div className="grid md:grid-cols-2 gap-6 relative z-10" style={{ transform: "translateZ(20px)" }}>
                <div className="relative group/input">
                  <input 
                    type="text" 
                    id="name"
                    required
                    className="w-full bg-border/50 border border-border rounded-xl focus:border-foreground py-4 px-4 outline-none transition-colors text-foreground font-mono peer"
                    placeholder=" "
                  />
                  <label htmlFor="name" className="absolute left-4 top-4 text-muted font-mono transition-all peer-focus:-top-3 peer-focus:left-2 peer-focus:text-xs peer-focus:bg-card peer-focus:px-2 peer-focus:text-foreground peer-valid:-top-3 peer-valid:left-2 peer-valid:text-xs peer-valid:bg-card peer-valid:px-2">Name</label>
                </div>
                <div className="relative group/input">
                  <input 
                    type="email" 
                    id="email"
                    required
                    className="w-full bg-border/50 border border-border rounded-xl focus:border-foreground py-4 px-4 outline-none transition-colors text-foreground font-mono peer"
                    placeholder=" "
                  />
                  <label htmlFor="email" className="absolute left-4 top-4 text-muted font-mono transition-all peer-focus:-top-3 peer-focus:left-2 peer-focus:text-xs peer-focus:bg-card peer-focus:px-2 peer-focus:text-foreground peer-valid:-top-3 peer-valid:left-2 peer-valid:text-xs peer-valid:bg-card peer-valid:px-2">Email</label>
                </div>
              </div>
              <div className="relative group/input flex-grow z-10" style={{ transform: "translateZ(20px)" }}>
                <textarea 
                  id="message"
                  required
                  className="w-full h-full min-h-[150px] bg-border/50 border border-border rounded-xl focus:border-foreground py-4 px-4 outline-none transition-colors text-foreground font-mono resize-none peer"
                  placeholder=" "
                />
                <label htmlFor="message" className="absolute left-4 top-4 text-muted font-mono transition-all peer-focus:-top-3 peer-focus:left-2 peer-focus:text-xs peer-focus:bg-card peer-focus:px-2 peer-focus:text-foreground peer-valid:-top-3 peer-valid:left-2 peer-valid:text-xs peer-valid:bg-card peer-valid:px-2">Message</label>
              </div>
              <button 
                type="submit" 
                disabled={status === 'loading'}
                className={`w-full relative z-10 font-bold py-4 rounded-xl transition-all font-mono text-lg uppercase tracking-wider ${
                  status === 'loading' ? 'bg-foreground/50 text-background cursor-not-allowed' :
                  status === 'success' ? 'bg-green-500 text-white' :
                  status === 'error' ? 'bg-red-500 text-white' :
                  'bg-foreground text-background hover:bg-foreground/80 hover:scale-[1.02] active:scale-[0.98]'
                }`}
                style={{ transform: "translateZ(30px)" }}
              >
                {status === 'loading' ? 'Sending...' : 
                 status === 'success' ? 'Message Sent!' : 
                 status === 'error' ? 'Error! Try Again' : 
                 'Send Message'}
              </button>
            </form>
          </TiltCard>
        </div>
      </div>
      
      <div className="mt-20 text-center text-muted font-mono text-sm border-t border-border pt-8">
        <p>Built with <span className="text-foreground">React</span> & <span className="text-foreground">GSAP</span>.</p>
      </div>
    </section>
  );
};

export default Contact;
