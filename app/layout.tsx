import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Apify Analytics | Johan Ortiz",
  description: "Advanced analytics dashboard for Apify Actors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} transition-colors duration-300`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
          <Toaster position="bottom-right" toastOptions={{
            style: { background: '#111113', color: '#fff', border: '1px solid #1f2937' }
          }} />
        </ThemeProvider>
      </body>
    </html>
  );
}