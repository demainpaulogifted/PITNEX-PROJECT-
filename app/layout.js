import "./globals.css";

export const metadata = {
  title: "Pitnex — Earn Daily. Grow Smarter.",
  description:
    "Pitnex is a Nigerian earning platform for tasks, daily check-ins, packages and withdrawals.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}