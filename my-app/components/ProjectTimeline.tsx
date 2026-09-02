"use client"
import { useRef, useEffect } from "react"
import gsap from "gsap"

export type Project = {
  id: string
  title: string
  category: string
  description: string
  demoUrl?: string
  githubUrl?: string
}

export const PROJECTS: Project[] = [
  {
    id: "1",
    title: "GoldenMemorial.ge",
    category: "Next.js - convex - three js",
    description: "Georgian memorial platform with 3d cemetery, family collaboration, family tree, audio toasts and so on",
    demoUrl: "https://goldenmemorial.ge",
    githubUrl: "https://github.com/lukaChikashvili/georgianRegions/tree/main/Desktop/projects/gym/gympulse",
  },
  {
    id: "2",
    title: " 3D Movie Platform",
    category: "Next.js / Convex",
    description: "Full-stack application built for real-time collaboration and analytics.",
    demoUrl: "https://example-saas.com",
    githubUrl: "https://github.com/your-username/saas-platform",
  },
  {
    id: "3",
    title: "Shader Art",
    category: "Three.js / WebGL",
    description: "Generative procedural art pieces driven by fragment shaders.",
    demoUrl: "https://example-shaders.com",
    githubUrl: "https://github.com/your-username/shader-art",
  },
  {
    id: "4",
    title: "AI Assistant",
    category: "TypeScript / Node",
    description: "Automated workflow agent leveraging streaming AI completions.",
    githubUrl: "https://github.com/your-username/ai-assistant",
  },
]

interface ProjectTimelineProps {
  activeProject: Project
  onSelectProject: (project: Project) => void
}

const ProjectTimeline = ({ activeProject, onSelectProject }: ProjectTimelineProps) => {
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
  }, [activeProject.id])

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-6 mt-6 select-none pointer-events-auto">
      
      <div className="flex items-center justify-center gap-0">
        {PROJECTS.map((project, index) => {
          const isActive = project.id === activeProject.id

          return (
            <div key={project.id} className="flex items-center">
         
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onSelectProject(project)
                }}
                className="relative group flex items-center justify-center focus:outline-none p-1 z-20 cursor-pointer"
                title={project.title}
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
                  {project.title}
                </span>
              </button>

             
              {index < PROJECTS.length - 1 && (
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
        {activeProject.demoUrl && (
          <a
            href={activeProject.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2 text-xs md:text-sm font-medium text-black bg-white rounded-full hover:bg-white/90 hover:scale-105 transition-all shadow-md active:scale-95"
          >
            Visit Website
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

        {activeProject.githubUrl && (
          <a
            href={activeProject.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2 text-xs md:text-sm font-medium text-white/90 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 hover:text-white hover:scale-105 transition-all active:scale-95"
          >
            GitHub
            <svg
              className="w-3.5 h-3.5 fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
        )}
      </div>
    </div>
  )
}

export default ProjectTimeline