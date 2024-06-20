import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "@/components/Providers/theme-provider";
import ToastProvider from "@/components/Providers/toast-provider";
import { Metadata } from "next";

const title = "LinkLists";
const description = "LinkLists is a platform to share your links with the world. Showcase your work, projects, and socials with a single link.";
const image = 'https://linklists.vercel.app/link-lists.png'

export const metadata: Metadata = {
  title,
  description,
  icons: [image],
  openGraph: {
    title,
    description,
    images: [image],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [image],
    creator: "@maiommhoon",
  },
  metadataBase: new URL("https://linklists.vercel.app/"),
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="bg-background" >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
              <ToastProvider />
        {children}
      </ThemeProvider>
      </body>
    </html>
  );
}
