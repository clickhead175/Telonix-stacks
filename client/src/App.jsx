import { useEffect, useState } from 'react';
import { motion, useMotionValue, useScroll, useSpring } from 'motion/react';
import {
  siCss, siDjango, siDocker, siExpress, siFastapi, siGit, siGithub, siHtml5,
  siJavascript, siMongodb, siMysql, siNextdotjs, siNodedotjs, siPostgresql,
  siPython, siReact, siRedis, siTailwindcss, siTypescript, siVercel, siVite,
} from 'simple-icons';
import {
  ArrowDown, ArrowDownRight, ArrowLeft, ArrowUpRight, Check, Code2,
  ExternalLink, Globe2, Layers3, LockKeyhole, Mail, Menu,
  MessageCircle, Moon, Plus, Save, Sparkles, Star, Sun, Trash2, Upload, X,
} from 'lucide-react';

const technologyGroups = [
  {
    name: 'Frontend',
    technologies: [
      { name: 'HTML5', logo: siHtml5 },
      { name: 'CSS3', logo: siCss },
      { name: 'JavaScript', logo: siJavascript },
      { name: 'TypeScript', logo: siTypescript },
      { name: 'React', logo: siReact },
      { name: 'Next.js', logo: siNextdotjs },
      { name: 'Tailwind CSS', logo: siTailwindcss },
      { name: 'Vite', logo: siVite },
    ],
  },
  {
    name: 'Backend',
    technologies: [
      { name: 'Node.js', logo: siNodedotjs },
      { name: 'Express', logo: siExpress },
      { name: 'Python', logo: siPython },
      { name: 'Django', logo: siDjango },
      { name: 'FastAPI', logo: siFastapi },
    ],
  },
  {
    name: 'Databases',
    technologies: [
      { name: 'MongoDB', logo: siMongodb },
      { name: 'PostgreSQL', logo: siPostgresql },
      { name: 'MySQL', logo: siMysql },
      { name: 'Redis', logo: siRedis },
    ],
  },
  {
    name: 'Tools & deployment',
    technologies: [
      { name: 'Git', logo: siGit },
      { name: 'GitHub', logo: siGithub },
      { name: 'Docker', logo: siDocker },
      { name: 'Vercel', logo: siVercel },
    ],
  },
];

const starterImages = [
  '/projects/mak-life.gif',
  '/projects/vouch.gif',
  '/projects/makbpo.gif',
  '/projects/portfolio.gif',
];

const companyName = 'Telonix Stacks';

const initialSettings = {
  name: 'Muhammad Zubair',
  role: 'Full-stack web development company',
  intro: 'We build thoughtful websites and digital products people love to use.',
  about: 'We build useful digital products, from clear marketing sites to data-rich applications. We care about the experience on screen, the engineering underneath it, and the small details that make both feel considered.',
  location: 'Available worldwide',
  availability: 'Available for select projects',
  email: 'telonixstacks@gmail.com',
  linkedin: 'https://www.linkedin.com/in/muhammad-zubair-92aba53a2/',
  whatsapp: '03404615575',
  focus: ['Web design', 'MERN applications', 'Product experiences'],
  socialLinks: [
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/muhammad-zubair-92aba53a2/' },
    { label: 'GitHub', url: 'https://github.com/clickhead175' },
  ],
  testimonials: [],
};

async function request(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  if (response.status === 204) return null;
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Something went wrong.');
  return result;
}

function whatsappUrl(number) {
  const digits = (number || '').replace(/\D/g, '');
  const international = digits.startsWith('0') ? `92${digits.slice(1)}` : digits;
  return `https://wa.me/${international}`;
}

function ExternalAnchor({ href, children, className = '', ...props }) {
  if (!href) return null;
  return <a className={className} href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>;
}

function projectSlug(project) {
  return project._id || project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function companyVoice(text) {
  return text
    .replace(/^I am a full-stack developer\b/, 'We are a full-stack web development company')
    .replace(/\bI turn\b/g, 'We build')
    .replace(/\bI care\b/g, 'We care')
    .replace(/\bI am\b/g, 'We are')
    .replace(/\bI'm\b/g, 'We are')
    .replace(/\bI've\b/g, "We've")
    .replace(/\bmy\b/gi, 'our')
    .replace(/\bI\b/g, 'We');
}

function CursorFollower() {
  const pointerX = useMotionValue(-40);
  const pointerY = useMotionValue(-40);
  const x = useSpring(pointerX, { stiffness: 340, damping: 28, mass: 0.32 });
  const y = useSpring(pointerY, { stiffness: 340, damping: 28, mass: 0.32 });
  const [visible, setVisible] = useState(false);
  const [overControl, setOverControl] = useState(false);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const handleMove = (event) => {
      pointerX.set(event.clientX - 15);
      pointerY.set(event.clientY - 15);
      setVisible(true);
    };
    const handleOver = (event) => setOverControl(event.target instanceof Element && Boolean(event.target.closest('a, button')));
    const handleLeave = () => setVisible(false);
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerover', handleOver);
    window.addEventListener('pointerleave', handleLeave);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerover', handleOver);
      window.removeEventListener('pointerleave', handleLeave);
    };
  }, [pointerX, pointerY]);

  return <motion.div className="cursor-follower" style={{ x, y, opacity: visible ? 1 : 0 }} animate={{ scale: overControl ? 1.65 : 1 }} transition={{ type: 'spring', stiffness: 280, damping: 21 }} aria-hidden="true"><span /></motion.div>;
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  return <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />;
}

function MagneticLink({ href, className, children }) {
  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const x = useSpring(targetX, { stiffness: 280, damping: 18, mass: 0.28 });
  const y = useSpring(targetY, { stiffness: 280, damping: 18, mass: 0.28 });
  const handlePointerMove = (event) => {
    if (event.pointerType === 'touch' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    targetX.set((event.clientX - bounds.left - bounds.width / 2) * 0.12);
    targetY.set((event.clientY - bounds.top - bounds.height / 2) * 0.16);
  };
  const reset = () => { targetX.set(0); targetY.set(0); };
  return <motion.a className={className} href={href} style={{ x, y }} onPointerMove={handlePointerMove} onPointerLeave={reset}>{children}</motion.a>;
}

function Site({ data, loadError }) {
  const settings = { ...initialSettings, ...data.settings };
  settings.testimonials = Array.isArray(data.settings?.testimonials) ? data.settings.testimonials : [];
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All work');
  const [theme, toggleTheme] = usePortfolioTheme();
  const projects = data.projects || [];
  const filters = ['All work', ...new Set(projects.map((project) => project.category).filter(Boolean))];
  const selectedFilter = filters.includes(activeFilter) ? activeFilter : 'All work';
  const shownProjects = selectedFilter === 'All work' ? projects : projects.filter((project) => project.category === selectedFilter);

  useEffect(() => {
    if (selectedFilter !== activeFilter) setActiveFilter(selectedFilter);
  }, [activeFilter, selectedFilter]);

  useEffect(() => {
    document.title = `${companyName} — Full-Stack Web Development`;
  }, []);

  useEffect(() => {
    const revealItems = document.querySelectorAll('[data-reveal]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -24px 0px' });
    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [projects.length, settings.testimonials.length]);

  return (
    <div className="site-shell">
      <CursorFollower />
      <ScrollProgress />
      <header className="site-header">
        <a className="wordmark" href="#home" aria-label={`${companyName}, home`}><CompanyName /></a>
        <button className="menu-toggle icon-button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
        <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">
          <a onClick={() => setMenuOpen(false)} href="#work">Work <span>02</span></a>
          <a onClick={() => setMenuOpen(false)} href="#testimonials">Reviews <span>03</span></a>
          <a onClick={() => setMenuOpen(false)} href="#about">About <span>04</span></a>
          <a onClick={() => setMenuOpen(false)} href="#contact">Contact <span>05</span></a>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
          <a className="nav-cta" onClick={() => setMenuOpen(false)} href="#contact">Let's talk <ArrowUpRight size={15} /></a>
        </nav>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-topline"><p className="eyebrow hero-eyebrow"><span className="status-dot" /> {settings.availability}</p><span className="hero-coordinate">FULL-STACK WEB COMPANY <i>·</i> AVAILABLE WORLDWIDE</span></div>
          <div className="hero-content">
            <h1 className="hero-title"><span>WE MAKE THE WEB</span><span className="hero-title-middle">WORK <i>for</i></span><span className="hero-title-last">PEOPLE<span>.</span></span></h1>
            <div className="hero-lower"><p className="hero-intro">{companyVoice(settings.intro)}</p><div className="hero-actions"><MagneticLink className="button button-lime" href="#work">See what we've built <ArrowDownRight size={17} /></MagneticLink><a className="text-link hero-secondary" href="#contact">Have a project? <ArrowUpRight size={16} /></a></div></div>
          </div>
          <div className="hero-bottom"><span>GOOD WORK. GOOD PEOPLE. GOOD INTERNET.</span><a href="#work">SCROLL TO EXPLORE <ArrowDown size={13} /></a><span>01 — 05</span></div>
          <div className="hero-sticker" aria-hidden="true"><Sparkles size={20} /><span>THOUGHTFUL<br />BY DESIGN</span></div>
        </section>

        <section className="intro-strip" aria-label="Areas of focus">
          <p>GOOD WORK STARTS WITH GOOD QUESTIONS.</p>
          <div className="ticker-window"><div className="ticker-track">{[...settings.focus, ...settings.focus].map((item, index) => <span key={`${item}-${index}`}><Sparkles size={14} />{item}</span>)}</div></div>
        </section>

        <section className="full-stack-section section-pad" id="stack" aria-labelledby="full-stack-title">
          <div className="full-stack-heading" data-reveal><div><p className="eyebrow"><span>01</span> FULL-STACK ECOSYSTEM</p><h2 id="full-stack-title">From interface<br /><em>to infrastructure.</em></h2></div><p>Technologies across the layers of modern web application development.</p></div>
          <div className="technology-groups">{technologyGroups.map((group) => (
            <section className="technology-group" key={group.name} aria-label={group.name}>
              <h3>{group.name}</h3>
              <div className="technology-list">{group.technologies.map(({ name, logo }) => (
                <div className="technology-item" key={name} style={{ '--technology-brand-color': `#${logo.hex}` }}>
                  <span className="technology-logo" aria-hidden="true"><svg viewBox="0 0 24 24"><path d={logo.path} /></svg></span>
                  <span>{name}</span>
                </div>
              ))}</div>
            </section>
          ))}</div>
        </section>

        <section className="work-section section-pad" id="work">
          <div className="section-heading" data-reveal>
            <div><p className="eyebrow"><span>02</span> SELECTED WORK</p><h2>Small details.<br /><span>Real impact.</span></h2></div>
            <p className="section-aside">A few things we've built, shaped, and shipped for our clients.</p>
          </div>
          <div className="work-toolbar">
            <span className="work-count">PROJECTS <b>{String(projects.length).padStart(2, '0')}</b></span>
            <div className="filter-list" aria-label="Filter projects">{filters.map((filter) => <button key={filter} className={selectedFilter === filter ? 'filter-button active' : 'filter-button'} onClick={() => setActiveFilter(filter)}>{filter}</button>)}</div>
          </div>
          <div className="project-grid">
            {shownProjects.map((project, index) => (
              <article className={`project-card project-card-${index + 1}`} data-reveal style={{ '--reveal-delay': `${(index % 2) * 90}ms` }} key={project._id || project.title}>
                <div className="project-image-wrap">
                  {project.imageUrl ? <img className="project-image" src={project.imageUrl} alt={`Live website preview: ${project.title}`} loading="lazy" /> : <div className="project-art-fallback" aria-hidden="true">{project.title.slice(0, 1)}</div>}
                  <span className="project-sticker">{project.featured ? 'FEATURED WORK' : 'SELECTED WORK'}</span>
                  <a className="project-open" href={`/projects/${projectSlug(project)}`}>EXPLORE CASE STUDY <ArrowUpRight size={16} /></a>
                </div>
                <div className="project-meta"><div className="project-copy"><div className="project-heading-row"><h3><a href={`/projects/${projectSlug(project)}`}>{project.title}</a></h3><span>{project.year || '2026'}</span></div><p>{project.description}</p><div className="tech-list">{(project.technologies || []).map((technology) => <span key={technology}>{technology}</span>)}</div></div><span className="project-category">{project.category}</span></div>
              </article>
            ))}
            {shownProjects.length === 0 && <p className="empty-work" role={loadError ? 'alert' : undefined}>{loadError || 'Projects are being updated. Please check back soon.'}</p>}
          </div>
        </section>

        <section className="testimonials-section section-pad" id="testimonials" aria-labelledby="testimonials-title">
          <div className="testimonials-heading" data-reveal>
            <div><p className="eyebrow"><span>03</span> CLIENT FEEDBACK</p><h2 id="testimonials-title">Good work.<br /><em>Good words.</em></h2></div>
            <p>Thoughts shared by the people we’ve had the pleasure of working with.</p>
          </div>
          {settings.testimonials.length ? <div className="testimonials-grid">
            {settings.testimonials.map((testimonial, index) => {
              const rating = Number(testimonial.rating);
              return <article className="testimonial-card" data-reveal style={{ '--reveal-delay': `${(index % 3) * 80}ms` }} key={`${testimonial.name}-${testimonial.company}-${index}`}>
                <div className="testimonial-rating" role="img" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
                  <span className="testimonial-stars" aria-hidden="true">{Array.from({ length: 5 }, (_, starIndex) => {
                    const fill = Math.max(0, Math.min(1, rating - starIndex));
                    return <span className="testimonial-star" key={starIndex}><Star size={16} /><Star className="testimonial-star-fill" size={16} style={{ clipPath: `inset(0 ${(1 - fill) * 100}% 0 0)` }} /></span>;
                  })}</span>
                  <strong>{rating.toFixed(1)}<span> / 5</span></strong>
                </div>
                <blockquote>{testimonial.quote}</blockquote>
                <div className="testimonial-author"><strong>{testimonial.name}</strong><span>{testimonial.company}</span></div>
              </article>;
            })}
          </div> : <p className="testimonials-empty">Client stories will appear here as feedback is added.</p>}
        </section>

        <section className="about-section section-pad" id="about">
          <div className="about-topline" data-reveal><p className="eyebrow"><span>04</span> A LITTLE ABOUT US</p><span className="about-coordinate">31° 32' N&nbsp; / &nbsp;74° 20' E</span></div>
          <div className="about-layout" data-reveal><h2>Curiosity<br />over <em>convention.</em></h2><div className="about-copy"><p className="about-lede">Thoughtful by nature.<br /><span>Practical by design.</span></p><p>{companyVoice(settings.about)}</p><div className="about-signoff"><span className="signature">{companyName}</span><span>Full-stack web development<br />{settings.location}</span></div></div></div>
          <div className="capability-line">{settings.focus.map((item, index) => <span key={item}><b>0{index + 1}</b>{item}<ArrowUpRight size={15} /></span>)}</div>
        </section>

        <section className="contact-section section-pad" id="contact">
          <div className="contact-topline" data-reveal><p className="eyebrow"><span>05</span> OPEN FOR GOOD IDEAS</p><span className="contact-doodle"><Sparkles size={18} /> LET'S MAKE SOMETHING USEFUL</span></div>
          <div className="contact-layout" data-reveal><h2>Have a good<br /><span>one in mind?</span></h2><div className="contact-copy"><p>Tell us what you're working on. A quick note is all it takes to get the ball rolling.</p><a className="email-link" href={`mailto:${settings.email}`}>{settings.email} <ArrowUpRight size={17} /></a><form className="contact-form grid gap-4 rounded-2xl border border-white/10 bg-slate-950/85 p-5 shadow-2xl shadow-black/20" action="https://formspree.io/f/xbggvnpl" method="POST" acceptCharset="UTF-8">
            <input type="hidden" name="_subject" value="New website audit request" />
            <label htmlFor="contact-name">Name<input className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white placeholder:text-slate-500 transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20" id="contact-name" name="name" type="text" autoComplete="name" maxLength="100" placeholder="Your name" required /></label>
            <label htmlFor="contact-email">Email<input className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white placeholder:text-slate-500 transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20" id="contact-email" name="email" type="email" autoComplete="email" maxLength="254" placeholder="you@example.com" required /></label>
            <label htmlFor="contact-phone">Phone<input className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white placeholder:text-slate-500 transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20" id="contact-phone" name="phone" type="tel" autoComplete="tel" maxLength="32" placeholder="Your phone number (optional)" /></label>
            <label htmlFor="contact-message">Message<textarea className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white placeholder:text-slate-500 transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20" id="contact-message" name="message" rows="4" maxLength="3000" placeholder="Tell us what you need..." required /></label>
            <button className="button contact-submit inline-flex w-full items-center justify-center gap-3 rounded-xl border border-blue-300/20 bg-gradient-to-r from-blue-500 to-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300" type="submit">Get My Free Site Audit <ArrowUpRight size={16} /></button>
          </form><div className="contact-actions"><a className="whatsapp-link" href={whatsappUrl(settings.whatsapp)} target="_blank" rel="noreferrer"><MessageCircle size={16} /> Chat with us</a></div></div></div>
          <div className="contact-footer">{(settings.socialLinks || []).map((social) => <a key={`${social.label}-${social.url}`} href={social.url} target="_blank" rel="noopener noreferrer"><ExternalLink size={14} /> {social.label.toUpperCase()}</a>)}<a href={`mailto:${settings.email}`}><Mail size={15} /> EMAIL</a><span>{settings.location}</span><a href="#home">BACK TO TOP <ArrowUpRight size={14} /></a></div>
        </section>
      </main>

      <footer className="site-footer"><span>© {new Date().getFullYear()} {companyName}</span><span>MADE WITH CARE · AVAILABLE WORLDWIDE</span><a href="/admin" aria-label="Open admin panel"><LockKeyhole size={13} /> ADMIN</a></footer>
    </div>
  );
}

function ProjectDetail({ project, projects, settings, loading, loadError }) {
  const [theme, toggleTheme] = usePortfolioTheme();
  useEffect(() => {
    document.title = project ? `${project.title} | ${companyName}` : `Project | ${companyName}`;
  }, [project]);

  if (loading) return <main className="case-loading" aria-live="polite">Loading project details…</main>;
  if (loadError) return <main className="case-not-found"><a href="/#work"><ArrowLeft size={16} /> Back to selected work</a><h1>Project details are unavailable.</h1><p>{loadError}</p></main>;
  if (!project) return <main className="case-not-found"><a href="/#work"><ArrowLeft size={16} /> Back to selected work</a><h1>This project isn't here.</h1><p>It may have been removed or the link may have changed.</p></main>;

  const projectIndex = projects.findIndex((item) => (project._id ? item._id === project._id : item.title === project.title));
  const nextProject = projects.length > 1 ? projects[(projectIndex + 1) % projects.length] : null;

  return (
    <div className="site-shell case-shell">
      <CursorFollower />
      <ScrollProgress />
      <header className="site-header">
        <a className="wordmark" href="/#home" aria-label={`${companyName}, home`}><CompanyName /></a>
        <nav className="main-nav" aria-label="Project navigation"><a href="/#work">All work</a><a href="/#stack">Stack</a><ThemeToggle theme={theme} onToggle={toggleTheme} /><a className="nav-cta" href="/#contact">Let's talk <ArrowUpRight size={15} /></a></nav>
      </header>
      <main>
        <section className="case-heading section-pad">
          <div className="case-breadcrumb"><a href="/#work"><ArrowLeft size={15} /> ALL PROJECTS</a><span>CASE STUDY / {String(projectIndex + 1).padStart(2, '0')}</span></div>
          <p className="eyebrow"><span>{project.category}</span> <i>·</i> {project.year}</p>
          <h1>{project.title}</h1>
          <div className="case-intro-row"><p>{project.description}</p><div className="case-tech-list">{(project.technologies || []).map((technology) => <span key={technology}>{technology}</span>)}</div></div>
        </section>
        <section className="case-visual" aria-label={`${project.title} project preview`}>
          {project.imageUrl ? <img src={project.imageUrl} alt={`Full website preview for ${project.title}`} /> : <div className="case-image-fallback">{project.title.slice(0, 1)}</div>}
          <div className="case-visual-label"><span>LIVE PROJECT PREVIEW</span><span>{project.client || project.title}</span></div>
        </section>
        <section className="case-overview section-pad">
          <div><p className="eyebrow"><span>PROJECT OVERVIEW</span></p><h2>Made to solve<br /><em>a real need.</em></h2></div>
          <div className="case-overview-copy"><p>{project.description}</p><dl className="case-facts"><div><dt>Our role</dt><dd>{project.role || 'Project development'}</dd></div><div><dt>Category</dt><dd>{project.category || 'Web development'}</dd></div><div><dt>Year</dt><dd>{project.year || '2026'}</dd></div><div><dt>Tools</dt><dd>{(project.technologies || []).join(' · ') || 'Digital experience'}</dd></div></dl><div className="case-story-grid">{project.challenge && <article><span>THE CHALLENGE</span><p>{project.challenge}</p></article>}{project.approach && <article><span>THE APPROACH</span><p>{project.approach}</p></article>}{project.outcome && <article><span>THE OUTCOME</span><p>{project.outcome}</p></article>}</div></div>
        </section>
        <section className="case-actions section-pad"><div><p className="eyebrow">A GOOD FIT FOR YOUR NEXT PROJECT?</p><h2>Let's make it<br /><em>happen.</em></h2></div><div className="case-action-links"><ExternalAnchor className="button button-lime" href={project.liveUrl}>Visit the live project <ArrowUpRight size={16} /></ExternalAnchor>{project.sourceUrl && <ExternalAnchor className="text-link" href={project.sourceUrl}>View source code <ExternalLink size={15} /></ExternalAnchor>}{nextProject && <a className="case-next" href={`/projects/${projectSlug(nextProject)}`}><span>UP NEXT</span><strong>{nextProject.title}</strong><ArrowUpRight size={17} /></a>}</div></section>
      </main>
      <footer className="site-footer"><span>© {new Date().getFullYear()} {companyName}</span><a href={`mailto:${settings.email}`}>{settings.email}</a><a href="/#work">ALL PROJECTS <ArrowUpRight size={13} /></a></footer>
    </div>
  );
}

function ProjectStoryFields({ projectForm, onChange }) {
  const update = (field, value) => onChange({ ...projectForm, [field]: value });
  return (
    <details className="project-story-editor">
      <summary><span>CASE STUDY STORY</span><span>OPTIONAL DETAILS <ArrowDown size={14} /></span></summary>
      <p>These notes appear on the project detail page. Keep them specific and honest.</p>
      <div className="project-story-grid">
        <label>Client / company<input maxLength="100" value={projectForm.client || ''} onChange={(event) => update('client', event.target.value)} placeholder="Company or personal project" /></label>
        <label>Your role<input maxLength="90" value={projectForm.role || ''} onChange={(event) => update('role', event.target.value)} placeholder="e.g. Front-end development" /></label>
        <label>The challenge<textarea rows="3" maxLength="1000" value={projectForm.challenge || ''} onChange={(event) => update('challenge', event.target.value)} placeholder="What problem needed to be solved?" /></label>
        <label>Your approach<textarea rows="3" maxLength="1000" value={projectForm.approach || ''} onChange={(event) => update('approach', event.target.value)} placeholder="How did you approach the work?" /></label>
        <label>The outcome<textarea rows="3" maxLength="600" value={projectForm.outcome || ''} onChange={(event) => update('outcome', event.target.value)} placeholder="What does the finished experience make possible?" /></label>
      </div>
    </details>
  );
}

function ProfileExtras({ settings, setSettings, onSave, busy }) {
  const socialLinks = settings.socialLinks || [];
  const testimonials = settings.testimonials || [];
  const updateSocial = (index, field, value) => setSettings({ ...settings, socialLinks: socialLinks.map((social, row) => row === index ? { ...social, [field]: value } : social) });
  const updateTestimonial = (index, field, value) => setSettings({ ...settings, testimonials: testimonials.map((testimonial, row) => row === index ? { ...testimonial, [field]: value } : testimonial) });

  return (
    <form className="profile-editor admin-form profile-extras" onSubmit={onSave}>
      <div className="editor-heading"><div><span>CLIENT STORIES & SOCIALS</span><h2>Share real feedback.</h2></div><span className="editor-number">02</span></div>
      <p className="extras-note">Only publish customer feedback and ratings you have permission to share.</p>
      <div className="testimonial-edit-list">{testimonials.map((testimonial, index) => <fieldset className="testimonial-edit-card" key={`testimonial-${index}`}>
        <legend>Testimonial {String(index + 1).padStart(2, '0')}</legend>
        <label>Customer name<input maxLength="100" value={testimonial.name} onChange={(event) => updateTestimonial(index, 'name', event.target.value)} required /></label>
        <label>Company<input maxLength="100" value={testimonial.company} onChange={(event) => updateTestimonial(index, 'company', event.target.value)} required /></label>
        <label>Rating out of 5<input type="number" min="1" max="5" step="0.1" value={testimonial.rating} onChange={(event) => updateTestimonial(index, 'rating', event.target.value === '' ? '' : Number(event.target.value))} required /></label>
        <label>Approved customer quote<textarea rows="4" maxLength="600" value={testimonial.quote} onChange={(event) => updateTestimonial(index, 'quote', event.target.value)} required /></label>
        <button className="remove-row-button testimonial-remove" type="button" aria-label={`Remove testimonial from ${testimonial.name || 'customer'}`} onClick={() => setSettings({ ...settings, testimonials: testimonials.filter((_, row) => row !== index) })}><Trash2 size={15} /> Remove</button>
      </fieldset>)}</div>
      <button className="add-project-button" type="button" disabled={testimonials.length >= 12} onClick={() => setSettings({ ...settings, testimonials: [...testimonials, { name: '', company: '', rating: 5, quote: '' }] })}><Plus size={15} /> Add testimonial</button>
      <div className="social-edit-heading"><h3>Social profiles</h3><span>{socialLinks.length} / 12</span></div>
      <div className="social-edit-list">{socialLinks.map((social, index) => <div className="social-edit-row" key={`${social.label}-${index}`}><label>Platform<input maxLength="40" value={social.label} onChange={(event) => updateSocial(index, 'label', event.target.value)} required /></label><label>Profile URL<input type="url" maxLength="300" value={social.url} onChange={(event) => updateSocial(index, 'url', event.target.value)} placeholder="https://…" required /></label><button className="remove-row-button" type="button" aria-label={`Remove ${social.label} link`} onClick={() => setSettings({ ...settings, socialLinks: socialLinks.filter((_, row) => row !== index) })}><X size={15} /></button></div>)}</div>
      <button className="add-project-button" type="button" disabled={socialLinks.length >= 12} onClick={() => setSettings({ ...settings, socialLinks: [...socialLinks, { label: '', url: '' }] })}><Plus size={15} /> Add social link</button>
      <div className="form-actions"><button className="button button-dark" disabled={busy}>{busy ? 'Saving…' : <>Save testimonials & socials <Save size={16} /></>}</button></div>
    </form>
  );
}

function ProjectImagePicker({ imageUrl, uploading, onPick }) {
  return (
    <div className="device-image-picker">
      <div className="device-image-preview">{imageUrl ? <img src={imageUrl} alt="Selected project preview" /> : <span>No project image selected</span>}</div>
      <div className="device-image-actions"><div><strong>Project cover</strong><span>JPEG, PNG or WebP · up to 4 MB</span></div><label className="file-pick-button"><input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading} onChange={(event) => { onPick(event.target.files?.[0]); event.target.value = ''; }} /><Upload size={15} />{uploading ? 'Uploading…' : 'Choose from device'}</label></div>
    </div>
  );
}

const emptyProject = { title: '', client: '', category: 'WEB DEVELOPMENT', description: '', role: '', challenge: '', approach: '', outcome: '', technologies: '', liveUrl: '', sourceUrl: '', imageUrl: '', year: String(new Date().getFullYear()), featured: false, sortOrder: 0 };

function Admin() {
  const [theme, toggleTheme] = usePortfolioTheme();
  const [session, setSession] = useState(null);
  const [login, setLogin] = useState({ email: '', password: '' });
  const [settings, setSettings] = useState(initialSettings);
  const [projects, setProjects] = useState([]);
  const [editing, setEditing] = useState(null);
  const [projectForm, setProjectForm] = useState(emptyProject);
  const [tab, setTab] = useState('projects');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const uploadProjectImage = async (file) => {
    if (!file) return;
    setUploadingImage(true);
    setNotice('');
    try {
      const imageUrl = await saveImageFile(file);
      setProjectForm((current) => ({ ...current, imageUrl }));
      setNotice('Image uploaded. Save the project to publish it.');
    } catch (error) {
      setNotice(error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const loadPortfolio = async () => {
    const data = await loadPortfolioData();
    setSettings({ ...initialSettings, ...data.settings });
    setProjects(data.projects || []);
  };

  useEffect(() => {
    let cancelled = false;
    request('/api/admin/session').then((current) => {
      if (cancelled) return;
      if (current.authenticated) setSession(current);
      return loadPortfolio();
    }).catch((error) => {
      if (!cancelled) setNotice(error.message);
    });
    return () => { cancelled = true; };
  }, []);

  const submitLogin = async (event) => {
    event.preventDefault();
    setBusy(true);
    setNotice('');
    try {
      const current = await request('/api/admin/login', { method: 'POST', body: JSON.stringify(login) });
      setSession(current);
      await loadPortfolio();
    } catch (error) {
      setNotice(error.message);
    } finally {
      setBusy(false);
    }
  };

  const saveSettings = async (event) => {
    event.preventDefault();
    setBusy(true);
    setNotice('');
    try {
      const payload = { ...settings, focus: String(settings.focus).split(',').map((item) => item.trim()).filter(Boolean) };
      const updated = await request('/api/admin/settings', { method: 'PUT', body: JSON.stringify(payload) });
      setSettings(updated);
      setNotice('Profile details saved.');
    } catch (error) {
      setNotice(error.message);
    } finally {
      setBusy(false);
    }
  };

  const saveProfileExtras = async (event) => {
    event.preventDefault();
    setBusy(true);
    setNotice('');
    try {
      const updated = await request('/api/admin/settings', { method: 'PUT', body: JSON.stringify({ socialLinks: settings.socialLinks, testimonials: settings.testimonials || [] }) });
      setSettings({ ...settings, ...updated });
      setNotice('Testimonials and social links saved.');
    } catch (error) {
      setNotice(error.message);
    } finally {
      setBusy(false);
    }
  };

  const saveProject = async (event) => {
    event.preventDefault();
    setBusy(true);
    setNotice('');
    const payload = { ...projectForm, technologies: String(projectForm.technologies).split(',').map((item) => item.trim()).filter(Boolean) };
    try {
      await request(editing ? `/api/admin/projects/${editing}` : '/api/admin/projects', { method: editing ? 'PUT' : 'POST', body: JSON.stringify(payload) });
      await loadPortfolio();
      setEditing(null);
      setProjectForm(emptyProject);
      setNotice(editing ? 'Project updated.' : 'Project added.');
    } catch (error) {
      setNotice(error.message);
    } finally {
      setBusy(false);
    }
  };

  const editProject = (project) => {
    setEditing(project._id);
    setProjectForm({ ...project, technologies: (project.technologies || []).join(', ') });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteProject = async (project) => {
    if (!window.confirm(`Delete “${project.title}”? This cannot be undone.`)) return;
    try {
      await request(`/api/admin/projects/${project._id}`, { method: 'DELETE' });
      await loadPortfolio();
      setNotice('Project deleted.');
    } catch (error) {
      setNotice(error.message);
    }
  };

  const logout = async () => {
    await request('/api/admin/logout', { method: 'POST' }).catch(() => {});
    setSession(null);
  };

  if (!session) return (
    <main className="admin-login-page">
      <a className="admin-back" href="/"><ArrowLeft size={16} /> Back to portfolio</a>
      <div className="login-panel"><a className="wordmark login-wordmark" href="/"><CompanyName /></a><ThemeToggle theme={theme} onToggle={toggleTheme} /><p className="eyebrow"><span>PRIVATE AREA</span></p><h1>Good to have<br />you <em>back.</em></h1><p className="login-description">Sign in to keep your portfolio up to date.</p>
        <form className="admin-form" onSubmit={submitLogin}><label>Email address<input type="email" autoComplete="username" required value={login.email} onChange={(event) => setLogin({ ...login, email: event.target.value })} /></label><label>Password<input type="password" autoComplete="current-password" required value={login.password} onChange={(event) => setLogin({ ...login, password: event.target.value })} /></label><button className="button button-lime admin-submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'} <ArrowUpRight size={16} /></button></form>
        {notice && <p className="form-notice" role="alert">{notice}</p>}<p className="login-footnote"><LockKeyhole size={13} /> Protected access · no public sign-up</p>
      </div>
      <div className="login-side"><span>YOUR WORK,<br />YOUR STORY.</span><span>ADMINISTRATION / 01</span></div>
    </main>
  );

  return (
    <main className="admin-page">
      <aside className="admin-sidebar"><a className="wordmark admin-wordmark" href="/"><CompanyName /></a><span className="admin-label">WORKSPACE</span><button className={tab === 'projects' ? 'side-link active' : 'side-link'} onClick={() => { setTab('projects'); setEditing(null); }}><Layers3 size={17} /> Projects <span>{projects.length}</span></button><button className={tab === 'profile' ? 'side-link active' : 'side-link'} onClick={() => setTab('profile')}><Globe2 size={17} /> Profile & links</button><div className="sidebar-bottom"><a href="/" target="_blank" rel="noreferrer"><ExternalLink size={15} /> View portfolio</a><button onClick={logout}><ArrowLeft size={15} /> Sign out</button><span>SIGNED IN AS<br />{session.email}</span></div></aside>
      <section className="admin-main"><header className="admin-topbar"><div><span className="admin-breadcrumb">PORTFOLIO / {tab === 'projects' ? 'PROJECTS' : 'PROFILE'}</span><p>Good things take shape here.</p></div><div className="admin-topbar-actions"><ThemeToggle theme={theme} onToggle={toggleTheme} /><a className="view-live" href="/" target="_blank" rel="noreferrer">View live site <ArrowUpRight size={15} /></a></div></header>
        <div className="admin-content"><div className="admin-page-title"><div><p className="eyebrow"><span>MANAGE YOUR SITE</span></p><h1>{tab === 'projects' ? 'Your projects' : 'Your profile'}</h1></div><span className="admin-live"><i /> LIVE CONTENT</span></div>
          {tab === 'projects' && <ProjectStoryFields projectForm={projectForm} onChange={setProjectForm} />}
          {tab === 'projects' && <ProjectImagePicker imageUrl={projectForm.imageUrl} uploading={uploadingImage} onPick={uploadProjectImage} />}
          {notice && <div className="admin-notice" role="status"><Check size={16} /> {notice}<button onClick={() => setNotice('')} aria-label="Dismiss message"><X size={15} /></button></div>}
          {tab === 'projects' ? <div className="admin-project-layout"><div className="project-editor"><div className="editor-heading"><div><span>{editing ? 'EDIT PROJECT' : 'NEW ENTRY'}</span><h2>{editing ? 'Make it yours.' : 'Add to the story.'}</h2></div><span className="editor-number">{editing ? '02' : '01'}</span></div>
            <form className="admin-form" onSubmit={saveProject}><label>Project name<input required maxLength="100" value={projectForm.title} onChange={(event) => setProjectForm({ ...projectForm, title: event.target.value })} placeholder="e.g. Northstar Commerce" /></label><div className="form-row"><label>Category<input maxLength="50" value={projectForm.category} onChange={(event) => setProjectForm({ ...projectForm, category: event.target.value })} /></label><label>Year<input maxLength="4" value={projectForm.year} onChange={(event) => setProjectForm({ ...projectForm, year: event.target.value })} /></label></div><label>Short description<textarea required maxLength="1000" rows="4" value={projectForm.description} onChange={(event) => setProjectForm({ ...projectForm, description: event.target.value })} placeholder="What did you make, and why does it matter?" /></label><label>Technologies <span className="field-hint">comma separated</span><input value={projectForm.technologies} onChange={(event) => setProjectForm({ ...projectForm, technologies: event.target.value })} placeholder="React, Express, MongoDB" /></label><label>Live project URL <span className="field-hint">optional</span><input type="url" value={projectForm.liveUrl} onChange={(event) => setProjectForm({ ...projectForm, liveUrl: event.target.value })} placeholder="https://yourproject.com" /></label><label>Source code URL <span className="field-hint">optional</span><input type="url" value={projectForm.sourceUrl} onChange={(event) => setProjectForm({ ...projectForm, sourceUrl: event.target.value })} placeholder="https://github.com/you/project" /></label><label>Preview image URL <span className="field-hint">optional</span><input type="text" inputMode="url" value={projectForm.imageUrl} onChange={(event) => setProjectForm({ ...projectForm, imageUrl: event.target.value })} placeholder="https://… or /projects/image.webp" /></label><label className="check-label"><input type="checkbox" checked={Boolean(projectForm.featured)} onChange={(event) => setProjectForm({ ...projectForm, featured: event.target.checked })} /> Feature this project</label><div className="form-actions"><button className="button button-dark" disabled={busy || uploadingImage}>{busy ? 'Saving…' : <>{editing ? 'Save changes' : 'Add project'} <Save size={16} /></>}</button>{editing && <button className="cancel-button" type="button" onClick={() => { setEditing(null); setProjectForm(emptyProject); }}>Cancel</button>}</div></form>
          </div><div className="admin-project-list"><div className="list-heading"><div><span>YOUR PORTFOLIO</span><h2>{projects.length} projects</h2></div><button className="add-project-button" onClick={() => { setEditing(null); setProjectForm(emptyProject); }}><Plus size={16} /> New project</button></div>{projects.map((project) => <article className="admin-project-row" key={project._id || project.title}><div className="admin-project-thumb"><img src={project.imageUrl || starterImages[projects.indexOf(project) % starterImages.length]} alt="" /></div><div className="admin-project-info"><span>{project.client || project.category || 'WEB DEVELOPMENT'} · {project.year}</span><h3>{project.title}</h3><div>{(project.technologies || []).slice(0, 3).map((tech) => <i key={tech}>{tech}</i>)}</div></div><div className="row-actions"><button onClick={() => editProject(project)} aria-label={`Edit ${project.title}`}><Code2 size={16} /></button>{project._id && <button onClick={() => deleteProject(project)} aria-label={`Delete ${project.title}`}><Trash2 size={16} /></button>}</div></article>)}</div></div> : <form className="profile-editor admin-form" onSubmit={saveSettings}><div className="editor-heading"><div><span>PUBLIC DETAILS</span><h2>Make it personal.</h2></div><span className="editor-number">01</span></div><div className="profile-form-grid"><label>Your name<input required maxLength="80" value={settings.name} onChange={(event) => setSettings({ ...settings, name: event.target.value })} /></label><label>Professional title<input required maxLength="100" value={settings.role} onChange={(event) => setSettings({ ...settings, role: event.target.value })} /></label><label>Availability status<input maxLength="100" value={settings.availability} onChange={(event) => setSettings({ ...settings, availability: event.target.value })} /></label><label>Location<input maxLength="100" value={settings.location} onChange={(event) => setSettings({ ...settings, location: event.target.value })} /></label><label className="full-field">Introduction<textarea rows="3" maxLength="320" value={settings.intro} onChange={(event) => setSettings({ ...settings, intro: event.target.value })} /></label><label className="full-field">About you<textarea rows="5" maxLength="1200" value={settings.about} onChange={(event) => setSettings({ ...settings, about: event.target.value })} /></label><label>Email address<input type="email" required value={settings.email} onChange={(event) => setSettings({ ...settings, email: event.target.value })} /></label><label>WhatsApp number<input value={settings.whatsapp} onChange={(event) => setSettings({ ...settings, whatsapp: event.target.value })} /></label><label className="full-field">Focus areas <span className="field-hint">comma separated</span><input value={Array.isArray(settings.focus) ? settings.focus.join(', ') : settings.focus} onChange={(event) => setSettings({ ...settings, focus: event.target.value })} /></label></div><div className="form-actions"><button className="button button-dark" disabled={busy}>{busy ? 'Saving…' : <>Save profile <Save size={16} /></>}</button></div></form>}
          {tab === 'profile' && <ProfileExtras settings={settings} setSettings={setSettings} onSave={saveProfileExtras} busy={busy} />}
        </div>
      </section>
    </main>
  );
}

export default function App() {
  const [data, setData] = useState({ settings: initialSettings, projects: [] });
  const [portfolioLoaded, setPortfolioLoaded] = useState(false);
  const [portfolioError, setPortfolioError] = useState('');

  useEffect(() => {
    let cancelled = false;
    loadPortfolioData()
      .then((portfolio) => {
        if (cancelled) return;
        setData(portfolio);
        setPortfolioError('');
      })
      .catch(() => {
        if (!cancelled) setPortfolioError('Portfolio data could not be loaded. Check that the server is running, then refresh.');
      })
      .finally(() => {
        if (!cancelled) setPortfolioLoaded(true);
      });
    return () => { cancelled = true; };
  }, []);

  if (window.location.pathname.startsWith('/admin')) return <Admin />;
  const projectRoute = window.location.pathname.match(/^\/projects\/([^/]+)\/?$/);
  if (projectRoute) {
    const reference = decodeURIComponent(projectRoute[1]);
    const project = data.projects.find((item) => item._id ? item._id === reference : projectSlug(item) === reference);
    return <ProjectDetail project={project} projects={data.projects} settings={{ ...initialSettings, ...data.settings }} loading={!portfolioLoaded} loadError={portfolioError} />;
  }
  return <Site data={data} loadError={portfolioError} />;
}

function usePortfolioTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem('portfolio-theme') === 'dark' ? 'dark' : 'light');
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('portfolio-theme', theme);
  }, [theme]);
  return [theme, () => setTheme((current) => current === 'light' ? 'dark' : 'light')];
}

function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark';
  return <button className="theme-toggle" type="button" onClick={onToggle} aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'} title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}>{isDark ? <Sun size={16} /> : <Moon size={16} />}<span>{isDark ? 'LIGHT' : 'DARK'}</span></button>;
}

function CompanyName() {
  return <span className="company-name"><span className="company-initial">{companyName[0]}</span>{companyName.slice(1)}</span>;
}

async function loadPortfolioData() {
  return request('/api/portfolio');
}

async function saveImageFile(file) {
  const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!acceptedTypes.includes(file.type) || file.size > 4 * 1024 * 1024) throw new Error('Choose a JPEG, PNG, or WebP image up to 4 MB.');
  const formData = new FormData();
  formData.append('image', file);
  const response = await fetch('/api/admin/uploads/project-image', { method: 'POST', credentials: 'same-origin', body: formData });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Image upload failed.');
  return result.imageUrl;
}