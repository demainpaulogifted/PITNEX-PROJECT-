"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">

        <Link href="/" className="brand">
          <span className="brand-icon">P</span>
          <span>Pitnex</span>
        </Link>

        <nav className="desktop-nav">
          <Link href="/">Home</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/tasks">Tasks</Link>
          <Link href="/packages">Packages</Link>
        </nav>

        <div className="header-actions">
          <Link href="/login" className="login-link">
            Login
          </Link>

          <Link href="/dashboard" className="header-button">
            Get Started
          </Link>
        </div>

      </div>
    </header>
  );
}