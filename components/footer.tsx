import Link from "next/link";
import { Mail, Phone, Github, Instagram, Youtube } from "lucide-react";
import { GlobalService } from "@/lib/services/app-service";

export async function Footer() {
  const settings = await GlobalService.getAll();
  
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo & Info */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold text-white">{settings.site_name || "ICT TEAM"}</h2>
            <p className="max-w-md">
              Wadah kolaborasi inovatif bagi pengembang teknologi dan kreator konten digital. 
              Mendorong batas kreativitas melalui kolaborasi multimedia dan solusi IT.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Navigasi</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-white transition-colors">Beranda</Link></li>
              <li><Link href="/berita" className="hover:text-white transition-colors">Berita</Link></li>
              <li><Link href="/galeri" className="hover:text-white transition-colors">Galeri</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Login Admin</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold mb-4">Hubungi Kami</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-400 mt-1" />
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-tighter">Email</p>
                  <a href={`mailto:${settings.contact_email || "kaysancik@gmail.com"}`} className="hover:text-white transition-colors">
                    {settings.contact_email || "kaysancik@gmail.com"}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-green-400 mt-1" />
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-tighter">WhatsApp</p>
                  <a href={`https://wa.me/${(settings.contact_wa || "123456789").replace(/\D/g, "")}`} className="hover:text-white transition-colors">
                    {settings.contact_wa || "+62 123456789"}
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} {settings.site_name || "ICT TEAM"}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
