import Link from "next/link";
import {
  Flame,
  ListChecks,
  Package,
  Landmark
} from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PhonePreview from "@/components/PhonePreview";

export default function Home() {
  const features = [
    {
      icon: Flame,
      title: "Daily Check-in",
      text: "Check in every 24 hours and earn ₦1,000 instantly."
    },
    {
      icon: ListChecks,
      title: "Simple Tasks",
      text: "Complete available tasks and earn rewards."
    },
    {
      icon: Package,
      title: "Investment Packages",
      text: "Explore available Elite and Premium packages."
    },
    {
      icon: Landmark,
      title: "Bank Withdrawals",
      text: "Withdraw your available balance to a Nigerian bank account during the global withdrawal window."
    }
  ];

  return (
    <>
      <Header />

      <main>

        {/* HERO */}

        <section className="hero">

          <div className="hero-content">

            <div className="hero-badge">
              <span></span>
              Nigeria's Smartest Earn Platform
            </div>

            <h1>
              Earn Daily.
              <br />
              <span>Grow Smarter</span>
              <br />
              With Pitnex
            </h1>

            <p>
              Complete simple tasks, check in daily,
              join exclusive packages and withdraw
              straight to your Nigerian bank account.
            </p>

            <div className="hero-buttons">

              <Link
                href="/dashboard"
                className="primary-button"
              >
                Start Earning Free
              </Link>

              <Link
                href="/packages"
                className="secondary-button"
              >
                View Packages
              </Link>

            </div>

          </div>

          <PhonePreview />

        </section>


        {/* FEATURES */}

        <section className="features">

          <div className="section-heading">

            <h2>
              Everything you need to earn
            </h2>

            <p>
              Simple tools designed for Nigerians
              who want real results.
            </p>

          </div>

          <div className="feature-grid">

            {features.map((feature) => {

              const Icon = feature.icon;

              return (
                <div
                  className="feature-card"
                  key={feature.title}
                >

                  <div className="feature-icon">
                    <Icon />
                  </div>

                  <h3>{feature.title}</h3>

                  <p>{feature.text}</p>

                </div>
              );
            })}

          </div>

        </section>


        {/* CTA */}

        <section className="cta">

          <h2>
            Ready to start earning?
          </h2>

          <p>
            Create your free Pitnex account
            and get started.
          </p>

          <Link
            href="/dashboard"
            className="primary-button"
          >
            Create Free Account
          </Link>

        </section>

      </main>

      <Footer />
    </>
  );
}