import { NewsService, CommentService } from "@/lib/services/app-service";
import { notFound } from "next/navigation";
import { Calendar, User, ArrowLeft, MessageSquare, Send } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CommentForm } from "@/components/comment-form";

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await NewsService.getById(id);

  if (!post) {
    notFound();
  }

  const comments = await CommentService.getByPost(id, 'news');

  return (
    <div className="container mx-auto e max-w-4xl">
      <Button asChild variant="ghost" className="mb-8">
        <Link href="/berita">
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Berita
        </Link>
      </Button>

      <article className="space-y-8">
        <header className="space-y-4">
          <div className="flex items-center gap-4">
            <Badge className="capitalize">{post.mediaType || "Update"}</Badge>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(post.createdAt!).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            {post.title}
          </h1>
        </header>

        {post.mediaUrl && (
          <div className="rounded-3xl overflow-hidden border shadow-xl aspect-video bg-secondary">
            {post.mediaType === 'video' ? (
              <video src={post.mediaUrl} controls className="w-full h-full object-contain" />
            ) : (
              <img src={post.mediaUrl} alt={post.title} className="w-full h-full object-cover" />
            )}
          </div>
        )}

        <div 
          className="prose prose-slate lg:prose-xl max-w-none prose-img:rounded-3xl prose-headings:font-bold"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="pt-12 border-t mt-16">
          <h2 className="text-2xl font-bold flex items-center gap-3 mb-8">
            <MessageSquare className="w-6 h-6 text-primary" />
            Diskusi ({comments.length})
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="p-6 bg-secondary/30 rounded-2xl space-y-2 border">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm">{comment.authorName}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(comment.createdAt!).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-white">{comment.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground italic">Belum ada komentar. Jadilah yang pertama!</p>
              )}
            </div>

            <div>
              <CommentForm targetId={id} type="news" />
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
