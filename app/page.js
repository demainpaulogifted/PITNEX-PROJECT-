"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Wallet,
  Users,
  Zap,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* HEADER */}
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <Link
            href="/"
            className="flex items-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400 font-black text-slate-950">
              P
            </div>

            <span className="text-xl font-black">
              PITNEX
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-xl px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white sm:block"
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-black text-slate-950 hover:bg-emerald-300"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="px-5 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-300">
            <ShieldCheck className="h-4 w-4" />
            Simple. Transparent. Built for earning.
          </div>

          <h1 className="mt-7 text-4xl font-black tracking-tight sm:text-6xl">
            Earn from simple
            <span className="text-emerald-400"> online tasks.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            PITNEX is a simple earning platform where members can complete
            eligible tasks, earn rewards, invite others and manage their
            earnings from one secure wallet.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-7 py-4 font-black text-slate-950 hover:bg-emerald-300"
            >
              Create Free Account
              <ArrowRight className="h-5 w-5" />
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-7 py-4 font-bold text-white hover:bg-white/10"
            >
              Login
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Daily tasks
            </span>

            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              ₦180 task reward
            </span>

            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              ₦500 referrals
            </span>
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section className="px-5 pb-20">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-[2rem] border border-white/10 bg-slate-900 p-4 shadow-2xl sm:p-6">
            <div className="rounded-3xl border border-white/10 bg-slate-950 p-5 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    Wallet Balance
                  </p>

                  <p className="mt-2 text-3xl font-black sm:text-4xl">
                    ₦12,480
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10">
                  <Wallet className="h-6 w-6 text-emerald-400" />
                </div>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-white/[0.04] p-4">
                  <Zap className="h-5 w-5 text-emerald-400" />
                  <p className="mt-3 text-sm text-slate-500">
                    Today's Tasks
                  </p>
                  <p className="mt-1 text-xl font-black">
                    4 / 6
                  </p>
                </div>

                <div className="rounded-2xl bg-white/[0.04] p-4">
                  <Users className="h-5 w-5 text-emerald-400" />
                  <p className="mt-3 text-sm text-slate-500">
                    Referrals
                  </p>
                  <p className="mt-1 text-xl font-black">
                    12
                  </p>
                </div>

                <div className="rounded-2xl bg-white/[0.04] p-4">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  <p className="mt-3 text-sm text-slate-500">
                    Account
                  </p>
                  <p className="mt-1 text-xl font-black text-emerald-400">
                    Active
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-t border-white/10 px-5 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-400">
              How it works
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Start earning in three simple steps.
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <span className="text-sm font-black text-emerald-400">
                01
              </span>

              <h3 className="mt-5 text-xl font-black">
                Create an account
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Register your PITNEX account and access your personal
                dashboard.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <span className="text-sm font-black text-emerald-400">
                02
              </span>

              <h3 className="mt-5 text-xl font-black">
                Complete tasks
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Complete eligible tasks and submit the required proof for
                review.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <span className="text-sm font-black text-emerald-400">
                03
              </span>

              <h3 className="mt-5 text-xl font-black">
                Earn & withdraw
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Approved rewards enter your wallet. Eligible members can
                request withdrawals during the active withdrawal window.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="border-t border-white/10 bg-slate-900 px-5 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <ShieldCheck className="mx-auto h-10 w-10 text-emerald-400" />

          <h2 className="mt-5 text-3xl font-black sm:text-4xl">
            Built with simple rules and clear rewards.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            Your account, tasks, wallet and transactions are connected to
            your authenticated PITNEX profile. Rewards and withdrawals are
            processed according to the platform's eligibility rules.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
              ₦180 standard task reward
            </span>

            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
              ₦500 referral reward
            </span>

            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
              6 daily tasks
            </span>

            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
              ₦1,700 upgrade
            </span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-20">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-emerald-400/20 bg-emerald-400/10 px-6 py-14 text-center sm:px-10">
          <h2 className="text-3xl font-black sm:text-4xl">
            Ready to get started?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            Create your PITNEX account and start exploring available earning
            opportunities.
          </p>

          <Link
            href="/signup"
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-emerald-400 px-7 py-4 font-black text-slate-950 hover:bg-emerald-300"
          >
            Create Account
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 px-5 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} PITNEX. All rights reserved.
          </p>

          <p>
            Simple earning. Clear rewards.
          </p>
        </div>
      </footer>
    </main>
  );
}