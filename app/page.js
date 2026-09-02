"use client";

import Link from "next/link";
import {
  CalendarCheck,
  ListTodo,
  Gamepad2,
  Package,
  Banknote,
  CheckCircle2,
} from "lucide-react";

export default function HomePage() {
  return (
    <>
      {/* HEADER */}
      <header className="site-header">
        <div className="header-inner">
          <Link href="/" className="brand">
            <div className="brand-icon">P</div>
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
            <Link href="/signup" className="header-button">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <span></span>
            Nigeria’s Smartest Earn Platform
          </div>

          <h1>
            Earn Daily.
            <br />
            <span>Grow Smarter with Pitnex</span>
          </h1>

          <p>
            Complete simple tasks, check in daily, join exclusive packages and
            withdraw straight to your Nigerian bank account.
          </p>

          <div className="hero-buttons">
            <Link href="/signup" className="primary-button">
              Start Earning Free
            </Link>
            <Link href="/packages" className="secondary-button">
              View Packages
            </Link>
          </div>
        </div>

        {/* PHONE MOCKUP */}
        <div className="phone-wrapper">
          <div className="phone">
            <div className="phone-screen">
              <div className="phone-top">
                <span>GOOD AFTERNOON</span>
                <div className="balance-label">WALLET BALANCE</div>
                <div className="phone-balance">₦0.00</div>

                <div className="phone-actions">
                  <button style={{ background: "rgba(255,255,255,0.25)", color: "white" }}>
                    Invest
                  </button>
                  <button style={{ background: "white" }}>Withdraw</button>
                </div>
              </div>

              <div className="phone-grid">
                <div className="phone-card">
                  <CalendarCheck />
                  <span>Check-in</span>
                </div>
                <div className="phone-card">
                  <ListTodo />
                  <span>Tasks</span>
                </div>
                <div className="phone-card">
                  <Gamepad2 />
                  <span>Games</span>
                </div>
                <div className="phone-card">
                  <Package />
                  <span>Packages</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="section-heading">
          <h2>Everything you need to earn</h2>
          <p>Simple tools designed for Nigerians who want real results</p>
        </div>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <CalendarCheck size={24} />
            </div>
            <h3>Daily Check-in</h3>
            <p>Check in every 24 hours and earn ₦1,000 instantly.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <ListTodo size={24} />
            </div>
            <h3>Simple Tasks</h3>
            <p>Join WhatsApp & Telegram groups and get paid.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Package size={24} />
            </div>
            <h3>Investment Packages</h3>
            <p>Unlock daily withdrawals with Elite or Premium plans.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Banknote size={24} />
            </div>
            <h3>Bank Withdrawals</h3>
            <p>Withdraw straight to any Nigerian bank account.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Ready to start earning?</h2>
        <p>Join thousands of users already growing with Pitnex.</p>
        <Link href="/signup" className="primary-button">
          Create Free Account
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-brand">
          <div className="brand-icon small">P</div>
          <span>Pitnex</span>
        </div>
        <p>© {new Date().getFullYear()} Pitnex. All rights reserved.</p>
      </footer>
    </>
  );
}