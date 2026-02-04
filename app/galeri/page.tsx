import { GalleryService } from "@/lib/services/app-service";
import { 
  Image as ImageIcon, 
  Video, 
  FileText, 
  Code, 
  Maximize2,
  FileCode
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from '@/components/navbar';

export default async function GalleryPage() {
  const items = await GalleryService.getAll();

  return (
    <div className="container mx-auto">
      <Navbar />
      <header className="mb-12 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <ImageIcon className="w-10 h-10 text-primary" />
          Galeri ICT
        </h1>
        <p className="text-muted-foreground">
          Koleksi karya, dokumentasi, dan aset kreatif dari ICT TEAM dalam berbagai format.
        </p>
      </header>

      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {items.length > 0 ? (
          items.map((item) => (
            <Card key={item.id} className="break-inside-avoid overflow-hidden group hover:shadow-xl transition-all duration-300">
              <CardContent className="p-0 relative">
                <div className="absolute top-2 right-2 z-10 flex gap-1">
                  <Badge variant="secondary" className="capitalize text-[10px] px-1.5 py-0 bg-white/80 backdrop-blur-sm">
                    {item.type}
                  </Badge>
                </div>

                {item.type === "image" && item.url && (
                  <div className="relative">
                    <img src={item.url} alt={item.title} className="w-full h-auto block" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Maximize2 className="text-white w-8 h-8" />
                    </div>
                  </div>
                )}

                {item.type === "video" && item.url && (
                  <div className="aspect-video bg-slate-900 flex items-center justify-center relative">
                    <video src={item.url} className="w-full h-full object-cover opacity-60" muted />
                    <Video className="text-white w-12 h-12 absolute" />
                  </div>
                )}

                {(item.type === "text" || item.type === "html" || item.type === "txt") && (
                  <div className="p-6 bg-slate-50 border-b flex flex-col gap-3 min-h-[200px]">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                      {item.type === "html" ? <Code className="w-5 h-5 text-blue-500" /> : <FileText className="w-5 h-5 text-slate-500" />}
                    </div>
                    {item.content && (
                      <p className="text-sm text-slate-600 line-clamp-6 italic font-serif">
                        "{item.type === 'html' ? item.content.replace(/<[^>]*>/g, '').substring(0, 150) : item.content}"
                      </p>
                    )}
                  </div>
                )}

                {item.type === "file" && (
                  <div className="p-8 bg-slate-100 flex flex-col items-center justify-center gap-4 text-center">
                    <FileCode className="w-16 h-16 text-slate-400" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Document File</span>
                  </div>
                )}

                <div className="p-4 bg-white text-black/90">
                  <h3 className="font-bold text-sm line-clamp-1">{item.title}</h3>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {new Date(item.createdAt!).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-secondary/20 rounded-3xl border border-dashed flex flex-col items-center">
            <ImageIcon className="w-16 h-16 text-muted-foreground mb-4 opacity-20" />
            <p className="text-xl font-medium text-muted-foreground">Galeri masih kosong.</p>
          </div>
        )}
      </div>
    </div>
  );
}
