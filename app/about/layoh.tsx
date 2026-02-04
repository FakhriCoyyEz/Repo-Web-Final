import "./layoh.css";
import { Rubik, Cardo } from "next/font/google";

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-sans",
});

const cardo = Cardo({
  subsets: ["latin"],
  style: ["italic"],
  variable: "--font-serif",
});

export const metadata = {
  title: "Card Hover Interactions",
  description: "Next.js Card Hover UI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${rubik.variable} ${cardo.variable}`}>
      <body>{children}</body>
    </html>
  );
}
