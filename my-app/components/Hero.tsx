"use client"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import gsap from "gsap"
import ProjectTimeline, { PROJECTS, type Project } from "./ProjectTimeline"
import ExperienceTimeline, { EXPERIENCES, type Experience } from "./ExperienceTimeline"

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

const CLIP_HIDDEN = "inset(100% 0% 0% 0%)"
const CLIP_VISIBLE = "inset(0% 0% 0% 0%)"

interface HeroProps {
  activeSection?: string
}

const Hero = ({ activeSection = "Home" }: HeroProps) => {
  const [displayedSection, setDisplayedSection] = useState(activeSection)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null)
  const [langIndex, setLangIndex] = useState(0)

  const containerRef = useRef<HTMLDivElement>(null)
  const eyebrowRef = useRef<HTMLParagraphElement>(null)
  const titleLineRefs = useRef<(HTMLSpanElement | null)[]>([])
  const descriptionRef = useRef<HTMLParagraphElement>(null)

  const content = SECTION_CONTENT[displayedSection] ?? SECTION_CONTENT.Home
  const isHome = displayedSection === "Home"
  const isWork = displayedSection === "Work"
  const isAbout = displayedSection === "About"

  titleLineRefs.current = []

  const getRevealEls = () =>
    [eyebrowRef.current, ...titleLineRefs.current, descriptionRef.current].filter(
      (el): el is HTMLElement => Boolean(el)
    )


  useEffect(() => {
    if (!isHome) return
    const interval = setInterval(() => {
      setLangIndex((i) => (i + 1) % LANGUAGES.length)
    }, 1800)
    return () => clearInterval(interval)
  }, [isHome])

  
  useEffect(() => {
    if (activeSection === "Work") {
      setSelectedProject(PROJECTS[0])
    } else {
      setSelectedProject(null)
    }

    if (activeSection === "About") {
      setSelectedExperience(EXPERIENCES[0])
    } else {
      setSelectedExperience(null)
    }
  }, [activeSection])


  useEffect(() => {
    if (activeSection === displayedSection) return

    const ctx = gsap.context(() => {
      const outEls = getRevealEls()
      const tl = gsap.timeline()

      tl.to(outEls, {
        clipPath: "inset(0% 0% 100% 0%)",
        y: -20,
        opacity: 0,
        duration: 0.45,
        ease: "power3.in",
        stagger: 0.04,
      })

      tl.call(() => {
        setDisplayedSection(activeSection)
      })
    }, containerRef)

    return () => ctx.revert()
  }, [activeSection, displayedSection])


  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const inEls = getRevealEls()
      gsap.set(inEls, { clipPath: CLIP_HIDDEN, opacity: 0, y: 28 })
      gsap.to(inEls, {
        clipPath: CLIP_VISIBLE,
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.12,
      })
    }, containerRef)

    return () => ctx.revert()
  }, [displayedSection])


  const handleSelectProject = (project: Project) => {
    if (!isWork || project.id === selectedProject?.id) return

    const els = [eyebrowRef.current, titleLineRefs.current[0], descriptionRef.current].filter(
      (el): el is HTMLElement => Boolean(el)
    )

    const tl = gsap.timeline()


    tl.to(els, {
      opacity: 0,
      clipPath: "inset(0% 0% 100% 0%)",
      y: -15,
      duration: 0.3,
      ease: "power2.in",
      stagger: 0.03,
    })

   
    tl.call(() => {
      setSelectedProject(project)
    })

   
    tl.call(() => {
      gsap.set(els, {
        opacity: 0,
        clipPath: "inset(100% 0% 0% 0%)",
        y: 20,
      })
    })

    
    tl.to(els, {
      opacity: 1,
      clipPath: "inset(0% 0% 0% 0%)",
      y: 0,
      duration: 0.7,
      ease: "expo.out",
      stagger: 0.08,
    })
  }

  const handleSelectExperience = (experience: Experience) => {
    if (!isAbout || experience.id === selectedExperience?.id) return

    const els = [eyebrowRef.current, titleLineRefs.current[0], descriptionRef.current].filter(
      (el): el is HTMLElement => Boolean(el)
    )

    const tl = gsap.timeline()

    tl.to(els, {
      opacity: 0,
      clipPath: "inset(0% 0% 100% 0%)",
      y: -15,
      duration: 0.3,
      ease: "power2.in",
      stagger: 0.03,
    })

    tl.call(() => {
      setSelectedExperience(experience)
    })

    tl.call(() => {
      gsap.set(els, {
        opacity: 0,
        clipPath: "inset(100% 0% 0% 0%)",
        y: 20,
      })
    })

    tl.to(els, {
      opacity: 1,
      clipPath: "inset(0% 0% 0% 0%)",
      y: 0,
      duration: 0.7,
      ease: "expo.out",
      stagger: 0.08,
    })
  }

  const currentTitleLines =
    isWork && selectedProject
      ? [selectedProject.title]
      : isAbout && selectedExperience
      ? [selectedExperience.title]
      : content.title

  const currentDescription =
    isWork && selectedProject
      ? selectedProject.description
      : isAbout && selectedExperience
      ? selectedExperience.description
      : content.description

  return (
    <div ref={containerRef} className="mt-12 flex flex-col items-center text-center gap-4 pointer-events-none">
    
      <p
        ref={eyebrowRef}
        className="text-white/60 text-sm md:text-base tracking-[0.3em] uppercase"
        style={{ willChange: "clip-path, transform" }}
      >
        {isWork && selectedProject
          ? selectedProject.category
          : isAbout && selectedExperience
          ? selectedExperience.category
          : content.eyebrow}
      </p>

 
      <h1 className="text-5xl md:text-9xl font-bold text-white tracking-tight leading-[0.95]">
        {currentTitleLines.map((line, i) => (
          <span
            key={`${displayedSection}-${selectedProject?.id || selectedExperience?.id || 'default'}-${i}`}
            className="block overflow-visible"
          >
            <span
              ref={(el) => {
                titleLineRefs.current[i] = el
              }}
              className="inline-block"
              style={{ willChange: "clip-path, transform" }}
            >
              {line}
            </span>
          </span>
        ))}
      </h1>

  
      <p
        ref={descriptionRef}
        className="max-w-xl font-serif text-white/70 text-base md:text-lg mt-2 min-h-[48px]"
        style={{ willChange: "clip-path, transform" }}
      >
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
          currentDescription
        )}
      </p>

     
      {isWork && selectedProject && (
        <ProjectTimeline
          activeProject={selectedProject}
          onSelectProject={handleSelectProject}
        />
      )}

      {isAbout && selectedExperience && (
        <ExperienceTimeline
          activeExperience={selectedExperience}
          onSelectExperience={handleSelectExperience}
        />
      )}

      {}
    </div>
  )
}

export default Hero