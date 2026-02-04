"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  Save, 
  Loader2, 
  Settings,
  Globe,
  Mail,
  Phone,
  Info
} from "lucide-react";

export function GlobalSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({
    site_name: "ICT TEAM",
    contact_email: "kaysancik@gmail.com",
    contact_wa: "+62 123456789",
    hero_title: "ICT TEAM",
    hero_description: "Membangun masa depan melalui inovasi teknologi dan kreativitas multimedia.",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (Object.keys(data).length > 0) {
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      toast.error("Gagal mengambil pengaturan");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        toast.success("Pengaturan berhasil disimpan secara global!");
      } else {
        toast.error("Gagal menyimpan pengaturan");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading) return <div className="py-20 text-center"><Loader2 className="w-10 h-10 animate-spin mx-auto opacity-20" /></div>;

  return (
    <div className="space-y-8">
      <form onSubmit={handleSave} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Informasi Situs
            </CardTitle>
            <CardDescription>Pengaturan utama yang tampil di seluruh bagian website.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nama Situs</label>
                <Input 
                  value={settings.site_name} 
                  onChange={(e) => updateSetting("site_name", e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Mail className="w-3 h-3" /> Email Kontak
                </label>
                <Input 
                  value={settings.contact_email} 
                  onChange={(e) => updateSetting("contact_email", e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Phone className="w-3 h-3" /> WhatsApp
                </label>
                <Input 
                  value={settings.contact_wa} 
                  onChange={(e) => updateSetting("contact_wa", e.target.value)} 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Konten Hero
            </CardTitle>
            <CardDescription>Ubah teks yang tampil di banner utama halaman beranda.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Judul Utama Hero</label>
              <Input 
                value={settings.hero_title} 
                onChange={(e) => updateSetting("hero_title", e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Deskripsi Hero</label>
              <Input 
                value={settings.hero_description} 
                onChange={(e) => updateSetting("hero_description", e.target.value)} 
              />
            </div>
          </CardContent>
        </Card>

        <div className="sticky bottom-4 z-20 flex justify-end">
          <Button type="submit" size="lg" disabled={saving} className="shadow-xl">
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Simpan Semua Perubahan
          </Button>
        </div>
      </form>
    </div>
  );
}
