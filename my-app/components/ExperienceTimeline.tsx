"use client"
import { useRef, useEffect } from "react"
import gsap from "gsap"

export type Experience = {
  id: string
  title: string
  category: string
  description: string
  url?: string
  detailsUrl?: string
}

export const EXPERIENCES: Experience[] = [
  {
    id: "1",
    title: "Front end development",
    category: "Scientific Cyber Security Association",
    description:
      "Learned Front End development with html, css, javascript and react ",
    
  },
  {
    id: "2",
    title: "Back End Development",
    category: "Academy of Digital Industries",
    description:
      "Learned Back End Development with node js and postgress/mongoDB",
  },
  {
    id: "3",
    title: "Three js",
    category: "Three js journey with bruno simon",
    description:
      "Learned WebGL development with Three js and shaders",
  },

  {
    id: "4",
    title: " learning languages",
    category: "Polyglot life",
    description:
      "currently mastering Chinese, actively reading books in - Spanish, Italian, French, Portuguese, English and Hindi",
  },


  {
    id: "5",
    title: "AI engineering",
    category: "self-development",
    description:
      "on the road to master Python, LLM, RAG, Math and do creative AI projects",
  },
]

interface ExperienceTimelineProps {
  activeExperience: Experience
  onSelectExperience: (experience: Experience) => void
}

const ExperienceTimeline = ({ activeExperience, onSelectExperience }: ExperienceTimelineProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)


  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(containerRef.current, {
        opacity: 0,
        y: 15,
        duration: 1.2,
        delay: 0.3,
        ease: "power2.out",
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])


  useEffect(() => {
    if (!buttonsRef.current) return
    gsap.fromTo(
      buttonsRef.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
    )
  }, [activeExperience.id])

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-6 mt-6 select-none pointer-events-auto">
      
      <div className="flex items-center justify-center gap-0">
        {EXPERIENCES.map((experience, index) => {
          const isActive = experience.id === activeExperience.id

          return (
            <div key={experience.id} className="flex items-center">
         
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onSelectExperience(experience)
                }}
                className="relative group flex items-center justify-center focus:outline-none p-1 z-20 cursor-pointer"
                title={experience.title}
              >
                <div
                  className={`w-6 h-6 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                    isActive
                      ? "border-white bg-white scale-125 shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                      : "border-white/40 bg-black/40 hover:border-white/80 hover:scale-110"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full transition-colors ${
                      isActive ? "bg-black" : "bg-white/60 group-hover:bg-white"
                    }`}
                  />
                </div>

                
                <span className="absolute -bottom-7 text-[11px] font-medium tracking-wide text-white/70 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {experience.title}
                </span>
              </button>

             
              {index < EXPERIENCES.length - 1 && (
                <div className="w-10 md:w-16 h-[2px] bg-white/20 relative overflow-hidden">
                  <div
                    className={`absolute inset-0 bg-white transition-transform duration-500 origin-left ${
                      isActive ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>


      <div ref={buttonsRef} className="flex items-center gap-3 mt-2 font-serif">
        {activeExperience.url && (
          <a
            href={activeExperience.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2 text-xs md:text-sm font-medium text-black bg-white rounded-full hover:bg-white/90 hover:scale-105 transition-all shadow-md active:scale-95"
          >
            Visit
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        )}

        {activeExperience.detailsUrl && (
          <a
            href={activeExperience.detailsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2 text-xs md:text-sm font-medium text-white/90 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 hover:text-white hover:scale-105 transition-all active:scale-95"
          >
            Details
          </a>
        )}
      </div>
    </div>
  )
}

export default ExperienceTimeline