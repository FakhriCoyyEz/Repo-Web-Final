"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ImageUpload } from "@/components/ui/image-upload";
import { toast } from "sonner";
import { 
  Plus, 
  Trash2, 
  Loader2, 
  Newspaper, 
  Image as ImageIcon,
  CheckCircle,
  Video
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function NewsManager() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  
  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState("image");

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await fetch("/api/news");
      const data = await res.json();
      setNews(data);
    } catch (error) {
      toast.error("Gagal mengambil data berita");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, mediaUrl, mediaType }),
      });

      if (res.ok) {
        toast.success("Berita berhasil diterbitkan!");
        setTitle("");
        setContent("");
        setMediaUrl("");
        fetchNews();
      } else {
        toast.error("Gagal menerbitkan berita");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus berita ini?")) return;

    try {
      const res = await fetch(`/api/news/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Berita berhasil dihapus");
        fetchNews();
      }
    } catch (error) {
      toast.error("Gagal menghapus berita");
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Buat Berita Baru
          </CardTitle>
          <CardDescription>Berita yang dibuat akan langsung tampil di halaman depan.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Judul Berita</label>
              <Input 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Masukkan judul menarik..." 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Konten Berita (Text/HTML)</label>
              <Textarea 
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                placeholder="Tulis berita lengkap di sini..." 
                className="min-h-[200px]"
                required 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Media (Gambar/Video)</label>
                <ImageUpload 
                  value={mediaUrl} 
                  onChange={setMediaUrl} 
                  route="media"
                />
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipe Media</label>
                  <select 
                    className="w-full p-2 border rounded-md bg-background"
                    value={mediaType}
                    onChange={(e) => setMediaType(e.target.value)}
                  >
                    <option value="image">Gambar</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                {mediaUrl && (
                  <div className="p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-2 border border-green-200">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-xs font-bold">Media siap diunggah</span>
                  </div>
                )}
              </div>
            </div>

            <Button type="submit" disabled={creating} className="w-full md:w-auto">
              {creating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Newspaper className="w-4 h-4 mr-2" />}
              Terbitkan Berita
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Berita</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-10 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto opacity-20" /></div>
          ) : news.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Media</TableHead>
                    <TableHead>Judul</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {news.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>
                        <div className="w-12 h-12 rounded bg-secondary flex items-center justify-center overflow-hidden">
                          {post.mediaType === "video" ? (
                            <Video className="w-6 h-6" />
                          ) : post.mediaUrl ? (
                            <img src={post.mediaUrl} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-6 h-6" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium max-w-[200px] truncate">{post.title}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(post.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="py-10 text-center text-muted-foreground">Belum ada berita.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
