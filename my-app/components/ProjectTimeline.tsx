"use client"
import { useRef, useEffect } from "react"
import gsap from "gsap"

export type Project = {
  id: string
  title: string
  category: string
  description: string
}

export const PROJECTS: Project[] = [
  {
    id: "1",
    title: "3D Portfolio",
    category: "R3F / GLSL",
    description: "Interactive WebGL portfolio with custom shaders and camera flight physics.",
  },
  {
    id: "2",
    title: "SaaS Platform",
    category: "Next.js / Convex",
    description: "Full-stack application built for real-time collaboration and analytics.",
  },
  {
    id: "3",
    title: "Shader Art",
    category: "Three.js / WebGL",
    description: "Generative procedural art pieces driven by fragment shaders.",
  },
  {
    id: "4",
    title: "AI Assistant",
    category: "TypeScript / Node",
    description: "Automated workflow agent leveraging streaming AI completions.",
  },
]

interface ProjectTimelineProps {
  activeProject: Project
  onSelectProject: (project: Project) => void
}

const ProjectTimeline = ({ activeProject, onSelectProject }: ProjectTimelineProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      
      gsap.from(containerRef.current, {
        opacity: 0,
        y: 15,
        duration: 1.2,
        delay: 0.7,
        ease: "power2.out",
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="flex items-center justify-center gap-0 mt-6 select-none">
      {PROJECTS.map((project, index) => {
        const isActive = project.id === activeProject.id

        return (
          <div key={project.id} className="flex items-center">
            {/* Circle Button */}
            <button
              onClick={() => onSelectProject(project)}
              className="relative group flex items-center justify-center focus:outline-none p-1"
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
  )
}

export default ProjectTimeline