'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import anime from 'animejs'
import { Navbar } from '@/components/navbar'
import { NameCardSlider } from '@/components/name-card-slider'

export default function DkvPage() {
  const trainers = [
    { no: "000000000001", name: "Muhammad Alfandy Aswad, S.Ds.", age: "100", position: "Trainer", photo: "/Assets/cowok.png" }
  ]
  useEffect(() => {
    anime({
      targets: '.hero-title',
      opacity: [0, 1],
      translateY: [50, 0],
      duration: 1500,
      easing: 'easeOutExpo',
      delay: 500
    });

    const handleScroll = () => {
      const scrolled = window.scrollY
      document.querySelectorAll('.parallax').forEach((section, i) => {
        const speed = 0.15 + (i * 0.05)
        if (section instanceof HTMLElement) {
          section.style.transform = `translateY(${scrolled * speed}px)`
        }
      })
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="loaded">
      <Navbar />

      <section className="min-h-[40vh] md:min-h-[60vh] flex items-center justify-center p-4 md:p-10 mt-20" id="index">
        <h1 className="hero-title text-[12vw] font-black leading-none text-transparent bg-clip-text bg-gradient-to-r from-white to-[#6b8afd] tracking-tighter text-center uppercase flex flex-wrap items-center justify-center break-words w-full max-w-full overflow-hidden px-4">
          DKV
        </h1>
      </section>

      <section className="section py-10 md:py-20 relative z-10">
        <div className="what-section">
           <div className="icon-container flex justify-center">
            <img 
              src="/Assets/vest y2.png" 
              alt="logo DKV" 
              className="w-[200px] md:w-[300px] h-auto" 
            />
          </div>
          <div className="content w-full">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-8 font-['Montserrat']">WHAT IS DKV?</h2>
            <p className="text-lg leading-relaxed text-white/80 font-['Poppins'] text-justify">
              DKV, atau Desain Komunikasi Visual, adalah divisi yang mempelajari cara menyampaikan pesan atau informasi melalui media visual, seperti gambar, huruf, warna, dan tata letak. 
              DKV menggabungkan seni dan komunikasi untuk menciptakan desain yang efektif dan menarik secara visual, serta bertujuan untuk menyampaikan pesan yang tepat sasaran.
            </p>
          </div>
        </div>
      </section>

      <section className="section py-10 md:py-20 relative z-10" data-anim="fadeUp">
        <div className="container section py-20 flex flex-col lg:flex-row gap-16 items-center">
          <div className="bph-content right flex-1 text-left sm:text-right">
            <h3 className="autoShow text-6xl md:text-8xl font-black font-['Montserrat'] text-transparent bg-clip-text bg-gradient-to-r from-white to-[#6b8afd]">
              PELATIH
            </h3>
          </div> 
          <div className="left flex-1 justify-center lg:justify-end w-full">
            <NameCardSlider members={trainers} />
          </div>
        </div>
      </section>

      <footer>
        <h1>&copy; ICTEAM 2025</h1>
      </footer>
    </div>
  )
}
