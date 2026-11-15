import { useEffect, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { galleryArtworks, type GalleryArtwork } from "./app/data/gallery.data";
import { heroArtworks, dockTools } from "./app/data/portfolio.data";
import type { GitHubCommit, GitHubRepository, ModrinthProject } from "./app/data/projects.models";

type Filter = "all" | "code" | "art";
type ToastFn = (message: string) => void;

const Icon = ({ name, className = "icon" }: { name: string; className?: string }) => (
  <svg className={className} aria-hidden="true"><use href={`#${name}`} /></svg>
);

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [workOpen, setWorkOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const mobileToggle = useRef<HTMLButtonElement>(null);
  const workToggle = useRef<HTMLButtonElement>(null);
  const close = () => { setMobileOpen(false); setWorkOpen(false); };
  useEffect(() => {
    const pointer = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) close(); };
    const key = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (workOpen) { setWorkOpen(false); workToggle.current?.focus(); }
      else if (mobileOpen) { setMobileOpen(false); mobileToggle.current?.focus(); }
    };
    document.addEventListener("pointerdown", pointer);
    document.addEventListener("keydown", key);
    return () => { document.removeEventListener("pointerdown", pointer); document.removeEventListener("keydown", key); };
  }, [workOpen, mobileOpen]);
  return <div className="header-shell" ref={root}>
    <header className="site-header">
      <a className="wordmark" href="#home" aria-label="pxdritz, home" onClick={close}>pxdritz<span>.</span></a>
      <nav className="desktop-nav" aria-label="Main navigation">
        <div className="nav-dropdown">
          <button ref={workToggle} id="work-menu-toggle" className="nav-link" type="button" aria-controls="work-submenu" aria-expanded={workOpen} onClick={() => setWorkOpen(v => !v)}>Explore <Icon name="chevron" /></button>
          <div id="work-submenu" className="submenu" hidden={!workOpen}>
            <a href="#about" onClick={close}><span>01</span> About Chloe <Icon name="arrow" /></a>
            <a href="#work" onClick={close}><span>02</span> Selected work <Icon name="arrow" /></a>
            <a href="#art" onClick={close}><span>03</span> Art &amp; wallpapers <Icon name="arrow" /></a>
          </div>
        </div>
        <a className="nav-link" href="#work" onClick={close}>Work</a>
        <a className="nav-link" href="#about" onClick={close}>About</a>
        <a className="nav-link nav-contact" href="#contact" onClick={close}>Say hello <Icon name="arrow" /></a>
      </nav>
      <button ref={mobileToggle} id="menu-toggle" className="menu-toggle" type="button" aria-label="Open navigation" aria-controls="site-menu" aria-expanded={mobileOpen} onClick={() => { setMobileOpen(v => !v); setWorkOpen(false); }}><span/><span/></button>
    </header>
    <nav id="site-menu" className="mobile-menu" aria-label="Expanded navigation" hidden={!mobileOpen}>
      <a href="#about" onClick={close}>About Chloe <span>01</span></a>
      <a href="#work" onClick={close}>Selected work <span>02</span></a>
      <a href="#art" onClick={close}>Art &amp; wallpapers <span>03</span></a>
      <a href="#contact" onClick={close}>Say hello <span>04</span></a>
      <p>Chloe / pxdritz · she/her</p>
    </nav>
  </div>;
}

function Hero({ notify }: { notify: ToastFn }) {
  const [index, setIndex] = useState(0);
  const [treatment, setTreatment] = useState<"original" | "poster">("original");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const artwork = heroArtworks[index];
  const next = async () => {
    if (busy) return;
    const nextIndex = (index + 1) % heroArtworks.length;
    setBusy(true); setError("");
    try {
      await new Promise<void>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve();
        image.onerror = () => reject(new Error("Artwork failed to load"));
        image.src = heroArtworks[nextIndex].displaySrc;
      });
      setIndex(nextIndex);
    } catch { setError("This artwork could not be loaded. Please try again."); notify("This artwork could not be loaded. Please try again."); }
    finally { setBusy(false); }
  };
  return <section id="home" className="hero" data-chapter data-bg="#fafafa" aria-labelledby="hero-title">
    <div className="intro" data-reveal><img src="assets/avatar.jpg" alt="" width="40" height="40" fetchPriority="high"/><span>Chloe <span className="muted">/ pxdritz</span></span><span className="intro-pronouns">she / her</span></div>
    <h1 id="hero-title" data-type-reveal><span className="title-line title-line-primary">soft ideas.</span><span className="title-line title-line-secondary">sharp tools.</span></h1>
    <p className="hero-description" data-reveal>I’m a developer and artist making Minecraft mods,<br className="desktop-break"/> useful little tools, and things worth looking at.</p>
    <div className="hero-actions" data-reveal><a className="button button-primary" href="#work">View selected work <Icon name="next"/></a><a className="text-link" href="#about">A little about me <Icon name="arrow"/></a></div>
    <div className="hero-art" data-ink={treatment} data-reveal><img id="hero-image" src={artwork.displaySrc} alt={artwork.alt} width="1586" height="992" fetchPriority="high"/><button id="shuffle-art" className="round-button" type="button" aria-label="Show next artwork" aria-busy={busy} onClick={next}><Icon name="next"/></button></div>
    <div className="art-toolbar" data-reveal><div className="art-credit"><span className="credit-index">{String(index+1).padStart(2,"0")} / {String(heroArtworks.length).padStart(2,"0")}</span><span>{artwork.title}</span></div><div className="ink-control" role="group" aria-label="Artwork treatment"><button type="button" aria-pressed={treatment==="original"} onClick={() => setTreatment("original")}>Original</button><button type="button" aria-pressed={treatment==="poster"} onClick={() => setTreatment("poster")}>Ink study</button></div></div>
    <p className="sr-only" role="status" aria-live="polite">{error}</p>
  </section>;
}

const tastes = [
  { label:"Tea breaks", caption:"Tea is one of my favourite things. A quiet pause between ideas." },
  { label:"New places", caption:"I love travelling. New places tend to bring new perspectives." },
  { label:"JoJo’s", caption:"My wallpapers probably gave it away. A little JoJo is always welcome." },
  { label:"Helping beginners", caption:"Helping beginners find their way is part of what I love about code." },
  { label:"Quiet moments", caption:"A moment to be still. I also like meditating." },
];

function About() {
  const [taste, setTaste] = useState(0);
  const [caption, setCaption] = useState("A few things I like working with.");
  const dock = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = dock.current;
    if (!element) return;
    const items = [...element.querySelectorAll<HTMLElement>("[data-dock-index]")];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hover = window.matchMedia("(hover: hover) and (pointer: fine)");
    const states = items.map(() => ({scale:1,lift:0,shift:0}));
    let pointerX: number | null = null, focused = -1, frame = 0, last = 0, centers: number[] = [];
    const setDescription = (index:number) => setCaption(index >= 0 ? dockTools[index].description : "A few things I like working with.");
    const getCenters = () => {
      const left = element.getBoundingClientRect().left;
      return items.map(item => left + item.offsetLeft + item.offsetWidth / 2);
    };
    const animate = (time:number) => {
      frame = 0;
      const elapsed = last ? Math.min(40,time-last) : 16.67; last=time;
      const blend=1-Math.exp(-elapsed/52);
      if (!centers.length) centers=getCenters();
      const target=pointerX ?? (focused>=0 ? centers[focused] : null);
      const scales=centers.map(center => {
        const distance=target===null ? Infinity : Math.abs(center-target);
        const influence=distance<190 ? Math.exp(-(distance**2)/(2*54**2)) : 0;
        return !reduced.matches && hover.matches ? 1+0.32*influence : 1;
      });
      const extra=scales.map((scale,i)=>(scale-1)*items[i].offsetWidth);
      const total=extra.reduce((a,b)=>a+b,0); let leftExtra=0, unsettled=false;
      items.forEach((item,i)=>{
        const state=states[i], scale=scales[i];
        const targets={scale,lift:-37.5*(scale-1),shift:(2*leftExtra+extra[i]-total)/2}; leftExtra+=extra[i];
        (["scale","lift","shift"] as const).forEach(key=>{
          const delta=targets[key]-state[key];
          state[key]=reduced.matches || Math.abs(delta)<0.002 ? targets[key] : state[key]+delta*blend;
          if(Math.abs(targets[key]-state[key])>0.002) unsettled=true;
        });
        item.style.transform=`translate(${state.shift.toFixed(3)}px, ${state.lift.toFixed(3)}px) scale(${state.scale.toFixed(4)})`;
      });
      if(unsettled) frame=requestAnimationFrame(animate); else last=0;
    };
    const queue=()=>{ if(!frame) frame=requestAnimationFrame(animate); };
    const move=(event:PointerEvent)=>{
      if(event.pointerType==="touch") return;
      pointerX=event.clientX;
      const item=(event.target as HTMLElement).closest<HTMLElement>("[data-dock-index]");
      if(item) setDescription(Number(item.dataset.dockIndex));
      queue();
    };
    const leave=()=>{pointerX=null;setDescription(focused);queue();};
    const focusIn=(event:FocusEvent)=>{
      const item=(event.target as HTMLElement).closest<HTMLElement>("[data-dock-index]");
      if(!item) return;
      focused=Number(item.dataset.dockIndex); pointerX=null; setDescription(focused); queue();
    };
    const focusOut=(event:FocusEvent)=>{
      if((event.relatedTarget as HTMLElement|null)?.closest("[data-dock-index]")) return;
      focused=-1; if(pointerX===null) setDescription(-1); queue();
    };
    const resize=()=>{centers=[];queue();};
    element.addEventListener("pointermove",move); element.addEventListener("pointerleave",leave);
    element.addEventListener("focusin",focusIn); element.addEventListener("focusout",focusOut);
    window.addEventListener("resize",resize);
    return ()=>{element.removeEventListener("pointermove",move);element.removeEventListener("pointerleave",leave);element.removeEventListener("focusin",focusIn);element.removeEventListener("focusout",focusOut);window.removeEventListener("resize",resize);if(frame)cancelAnimationFrame(frame);};
  },[]);
  return <section id="about" className="about section-card" data-chapter data-bg="#f5f5f7" aria-labelledby="about-title">
    <div className="section-heading" data-reveal><span className="eyebrow">01 / A little about me</span><a className="text-link" href="https://edonme.dev" target="_blank" rel="noreferrer">COO at EdonMe <Icon name="arrow"/></a></div>
    <div className="about-copy" data-reveal><h2 id="about-title">Curious by default.</h2><div><p>I’m Chloe. I build mods and useful little tools with Java, Kotlin, Go and Rust. I also make wallpapers and commissioned art.</p><p className="muted">Simple solutions, elegant code, and visual details that feel a little alive.</p></div></div>
    <div className="personal-notes" data-reveal><h3>Outside the editor</h3><div className="taste-chips" role="group" aria-label="Chloe's interests">{tastes.map((item,i)=><button key={item.label} type="button" aria-pressed={taste===i} onClick={()=>setTaste(i)}>{item.label}</button>)}</div><p id="taste-caption" aria-live="polite">{tastes[taste].caption}</p></div>
    <div className="orbit" data-reveal><div className="orbit-heading"><h3>In my orbit.</h3><p>Languages, tools &amp; a few creative companions.</p></div><div className="dock-wrap"><div id="dock" className="dock" aria-label="Languages and tools" ref={dock}>
      {dockTools.map((tool,i)=><ReactDockItem key={tool.name} tool={tool} index={i}/>)}
    </div></div><p id="dock-caption" className="dock-caption" aria-live="polite">{caption}</p></div>
  </section>;
}
function ReactDockItem({tool,index}:{tool:(typeof dockTools)[number];index:number}) {
 return <><a className="dock-item" href={tool.href} target="_blank" rel="noreferrer" data-dock-index={index} data-name={tool.name} aria-label={tool.name} title={tool.name}><span className="dock-icon"><img src={`assets/${tool.icon}`} alt="" width="34" height="34"/></span><span className="dock-tooltip">{tool.name}</span></a>{index===4&&<span className="dock-divider" aria-hidden="true"/>}</>;
}

function Projects({notify}:{notify:ToastFn}) {
 const [filter,setFilter]=useState<Filter>("all");
 const [modrinth,setModrinth]=useState<ModrinthProject[]>([]);
 const [github,setGithub]=useState<GitHubRepository[]>([]);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState(false);
 const load=async()=>{
  setLoading(true);setError(false);
  const user="pxotitas";
  const get=async<T,>(url:string):Promise<T>=>{
   const response=await fetch(url);if(!response.ok)throw new Error(String(response.status));return response.json() as Promise<T>;
  };
  const [mods,repos]=await Promise.allSettled([
   get<ModrinthProject[]>("https://api.modrinth.com/v2/user/pxotitas/projects"),
   get<GitHubRepository[]>(`https://api.github.com/users/${user}/repos?sort=updated&per_page=100`)
  ]);
  const modData=mods.status==="fulfilled"?mods.value:[];
  const repoData=repos.status==="fulfilled"?repos.value:[];
  setModrinth(modData);setGithub(repoData.map(repo=>({...repo,commits:[]})));
  setError(mods.status==="rejected"||repos.status==="rejected");setLoading(false);
  if(repoData.length){
   const commits=await Promise.all(repoData.slice(0,10).map(repo=>get<GitHubCommit[]>(`https://api.github.com/repos/${user}/${repo.name}/commits?per_page=3`).catch(()=>[])));
   setGithub(current=>current.map((repo,i)=>({...repo,commits:commits[i]??[]})));
  }
 };
 useEffect(()=>{void load();},[]);
 return <section id="work" className="work" data-chapter data-bg="#fafafa" aria-labelledby="work-title">
  <div className="section-heading" data-reveal><div><span className="eyebrow">02 / Selected work</span><h2 id="work-title">Ideas, made useful.</h2></div><div className="filter-control" role="group" aria-label="Filter projects">{(["all","code","art"] as Filter[]).map((value)=><button key={value} type="button" aria-pressed={filter===value} onClick={()=>setFilter(value)}>{value==="all"?"All work":value==="code"?"Code":"Art"}</button>)}</div></div>
  {filter!=="art"&&<article className="project-featured" data-reveal><div className="project-intro"><div><h3>BrainShake</h3><p>Notes, sketches and connected ideas.<br/>A freeform canvas that stays yours.</p></div><a className="button button-secondary" href="https://pxotitas.github.io/BrainShake/" target="_blank" rel="noreferrer">Try BrainShake <Icon name="arrow"/></a></div><a className="project-preview" href="https://pxotitas.github.io/BrainShake/" target="_blank" rel="noreferrer" aria-label="Open BrainShake"><img src="assets/brainshake-preview.png" alt="Actual BrainShake interface showing a freeform canvas and notes" width="1378" height="757" loading="lazy"/></a><div className="project-meta"><span>TypeScript · React · Local-first</span><a className="text-link" href="https://github.com/pxotitas/BrainShake" target="_blank" rel="noreferrer">View the source <Icon name="arrow"/></a></div></article>}
  <div className="project-list" data-reveal>
   {filter!=="art"&&<><a className="project-row" href="https://github.com/pxotitas/rusted-light" target="_blank" rel="noreferrer"><span className="project-number">01</span><div><h3>Rusted Light</h3><p>A quick little launcher for Linux.</p></div><span className="project-technology">Rust · GTK4</span><span className="row-arrow"><Icon name="arrow"/></span></a><a className="project-row" href="https://github.com/pxotitas/chloe-s-design-hub" target="_blank" rel="noreferrer"><span className="project-number">02</span><div><h3>Chloe’s design hub</h3><p>A growing home for creative tools.</p></div><span className="project-technology">Early exploration</span><span className="row-arrow"><Icon name="arrow"/></span></a></>}
   {filter!=="code"&&<a className="project-row" href="#art"><span className="project-number">03</span><div><h3>A different kind of canvas</h3><p>Wallpapers, character art &amp; a little JoJo.</p></div><span className="project-technology">Art archive</span><span className="row-arrow"><Icon name="arrow"/></span></a>}
  </div>
  {filter!=="art"&&<section className="live-projects" data-reveal aria-labelledby="live-projects-title"><div className="section-heading live-projects-heading"><div><span className="eyebrow">From GitHub &amp; Modrinth</span><h3 id="live-projects-title">More in the workshop.</h3></div></div>
   {loading?<p className="live-projects-status" role="status">Loading projects and recent updates…</p>:<>
    {error&&<div className="live-projects-error" role="status"><p>Some live project data could not be loaded right now.</p><button type="button" onClick={()=>void load()}>Try again</button></div>}
    {modrinth.length>0&&<><h4 className="live-projects-label">Modrinth</h4><div className="live-project-list">{modrinth.map(project=><a key={project.id} className="project-row live-project-row" href={`https://modrinth.com/project/${project.slug}`} target="_blank" rel="noreferrer"><span className="project-number"><img src={project.icon_url||"assets/oc-icon.png"} alt="" width="32" height="32" loading="lazy"/></span><div><h3>{project.title}</h3><p>{project.description||"A project published on Modrinth."}</p></div><span className="project-technology">{project.downloads.toLocaleString()} downloads</span><span className="row-arrow"><Icon name="arrow"/></span></a>)}</div></>}
    {github.length>0&&<><h4 className="live-projects-label">GitHub</h4><div className="live-project-list">{github.map(project=><a key={project.id} className="project-row live-project-row" href={project.html_url} target="_blank" rel="noreferrer"><span className="project-number"><img src="assets/github.svg" alt="" width="25" height="25" loading="lazy"/></span><div><h3>{project.name}</h3><p>{project.description||"A GitHub project by pxotitas."}</p>{project.commits.length>0&&<ul className="project-commits">{project.commits.map(commit=><li key={commit.sha}>{commit.commit.message.split("\n")[0]}</li>)}</ul>}</div><span className="project-technology">{project.stargazers_count} stars</span><span className="row-arrow"><Icon name="arrow"/></span></a>)}</div></>}
   </>}
  </section>}
  <a className="text-link all-repositories" href="https://github.com/pxotitas" target="_blank" rel="noreferrer">All repositories on GitHub <Icon name="arrow"/></a>
 </section>;
}

function Gallery() {
 const [selected,setSelected]=useState<GalleryArtwork|null>(null);
 const [loading,setLoading]=useState(false);
 const [imageError,setImageError]=useState(false);
 const dialog=useRef<HTMLDialogElement>(null);
 const opener=useRef<HTMLButtonElement|null>(null);
 const previousOverflow=useRef("");
 const open=(art:GalleryArtwork,event:ReactMouseEvent<HTMLButtonElement>)=>{
  opener.current=event.currentTarget;previousOverflow.current=document.body.style.overflow;
  setSelected(art);setLoading(true);setImageError(false);dialog.current?.showModal();document.body.style.overflow="hidden";
 };
 const close=()=>dialog.current?.close();
 const onClose=()=>{document.body.style.overflow=previousOverflow.current;opener.current?.focus({preventScroll:true});opener.current=null;setSelected(null);setLoading(false);};
 return <>
  <section id="art" className="art section-card" data-chapter data-bg="#f5f5f7" aria-labelledby="art-title">
   <div className="section-heading" data-reveal><div><span className="eyebrow">03 / Art &amp; wallpapers</span><h2 id="art-title">Another side of me.</h2></div><p className="section-description">Same curiosity.<br/>A different canvas.</p></div>
   <div className="art-grid" data-reveal>{galleryArtworks.map(art=><button key={art.src} className={`art-tile${art.wide?" art-wide":""}`} type="button" aria-label={`Open ${art.title} artwork`} onClick={event=>open(art,event)}><span className="art-image"><img src={art.displaySrc} alt={art.alt} width="1672" height="941" loading="lazy"/><span className="art-open"><Icon name="expand"/></span></span><span className="art-caption"><span>{art.title}</span><span>{art.type} <Icon name="arrow"/></span></span></button>)}</div>
   <div className="art-footer" data-reveal><p>For the love of a good frame.</p><a className="text-link" href="https://pxotitas.github.io/#art" target="_blank" rel="noreferrer">The full gallery <Icon name="arrow"/></a></div>
  </section>
  <dialog ref={dialog} className="art-dialog" aria-labelledby="dialog-title" onClick={event=>{if(event.target===dialog.current)close();}} onClose={onClose}>
   <div className="dialog-topline"><h2 id="dialog-title">{selected?.title||"Artwork"}</h2><button className="round-button" type="button" aria-label="Close artwork" onClick={close}><Icon name="close"/></button></div>
   {selected&&<><div className="dialog-image-wrap" data-state={imageError?"error":loading?"loading":"ready"}>{loading&&<p className="dialog-status" role="status">Loading artwork…</p>}{imageError&&<p className="dialog-status" role="alert">This image could not be loaded. Please try another artwork.</p>}<img className="dialog-image" src={selected.displaySrc} alt={selected.alt} onLoad={()=>{setLoading(false);setImageError(false);}} onError={()=>{setLoading(false);setImageError(true);}}/></div><div className="dialog-bottom"><span>Chloe / pxdritz</span><a className="text-link" href={selected.src} download={selected.src.split("/").at(-1)}>Download image <Icon name="arrow"/></a></div></>}
  </dialog>
 </>;
}

const socialLinks=[
 {name:"GitHub",description:"Code & experiments",href:"https://github.com/pxotitas",icon:"github.svg"},
 {name:"Modrinth",description:"Mods & modpacks",href:"https://modrinth.com/user/pxotitas",icon:"modrinth.svg"},
 {name:"Ko-fi",description:"A little support",href:"https://ko-fi.com/pxdritz1",icon:"kofi.svg"},
 {name:"Code’s Café",description:"Come say hello",href:"https://discord.gg/BDKNDHvjrD",icon:"discord.svg"},
];
function Contact({notify}:{notify:ToastFn}) {
 const [copied,setCopied]=useState(false);
 const reset=useRef<number|undefined>(undefined);
 const copy=async()=>{
  let success=false;
  try {if(navigator.clipboard?.writeText&&window.isSecureContext){await navigator.clipboard.writeText("pxotitas");success=true;}}
  catch{/* clipboard permission denied */}
  if(!success){
   const field=document.createElement("textarea");const focused=document.activeElement as HTMLElement|null;
   field.value="pxotitas";field.readOnly=true;field.style.cssText="position:fixed;left:-9999px;top:0;opacity:0";
   document.body.append(field);field.select();try{success=document.execCommand("copy");}catch{success=false;}field.remove();focused?.focus({preventScroll:true});
  }
  setCopied(success);notify(success?"Copied pxotitas":"Copy this handle: pxotitas");
  if(reset.current)window.clearTimeout(reset.current);
  if(success)reset.current=window.setTimeout(()=>setCopied(false),1800);
 };
 useEffect(()=>()=>{if(reset.current)window.clearTimeout(reset.current);},[]);
 return <section id="contact" className="contact" data-chapter data-bg="#fafafa" aria-labelledby="contact-title"><span className="eyebrow">04 / A friendly wave</span><h2 id="contact-title" data-type-reveal>Let’s make<br/><span>something nice.</span></h2><p data-reveal>For a project, an art commission,<br/>or just a hello.</p><button className={`button button-primary copy-discord${copied?" is-copied":""}`} type="button" onClick={()=>void copy()}><img src="assets/discord.svg" alt="" width="23" height="23"/>pxotitas<Icon name={copied?"next":"copy"}/></button><div className="social-list" data-reveal>{socialLinks.map(social=><a key={social.name} href={social.href} target="_blank" rel="noreferrer"><img src={`assets/${social.icon}`} alt="" width="24" height="24"/><span>{social.name}</span><span className="social-detail">{social.description}</span><Icon name="arrow"/></a>)}</div></section>;
}

function Footer(){return <footer className="site-footer portfolio"><a className="wordmark" href="#home">pxdritz<span>.</span></a><span>Chloe / developer &amp; artist</span><a className="text-link" href="https://github.com/pxotitas" target="_blank" rel="noreferrer">GitHub <Icon name="arrow"/></a></footer>;}

function App(){
 const [toast,setToast]=useState("");
 const timer=useRef<number|undefined>(undefined);
 const notify:ToastFn=(message)=>{if(timer.current)window.clearTimeout(timer.current);setToast(message);timer.current=window.setTimeout(()=>setToast(""),2800);};
 useEffect(()=>{
  const root=document.documentElement;
  const reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const capture=root.classList.contains("figma-capture");
  let revealObserver:IntersectionObserver|undefined;
  if(!reducedMotion&&!capture&&"IntersectionObserver" in window){
   root.classList.add("js-motion");
   const targets=[...document.querySelectorAll<HTMLElement>("[data-reveal], [data-type-reveal]")];
   revealObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
     if(!entry.isIntersecting)return;
     (entry.target as HTMLElement).classList.add("is-revealed");
     revealObserver?.unobserve(entry.target);
    });
   },{threshold:0.12,rootMargin:"0px 0px -48px 0px"});
   targets.forEach((target,index)=>{
    target.style.setProperty("--reveal-delay",String(Math.min(index%5,4)*75)+"ms");
    revealObserver?.observe(target);
   });
  }else{
   document.querySelectorAll<HTMLElement>("[data-reveal], [data-type-reveal]").forEach(target=>target.classList.add("is-revealed"));
  }
  const chapters=[...document.querySelectorAll<HTMLElement>("[data-chapter][data-bg]")];
  let frame=0,current:HTMLElement|null=null;
  const update=()=>{
   frame=0;const readingLine=window.innerHeight*.4;
   const active=chapters.reduce<HTMLElement|null>((last,section)=>section.getBoundingClientRect().top<=readingLine?section:last,chapters[0]??null);
   const root=document.documentElement;const scrollable=Math.max(1,root.scrollHeight-window.innerHeight);
   root.style.setProperty("--scroll-progress",Math.min(1,Math.max(0,window.scrollY/scrollable)).toFixed(4));
   if(!active||active===current)return;current=active;
   document.body.style.setProperty("--page-bg",active.dataset.bg||"#fafafa");
   document.body.dataset.chapter=active.dataset.chapter||active.id;
   chapters.forEach(section=>section.classList.toggle("is-active",section===active));
  };
  const queue=()=>{if(!frame)frame=requestAnimationFrame(update);};
  window.addEventListener("scroll",queue,{passive:true});window.addEventListener("resize",queue,{passive:true});update();
  return()=>{window.removeEventListener("scroll",queue);window.removeEventListener("resize",queue);if(frame)cancelAnimationFrame(frame);if(timer.current)window.clearTimeout(timer.current);revealObserver?.disconnect();root.classList.remove("js-motion");};
 },[]);
 return <>
  <svg className="svg-definitions" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><defs>
   <filter id="poster-ink" colorInterpolationFilters="sRGB"><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncR type="discrete" tableValues=".07 .28 .52 .78 .98"/><feFuncG type="discrete" tableValues=".07 .28 .52 .78 .98"/><feFuncB type="discrete" tableValues=".07 .28 .52 .78 .98"/></feComponentTransfer></filter>
   <symbol id="arrow" viewBox="0 0 24 24"><path d="M7 7h10v10M7 17 17 7"/></symbol><symbol id="chevron" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></symbol><symbol id="close" viewBox="0 0 24 24"><path d="m6 6 12 12M6 18 18 6"/></symbol><symbol id="copy" viewBox="0 0 24 24"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></symbol><symbol id="expand" viewBox="0 0 24 24"><path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/></symbol><symbol id="next" viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6"/></symbol>
  </defs></svg>
  <a className="skip-link" href="#main">Skip to content</a><Header/>
  <main id="main" className="portfolio"><Hero notify={notify}/><About/><Projects notify={notify}/><Gallery/><Contact notify={notify}/></main>
  <Footer/><div className={`toast${toast?" is-visible":""}`} role="status" aria-live="polite">{toast}</div>
 </>;
}
export default App;
