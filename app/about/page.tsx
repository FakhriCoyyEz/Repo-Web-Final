'use client'

import { useEffect } from 'react'
import Link from 'next/link'

import { Navbar } from '@/components/navbar'
import TiltCarousel from '@/components/TiltCarousel';

export default function AboutPage() {
  useEffect(() => {
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

      <section className="hero">
        <h1>ABOUT ICTEAM</h1>
      </section>

      <section className="section">
        <div className="content">
          <p>ICTeam merupakan ekstrakurikuler yang menjadi wadah pengembang minat siswa-siswi SMA Negeri 3 Malang dalam bidang informasi dan teknologi. ICTeam sendiri terdiri dari 3 divisi yaitu: Cinematography, DKV, and Programming. ICTeam ada di bawah naungan sie 9 OSIS/PK Bhawikarsu</p>
        </div>
      </section>

      <footer>
        <h1>&copy; ICTEAM 2025</h1>
      </footer>
    </div>
  )
}
