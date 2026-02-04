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
  Image as ImageIcon,
  Video,
  FileText,
  Code,
  FileCode
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function GalleryManager() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  
  // Form state
  const [title, setTitle] = useState("");
  const [type, setType] = useState("image"); // image, video, text, html, txt
  const [url, setUrl] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      setItems(data);
    } catch (error) {
      toast.error("Gagal mengambil data galeri");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, type, url, content }),
      });

      if (res.ok) {
        toast.success("Aset galeri berhasil diunggah!");
        setTitle("");
        setUrl("");
        setContent("");
        fetchItems();
      } else {
        toast.error("Gagal mengunggah ke galeri");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus aset ini?")) return;

    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Aset berhasil dihapus");
        fetchItems();
      }
    } catch (error) {
      toast.error("Gagal menghapus aset");
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Unggah ke Galeri
          </CardTitle>
          <CardDescription>Mendukung gambar, video, teks, file .html, dan .txt.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Judul Aset</label>
                <Input 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="Nama aset galeri..." 
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipe Aset</label>
                <select 
                  className="w-full p-2 border rounded-md bg-background"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="image">Gambar (JPG/PNG/WEBP)</option>
                  <option value="video">Video (MP4/MKV)</option>
                  <option value="text">Teks Biasa</option>
                  <option value="html">File/Konten HTML</option>
                  <option value="txt">File .txt</option>
                </select>
              </div>
            </div>

            {(type === "image" || type === "video") ? (
              <div className="space-y-2">
                <label className="text-sm font-medium">Unggah File</label>
                <ImageUpload 
                  value={url} 
                  onChange={setUrl} 
                  route="media"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-sm font-medium">Konten Teks/HTML</label>
                <Textarea 
                  value={content} 
                  onChange={(e) => setContent(e.target.value)} 
                  placeholder="Masukkan isi konten teks atau kode HTML di sini..." 
                  className="min-h-[150px]"
                  required 
                />
              </div>
            )}

            <Button type="submit" disabled={creating} className="w-full md:w-auto">
              {creating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
              Tambahkan ke Galeri
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Aset Galeri</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-10 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto opacity-20" /></div>
          ) : items.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Preview</TableHead>
                    <TableHead>Judul</TableHead>
                    <TableHead>Tipe</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="w-12 h-12 rounded bg-secondary flex items-center justify-center overflow-hidden">
                          {item.type === "image" ? (
                            <img src={item.url} className="w-full h-full object-cover" />
                          ) : item.type === "video" ? (
                            <Video className="w-6 h-6" />
                          ) : item.type === "html" ? (
                            <Code className="w-6 h-6" />
                          ) : (
                            <FileText className="w-6 h-6" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{item.type}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(item.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="py-10 text-center text-muted-foreground">Belum ada aset galeri.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
