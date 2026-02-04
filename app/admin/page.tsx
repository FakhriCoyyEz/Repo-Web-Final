"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LayoutDashboard, 
  Newspaper, 
  Image as ImageIcon, 
  Settings, 
  Users,
  Loader2,
  ShieldCheck
} from "lucide-react";
import { NewsManager } from "@/components/admin/news-manager";
import { GalleryManager } from "@/components/admin/gallery-manager";
import { GlobalSettings } from "@/components/admin/global-settings";
import { AdminPanel } from "@/components/admin/admin-panel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("news");

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) return null;

  const isSuperadmin = session.user.role === "superadmin";

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-primary" />
            Dashboard Admin
          </h1>
          <p className="text-muted-foreground">Selamat datang, {session.user.name} ({session.user.role})</p>
        </div>
        
        {isSuperadmin && (
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full border border-primary/20">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-wider">MODE RAJA</span>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 gap-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
            <TabsTrigger value="news" className="flex items-center gap-2">
              <Newspaper className="w-4 h-4" />
              <span>Kelola Berita</span>
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              <span>Kelola Galeri</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span>Page Global</span>
            </TabsTrigger>
            {isSuperadmin && (
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Panel Punya RAJA</span>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="news" className="animate-in fade-in duration-500">
            <NewsManager />
          </TabsContent>
          
          <TabsContent value="gallery" className="animate-in fade-in duration-500">
            <GalleryManager />
          </TabsContent>
          
          <TabsContent value="settings" className="animate-in fade-in duration-500">
            <GlobalSettings />
          </TabsContent>

          {isSuperadmin && (
            <TabsContent value="users" className="animate-in fade-in duration-500">
              <AdminPanel />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
