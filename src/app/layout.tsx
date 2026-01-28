import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google"; // Changed fonts
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

// Setup font instances
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CivicFix AI - Citizen Complaint Resolver",
  description: "AI-powered civic issue reporting and management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${outfit.variable} antialiased bg-slate-50 text-slate-900 font-sans selection:bg-blue-500/30 selection:text-blue-600`}
      >
        <AuthProvider>
          <div className="min-h-screen flex flex-col relative overflow-x-hidden">
            {/* Background Gradients for the whole app */}
            <div className="fixed inset-0 z-[-1] pointer-events-none">
              <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px] opacity-70 animate-blob"></div>
              <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-teal-400/20 rounded-full blur-[100px] opacity-70 animate-blob animation-delay-2000"></div>
              <div className="absolute bottom-[-10%] right-[20%] w-[600px] h-[600px] bg-indigo-400/20 rounded-full blur-[120px] opacity-60 animate-blob animation-delay-4000"></div>
            </div>

            <Navbar />
            <main className="flex-grow pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
