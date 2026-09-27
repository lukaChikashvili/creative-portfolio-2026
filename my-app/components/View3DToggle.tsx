"use client"

interface View3DToggleProps {
  is3D: boolean
  onToggle: () => void
}

const View3DToggle = ({ is3D, onToggle }: View3DToggleProps) => {
  return (
    
    <button
      onClick={onToggle}
      className="pointer-events-auto fixed bottom-8 right-8 z-20 font-serif rounded-full border border-white/20 bg-white/10 backdrop-blur px-5 py-3 text-sm font-medium text-white/90 hover:bg-white/20 transition-colors"
    >
      {is3D ? 'Exit 3D View' : 'Enter 3D View'}
    </button>
  )
}

export default View3DToggle