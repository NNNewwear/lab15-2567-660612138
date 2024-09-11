import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";

export const metadata: Metadata = {
  title: "Lab15",
  description: "Marathon registration form ",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MantineProvider theme={{ primaryColor: "pink" }}>
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
