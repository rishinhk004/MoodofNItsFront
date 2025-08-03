import "~/styles/globals.css";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";

import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "GUB Elections 2025",
  description: "Gymkhana Union Body Elections NIT Silchar, 2025",
  icons: [
    {
      rel: "icon",
      url: "https://res.cloudinary.com/dz2mlxltd/image/upload/e_background_removal/f_png/v1754242529/istockphoto-164420490-612x612_scn3x8.jpg",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`font-sans ${inter.variable} font-inter flex min-h-screen flex-col bg-black text-white`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
