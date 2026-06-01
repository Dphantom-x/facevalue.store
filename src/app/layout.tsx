import type { Metadata } from "next";
import { type ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "FaceValue — Real fans. Real tickets. Face value.",
  description:
    "Proof-of-personhood ticketing. One real human, one ticket — every buyer verified live by Valiron.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
