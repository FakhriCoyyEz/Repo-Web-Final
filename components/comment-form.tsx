"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Send, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function CommentForm({ targetId, type }: { targetId: string; type: 'news' | 'gallery' }) {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName: name,
          content,
          [type === 'news' ? 'newsId' : 'galleryId']: targetId,
        }),
      });

      if (res.ok) {
        toast.success("Komentar berhasil dikirim!");
        setName("");
        setContent("");
        router.refresh();
      }
    } catch (error) {
      toast.error("Gagal mengirim komentar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-primary/5 border-primary/10">
      <CardHeader>
        <CardTitle className="text-lg">Tulis Komentar</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input 
              placeholder="Nama Anda" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Textarea 
              placeholder="Apa pendapat Anda?" 
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              required 
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
            Kirim Komentar
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
