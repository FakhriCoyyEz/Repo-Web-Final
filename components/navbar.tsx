"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { LogOut, User as UserIcon } from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <Link href="/" className="logo group">
        <img src="/Assets/logoicteam.png" alt="ICTEAM Logo" className="transition-transform group-hover:scale-110" />
        <span className="hidden sm:inline font-[Code Pro]">ICTEAM</span>
      </Link>
      
      <ul className="nav-links">
        <li><Link href="/" className="hover:text-[#6b8afd]">BERANDA</Link></li>
        <li><Link href="/programming" className="hover:text-[#6b8afd]">PROGRAMMING</Link></li>
        <li><Link href="/cinematography" className="hover:text-[#6b8afd]">CINEMATOGRAPHY</Link></li>
        <li><Link href="/dkv" className="hover:text-[#6b8afd]">DKV</Link></li>
        <li><Link href="/galeri" className="hover:text-[#6b8afd]">GALLERY</Link></li>
        <li><Link href="/berita " className="hover:text-[#6b8afd]">NEWS</Link></li>
        <li><Link href="/about " className="hover:text-[#6b8afd]">ABOUT</Link></li>
        {session && (
           <li><Link href="/admin" className="hover:text-[#6b8afd]">DASHBOARD</Link></li>
        )}
      </ul>
      
      
        <div className="flex items-center">
        <div className="flex items-center">
        <div className="instagram">
          <a href="https://www.instagram.com/icteambwks?igsh=MTcwNDNrZXhqYXA0" target="_blank" rel="noopener noreferrer">
            <img src="/Assets/instagram.png" alt="Instagram ICTEAM" />
          </a>
        </div>
        <div className="youtube">
          <a href="https://www.youtube.com/@BhawikarsuFilm" target="_blank" rel="noopener noreferrer">
            <img src="/Assets/youtube.png" alt="Youtube ICTEAM" />
          </a>
        </div>
        </div>
        
        {session ? (
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] uppercase tracking-wider">
              <UserIcon className="w-3 h-3" />
              <span>{session.user.name}</span>
            </div>
            <button 
              onClick={() => signOut()}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link href="/login" className="text-[10px] sm:text-xs font-bold hover:text-[#6b8afd] transition-colors tracking-[2px]">
            LOGIN
          </Link>
        )}
      </div>
    </nav>
  );
}
