"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Lock, User as UserIcon, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const usernameOrEmail = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Map usernames to internal emails used in seed
    let loginEmail = usernameOrEmail;
    if (usernameOrEmail === "superadmin") loginEmail = "superadmin@example.com";
    if (usernameOrEmail === "ictbwks") loginEmail = "ictbwks@example.com";

    try {
      const { data, error: authError } = await signIn.email({
        email: loginEmail,
        password: password,
        callbackURL: "/admin",
      });

      if (authError) {
        let msg = authError.message || "Email atau password salah.";
        if (msg.toLowerCase().includes("user not found")) {
          msg = "User tidak ditemukan. Silakan jalankan Inisialisasi User di bawah.";
        }
        if (msg.toLowerCase().includes("origin")) {
          msg = "Error Origin: WOY DONGO UBAH TRUSTED ORIGINNYA DULU BEGO.";
        }
        setError(msg);
        toast.error("Gagal Login", { description: msg });
      } else {
        toast.success("Berhasil Login", { description: "Selamat datang kembali!" });
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-t-4 border-t-[#6b8afd] bg-black/40 backdrop-blur-xl text-white">
        <CardHeader className="space-y-1 text-center">
          <div className="w-16 h-16 bg-[#6b8afd]/20 text-[#6b8afd] rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription className="text-gray-300">
            Masuk untuk mengelola konten ICT TEAM
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Username atau Email</Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  name="email" 
                  placeholder="superadmin / ictbwks" 
                  className="pl-10" 
                  required 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  className="pl-10" 
                  required 
                />
              </div>
            </div>
            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Masuk"
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t text-center space-y-4">
            <p className="text-xs text-muted-foreground">
              Masalah login? Hubungi FakhriCoyyEz
            </p>
            <div className="flex flex-col gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs"
                onClick={async () => {
                  const res = await fetch('/api/setup');
                  const data = await res.json();
                  if (data.success) {
                    toast.success("Database berhasil di-seed!", { description: "Silakan login sekarang." });
                  } else {
                    toast.error("Gagal seed database", { description: data.error });
                  }
                }}
              >
                Inisialisasi User (Klik jika belum bisa login)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
