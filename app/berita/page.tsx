import { NewsService } from "@/lib/services/app-service";
import Link from "next/link";
import { Newspaper, Calendar, User, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Navbar } from '@/components/navbar';

export default async function NewsPage() {
  const allNews = await NewsService.getAll();

  return (
    <div className="container mx-auto">
      <Navbar />
      <header className="mb-12 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <Newspaper className="w-10 h-10 text-primary" />
          Berita & Update
        </h1>
        <p className="text-muted-foreground">
          Dapatkan informasi terbaru mengenai kegiatan, proyek, dan pencapaian ICT TEAM.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {allNews.length > 0 ? (
          allNews.map((post) => (
            <article key={post.id} className="group flex flex-col border rounded-2xl overflow-hidden bg-card hover:shadow-2xl transition-all duration-500">
              <Link href={`/berita/${post.id}`} className="block relative aspect-video overflow-hidden">
                {post.mediaUrl ? (
                  <img 
                    src={post.mediaUrl} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-secondary flex items-center justify-center">
                    <Newspaper className="w-12 h-12 text-muted-foreground opacity-20" />
                  </div>
                )}
                {post.mediaType && (
                  <Badge className="absolute top-4 right-4 capitalize">
                    {post.mediaType}
                  </Badge>
                )}
              </Link>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(post.createdAt!).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {post.author?.name || "Admin"}
                  </span>
                </div>
                
                <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  <Link href={`/berita/${post.id}`}>{post.title}</Link>
                </h2>
                
                <p className="text-sm text-muted-foreground line-clamp-3 mb-6" dangerouslySetInnerHTML={{ __html: post.content.replace(/<[^>]*>/g, '').substring(0, 150) + "..." }} />
                
                <div className="mt-auto pt-6 border-t flex items-center justify-between">
                  <Link href={`/berita/${post.id}`} className="text-sm font-bold text-primary hover:underline">
                    Baca Selengkapnya
                  </Link>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-xs font-medium">Komentar</span>
                  </div>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-secondary/20 rounded-3xl border border-dashed">
            <Newspaper className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-xl font-medium text-muted-foreground">Belum ada berita yang diterbitkan.</p>
          </div>
        )}
      </div>
    </div>
  );
}
