'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Member {
  no: string
  name: string
  age?: string
  class?: string
  position: string
  photo: string
}

interface NameCardSliderProps {
  members: Member[]
}

export function NameCardSlider({ members }: NameCardSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => setCurrentIndex((prev) => (prev + 1) % members.length)
  const prev = () => setCurrentIndex((prev) => (prev - 1 + members.length) % members.length)

  if (!members.length) return null

  const member = members[currentIndex]

  return (
    <div className="relative group w-full max-w-[350px] mx-auto">
      {/* Navigation Buttons */}
      <button 
        onClick={prev}
        className="absolute left-[-50px] top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#1111a5]/80 text-white flex items-center justify-center hover:bg-[#1111a5] transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30"
        disabled={members.length <= 1}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button 
        onClick={next}
        className="absolute right-[-50px] top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#1111a5]/80 text-white flex items-center justify-center hover:bg-[#1111a5] transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30"
        disabled={members.length <= 1}
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Card Content */}
      <div className="id-card bg-blue-50 backdrop-blur-sm rounded-[10px] p-0 text-white shadow-[0_10px_25px_rgba(0,0,0,0.4)] relative w-[350px] h-[250px] flex flex-col font-['Times_New_Roman'] animate-in fade-in zoom-in duration-300  group-hover:border-[#6b8afd]/50 transition-colors">
        <div className="text-[10px] text-black/60 font-sans ml-1 mt-1">No. {member.no}</div>
        <div className="bg-[#6b8afd]/20 text-black border border-[#6b8afd]/30 text-center py-1 font-bold rounded-md mt-1 text-sm tracking-widest">ID CARD</div>
        
        <div className="flex gap-4 mt-4 flex-1">
          <div className="flex flex-col gap-2">
            <div 
              className="w-[100px] h-[120px] bg-cover bg-center rounded-sm ml-1"
              style={{ backgroundImage: `url(${member.photo})` }}
            />
            <div className="h-[30px] w-full bg-[repeating-linear-gradient(90deg,#000,#000_1px,transparent_1px,transparent_3px)] ml-1" />
          </div>
          
          <div className="flex-1 space-y-2 pt-2 text-black mr-1">
            <div className="flex text-xs">
              <span className="w-16 font-bold text-[#6b8afd]">NAME</span>
              <span className="mr-1">:</span>
              <span className="flex-1 font-bold uppercase">{member.name}</span>
            </div>
            {member.age && (
              <div className="flex text-xs">
                <span className="w-16 font-bold text-[#6b8afd]">AGE</span>
                <span className="mr-1">:</span>
                <span className="flex-1">{member.age}</span>
              </div>
            )}
            {member.class && (
              <div className="flex text-xs">
                <span className="w-16 font-bold text-[#6b8afd]">CLASS</span>
                <span className="mr-1">:</span>
                <span className="flex-1">{member.class}</span>
              </div>
            )}
            <div className="flex text-xs">
              <span className="w-16 font-bold text-[#6b8afd]">POSITION</span>
              <span className="mr-1">:</span>
              <span className="flex-1 uppercase">{member.position}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-700 text-white border border-[#6b8afd]/30 text-right px-1 text-[10px] rounded-b-lg  uppercase tracking-widest font-sans max-w-full mt-1">
          ICTEAM BHAWIKARSU 2025
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {members.map((_, i) => (
          <div 
            key={i} 
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              i === currentIndex ? "bg-[#6b8afd] w-4" : "bg-white/30"
            )} 
          />
        ))}
      </div>
    </div>
  )
}
