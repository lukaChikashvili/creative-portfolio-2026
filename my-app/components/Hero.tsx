"use client"
import { useEffect, useState } from 'react'

const LANGUAGES = [
  'Georgian', 'English', 'Spanish', 'French', 'Italian', 'Portuguese', 'Hindi', 'Chinese',
]

const Hero = () => {
  const [langIndex, setLangIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setLangIndex((i) => (i + 1) % LANGUAGES.length)
    }, 1800)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center text-center gap-4">
      <p className="text-white/60 text-sm md:text-base tracking-[0.3em] uppercase">
        Hi, I&apos;m Luka
      </p>

      <h1 className="text-5xl md:text-9xl font-bold text-white tracking-tight leading-[0.95]">
        Creative
        <br />
        Web Developer
      </h1>

      <p className="max-w-xl text-white/70 text-base md:text-lg mt-2">
        I build interactive, shader-driven web experiences — and I talk about
        them in{' '}
        <span className="text-white font-medium inline-block min-w-[7ch] transition-opacity duration-300">
          {LANGUAGES[langIndex]}
        </span>
        , among 8 languages.
      </p>
    </div>
  )
}

export default Hero