import "~/styles/globals.css";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

// SEO Metadata
export const metadata = {
  title: "GUB Elections 2025 | NIT Silchar",
  description:
    "Official portal for GUB (Gymkhana Union Body) Elections 2025 at NIT Silchar. Stay updated with candidate info, voting dates, and more.",
  keywords: [
    "GUB NIT Silchar",
    "Gymkhana Union Body Elections",
    "NIT Silchar Elections",
    "GUB Elections 2025",
    "Student Elections NIT Silchar",
    "Gymkhana NITS",
  ],
  authors: [{ name: "Mood of NITS Team" }],
  applicationName: "GUB Elections 2025",
  openGraph: {
    title: "GUB Elections 2025 | NIT Silchar",
    description:
      "Know everything about the Gymkhana Union Body (GUB) Elections 2025 at NIT Silchar. Updates, events, candidate details, and more.",
    url: "https://www.moodofnits.site",
    siteName: "GUB Elections 2025",
    images: [
      {
        url: "https://res.cloudinary.com/dz2mlxltd/image/upload/e_background_removal/f_png/v1754242529/istockphoto-164420490-612x612_scn3x8.jpg",
        width: 800,
        height: 600,
        alt: "GUB Elections NIT Silchar 2025",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  icons: {
    icon: "https://res.cloudinary.com/dz2mlxltd/image/upload/e_background_removal/f_png/v1754242529/istockphoto-164420490-612x612_scn3x8.jpg",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

const toastOps = {
  classNames: {
    title: "text-md md:text-lg font-mono",
    success: "toast-theme-blue",
    info: "toast-theme-blue",
    error: "toast-theme-red",
    warning: "toast-theme-red",
    loading: "toast-theme-blue",
  },
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
        <main role="main">{children}</main>
        <Toaster
          toastOptions={toastOps}
          visibleToasts={1}
          position="bottom-center"
        />
        <Footer />
      </body>
    </html>
  );
}
