import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThreeBackground } from "@/components/three-background";

export const metadata: Metadata = {
  title: "ICTEAM - Information and Communication Technology",
  description: "Website resmi ICTEAM SMA Negeri 3 Malang",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen relative">
        <ThreeBackground />
        <main className="relative z-10">
          {children}
        </main>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
