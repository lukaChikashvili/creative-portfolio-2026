"use client"
import { useEffect, useRef, useState } from "react"
import gsap from "gsap"

const LANGUAGES = [
  "Georgian", "English", "Spanish", "French", "Italian", "Portuguese", "Hindi", "Chinese",
]

const SECTION_CONTENT: Record<
  string,
  { eyebrow: string; title: string[]; description: string | null }
> = {
  Home: {
    eyebrow: "Hi, I'm Luka",
    title: ["Creative", "Web Developer"],
    description: null, 
  },
  About: {
    eyebrow: "About",
    title: ["Who I Am"],
    description:
      "A self-taught full-stack developer based in Tbilisi, shipping production web apps end to end.",
  },
  Work: {
    eyebrow: "Work",
    title: ["Selected", "Projects"],
    description: "A look at what I've built — from 3D portfolios to production SaaS.",
  },
  Skills: {
    eyebrow: "Skills",
    title: ["What I Use"],
    description: "React, Next.js, TypeScript, Convex, React Three Fiber, GLSL, GSAP.",
  },
}

interface HeroProps {
  activeSection?: string
}

const Hero = ({ activeSection = "Home" }: HeroProps) => {
  const [displayedSection, setDisplayedSection] = useState(activeSection)
  const [langIndex, setLangIndex] = useState(0)

  const containerRef = useRef<HTMLDivElement>(null)
  const eyebrowRef = useRef<HTMLParagraphElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)

  const content = SECTION_CONTENT[displayedSection] ?? SECTION_CONTENT.Home
  const isHome = displayedSection === "Home"


  useEffect(() => {
    if (!isHome) return
    const interval = setInterval(() => {
      setLangIndex((i) => (i + 1) % LANGUAGES.length)
    }, 1800)
    return () => clearInterval(interval)
  }, [isHome])


  useEffect(() => {
    const ctx = gsap.context(() => {
      const els = [eyebrowRef.current, titleRef.current, descriptionRef.current].filter(Boolean)
      gsap.fromTo(
        els,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.08 }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  
  useEffect(() => {
    if (activeSection === displayedSection) return

    const ctx = gsap.context(() => {
      const els = [eyebrowRef.current, titleRef.current, descriptionRef.current].filter(Boolean)
      const tl = gsap.timeline()


      tl.to(els, {
        opacity: 0,
        y: -24,
        duration: 0.4,
        ease: "power2.in",
        stagger: 0.04,
      })

   
      tl.call(() => setDisplayedSection(activeSection))

    
      tl.fromTo(
        els,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.08 }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [activeSection, displayedSection])

  return (
    <div ref={containerRef} className="flex flex-col items-center text-center gap-4">
      <p
        ref={eyebrowRef}
        className="text-white/60 text-sm md:text-base tracking-[0.3em] uppercase"
      >
        {content.eyebrow}
      </p>

      <h1
        ref={titleRef}
        className="text-5xl md:text-9xl font-bold text-white tracking-tight leading-[0.95]"
      >
        {content.title.map((line, i) => (
          <span key={i}>
            {line}
            {i < content.title.length - 1 && <br />}
          </span>
        ))}
      </h1>

      <p ref={descriptionRef} className="max-w-xl text-white/70 text-base md:text-lg mt-2">
        {isHome ? (
          <>
            I build interactive, shader-driven web experiences — and I talk about
            them in{" "}
            <span className="text-white font-medium inline-block min-w-[7ch] transition-opacity duration-300">
              {LANGUAGES[langIndex]}
            </span>
            , among 8 languages.
          </>
        ) : (
          content.description
        )}
      </p>
    </div>
  )
}

export default Hero