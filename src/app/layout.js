import {
  Poppins,
  Teko,
  Hind_Siliguri,
} from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";

// ==================== Font Setup ====================
// Primary Font (Headings) - Teko
const teko = Teko({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-teko",
  display: "swap",
});

// Secondary Font (Body) - Poppins
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

// Bangla Font - Hind Siliguri
const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

export const metadata = {
  title: {
    template: "%s | VisaPro",
    default: "VisaPro | Your Dream to Destination",
  },
  description:
    "VisaPro Consultancy & Migration - Your trusted partner for visa processing, flight booking, hotel reservation, Hajj & Umrah packages, study abroad, and tour planning. Based in Dhaka, Bangladesh.",
  keywords: [
    "visa processing",
    "visa consultancy",
    "flight booking",
    "hotel reservation",
    "hajj umrah",
    "study abroad",
    "tour packages",
    "Bangladesh travel",
    "immigration",
    "tourist visa",
    "working visa",
    "VisaPro",
  ],
  authors: [{ name: "VisaPro Consultancy & Migration" }],
  creator: "VisaPro",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "VisaPro",
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`
        ${teko.variable} 
        ${poppins.variable} 
        ${hindSiliguri.variable}
      `}
      style={{
        "--font-heading": `var(--font-teko), "Teko", sans-serif`,
        "--font-body": `var(--font-poppins), "Poppins", sans-serif`,
      }}
      suppressHydrationWarning
    >
      <body className="antialiased min-h-screen" suppressHydrationWarning>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
