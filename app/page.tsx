'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import anime from 'animejs'
import { Navbar } from '@/components/navbar'
import { NameCardSlider } from '@/components/name-card-slider'

export default function IndexPage() {
  const bphMembers = [
    { no: "000000000001", name: "MATA BINTANG PENEDUH", class: "XI-C", position: "KETUA UMUM", photo: "/Assets/cowok.png" },
    { no: "000000000002", name: "ANDHIKA AQIL FATTAN", class: "XI-E", position: "WAKIL KETUA UMUM", photo: "/Assets/cowok.png" }
  ]
  const [loaded, setLoaded] = useState(false)
  const [showIntro, setShowIntro] = useState(true)

  useEffect(() => {
    // Intro logic
    const hasSeenIntro = sessionStorage.getItem('hasSeenIntro')
    if (hasSeenIntro) {
      setShowIntro(false)
      setLoaded(true)
    }

    // AnimeJS animations
    if (loaded || !showIntro) {
      anime({
        targets: '.hero h1',
        scale: [0.5, 1],
        opacity: [0, 1],
        duration: 2000,
        easing: 'easeOutExpo'
      });
    }

    const timer = setTimeout(() => {
      setLoaded(true)
      setShowIntro(false)
      sessionStorage.setItem('hasSeenIntro', 'true')
    }, 6500)

    // Parallax logic
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

    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [loaded, showIntro])

  return (
    <div className={loaded ? 'loaded' : ''}>
      {showIntro && (
        <div className="intro-container">
          <video 
            src="/Assets/IntroICTEAM.mp4" 
            autoPlay 
            muted 
            className="intro-video"
            onEnded={() => {
              setShowIntro(false)
              setLoaded(true)
            }}
            onError={() => {
              setShowIntro(false)
              setLoaded(true)
            }}
          ></video>
        </div>
      )}

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="hero section" id="index">
        <h1 className="flex items-center justify-center text-center ">ICTEAM</h1>
      </section>   

      {/* What is ICTEAM Section */}
      <section className="section">
        <div className="what-section">
          <div className="icon-container flex justify-center">
            <img 
              src="/Assets/logoicteam_waifu2x_noise0_scale2x_waifu2x_noise1_scale2x.png" 
              alt="logo ICTEAM" 
              className="w-[200px] md:w-[300px] h-auto" 
            />
          </div>
          <div className="content">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6">WHAT IS ICTEAM?</h2>
            <p className="text-lg leading-relaxed text-white/80 font-['Poppins'] text-justify">
              ICTeam merupakan ekstrakurikuler yang menjadi wadah pengembang minat siswa-siswi SMA Negeri 3 Malang dalam bidang informasi dan teknologi. 
              ICTeam sendiri terdiri dari 3 divisi yaitu: Cinematography, DKV, dan Programming. 
              ICTeam ada di bawah naungan sie 9 OSIS/PK Bhawikarsu.
            </p>
          </div>
        </div>
      </section>

      {/* BPH Section */}
      <section className="section py-20">
        <div className="bph-section container section py-20 flex flex-col lg:flex-row gap-16 items-center">
          <div className="left flex-1 justify-center lg:justify-end w-full">
            <NameCardSlider members={bphMembers} />
          </div>
          <div className="bph-content left flex-1 text-left sm:text-right">
            <h2 className="text-7xl md:text-9xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-[#6b8afd]">BPH</h2>
            <h3 className="text-5xl md:text-7xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-[#6b8afd]">ICTEAM</h3>
            <div className="max-w-xl">
              <p className="text-lg text-white/70 leading-relaxed font-['Poppins']">
                BPH (Badan Pengurus Harian) adalah pengurus inti yang bertugas menjalankan dan mengoordinasikan kegiatan organisasi sehari-hari
              </p>
            </div>
          </div> 
        </div>
      </section>

      {/* Divisi Section */}
      <section className="container section py-20 flex flex-col lg:flex-row gap-16 items-center">
        <div className="left flex-1 text-left">
          <h2 className="text-7xl md:text-9xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-[#6b8afd]">DIVISI</h2>
          <h3 className="text-5xl md:text-7xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-[#6b8afd]">ICTEAM</h3>
          <p className="text-lg text-white/70 leading-relaxed font-['Poppins'] max-w-xl">
            ICTeam memiliki tiga divisi utama: Cinematography, DKV, dan Programming yang berfokus dalam pengembangan kreativitas dan teknologi digital.
          </p>
        </div>
        <div className="right flex-1 flex justify-center lg:justify-end w-full">
          <div className="browser-frame w-full max-w-[400px]">
            <div className="division-buttons">
              <Link href="/cinematography" className="division">Cinematography</Link>
              <Link href="/dkv" className="division">DKV</Link>
              <Link href="/programming" className="division">Programming</Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="section">
        <h1 className="text-2xl font-bold opacity-50">&copy; ICTEAM 2025</h1>
      </footer>
    </div>
  )
}
