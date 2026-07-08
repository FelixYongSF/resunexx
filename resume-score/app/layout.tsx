import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "ResuNexx",
  description: "See your resume through a recruiter's eyes before you apply."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans">
        {children}
        <Footer />
      </body>
    </html>
  );
}
