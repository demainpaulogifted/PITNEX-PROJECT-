"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Coins,
  Gift,
  Landmark,
  Menu,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";

const steps = [
  {
    icon: Users,
    number: "01",
    title: "Create your account",
    text: "Join PITNEX and get your personal dashboard for tasks, earnings and account management.",
  },
  {
    icon: Target,
    number: "02",
    title: "Complete tasks",
    text: "Choose an available task, follow the instructions and submit your proof when required.",
  },
  {
    icon: Coins,
    number: "03",
    title: "Earn rewards",
    text: "Approved tasks add rewards to your PITNEX wallet where you can track your earnings.",
  },
  {
    icon: Landmark,
    number: "04",
    title: "Withdraw",
    text: "After meeting the account requirements and when withdrawals are open, request payment to your bank.",
  },
];

const earningMethods = [
  {
    icon: Sparkles,
    title: "Article Tasks",
    reward: "From ₦180",
    text: "Complete eligible article tasks connected to content published through THE INDEX.",
  },
  {
    icon: Zap,
    title: "Custom Tasks",
    reward: "Varies",
    text: "Take part in promotional and engagement tasks created by PITNEX administrators.",
  },
  {
    icon: Gift,
    title: "Invite & Earn",
    reward: "₦500",
    text: "Invite people using your personal referral link and earn when a referral qualifies.",
  },
  {
    icon: Wallet,
    title: "Your Wallet",
    reward: "Track earnings",
    text: "See your approved task rewards, referral rewards and other wallet activity in one place.",
  },
];

const faqs = [
  {
    q: "What is PITNEX?",
    a: "PITNEX is an earning platform where registered users can complete eligible tasks, earn rewards, invite qualifying users and manage their earnings through a personal wallet.",
  },
  {
    q: "Is creating a PITNEX account free?",
    a: "Yes. Creating an account is free. Account upgrading is a separate requirement for withdrawal eligibility.",
  },
  {
    q: "How much is the account upgrade?",
    a: "The PITNEX account upgrade costs ₦1,700 and payments are processed through Paystack.",
  },
  {
    q: "How much can I earn from an article task?",
    a: "The default article task reward is ₦180. Actual task availability and rewards may vary.",
  },
  {
    q: "How much is the referral reward?",
    a: "A qualifying referral can earn the inviter a ₦500 reward. PITNEX uses protections against self-referrals and duplicate rewards.",
  },
  {
    q: "Can I withdraw immediately after upgrading?",
    a: "No. Upgrading is required before withdrawal, but withdrawals are also controlled by the platform's global withdrawal schedule and other eligibility checks.",
  },
];

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 font-black text-white">
              P
            </div>

            <div>
              <div className="text-xl font-black tracking-tight">
                PITNEX
              </div>
              <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">
                Earn. Complete. Grow.
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            <a
              href="#how-it-works"
              className="text-sm font-semibold text-slate-600 hover:text-slate-950"
            >
              How It Works
            </a>

            <a
              href="#earn"
              className="text-sm font-semibold text-slate-600 hover:text-slate-950"
            >
              Ways to Earn
            </a>

            <a
              href="#faq"
              className="text-sm font-semibold text-slate-600 hover:text-slate-950"
            >
              FAQ
            </a>

            <Link
              href="/login"
              className="text-sm font-bold text-slate-700"
            >
              Log in
            </Link>

            <Link
              href="/signup"
              className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800"
            >
              Create Account
            </Link>
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-xl border border-slate-200 p-2 md:hidden"
            aria-label="Open menu"
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-slate-200 bg-white px-5 py-4 md:hidden">
            <div className="flex flex-col gap-2">
              <a
                href="#how-it-works"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 font-semibold hover:bg-slate-50"
              >
                How It Works
              </a>

              <a
                href="#earn"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 font-semibold hover:bg-slate-50"
              >
                Ways to Earn
              </a>

              <a
                href="#faq"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 font-semibold hover:bg-slate-50"
              >
                FAQ
              </a>

              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 font-semibold hover:bg-slate-50"
              >
                Log in
              </Link>

              <Link
                href="/signup"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl bg-slate-950 px-4 py-3 text-center font-bold text-white"
              >
                Create Account
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="overflow-hidden bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:py-20 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-28">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700">
              <Sparkles className="h-4 w-4" />
              Simple tasks. Real rewards.
            </div>

            <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Complete tasks.
              <br />
              <span className="text-slate-500">
                Earn rewards.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              PITNEX gives you a simple way to discover eligible tasks,
              complete them from your phone, earn rewards, invite others and
              manage your earnings from one personal dashboard.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-4 text-sm font-bold text-white shadow-lg hover:bg-slate-800"
              >
                Create Free Account
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-6 py-4 text-sm font-bold hover:bg-slate-50"
              >
                Log in
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-slate-600">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Free signup
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Mobile friendly
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Personal wallet
              </span>
            </div>
          </div>

          {/* HERO DASHBOARD PREVIEW */}
          <div className="mx-auto w-full max-w-lg">
            <div className="rounded-[2rem] bg-slate-950 p-3 shadow-2xl">
              <div className="rounded-[1.5rem] bg-white p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-500">
                      WALLET BALANCE
                    </p>
                    <p className="mt-1 text-4xl font-black">
                      ₦12,480
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                    <Wallet className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-6 rounded-2xl bg-slate-950 p-5 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-400">
                        TODAY'S EARNINGS
                      </p>
                      <p className="mt-1 text-2xl font-black">
                        ₦540
                      </p>
                    </div>

                    <Coins className="h-6 w-6" />
                  </div>

                  <div className="mt-5 h-2 rounded-full bg-white/10">
                    <div className="h-2 w-2/3 rounded-full bg-white" />
                  </div>

                  <p className="mt-2 text-xs text-slate-400">
                    4 of 6 daily task opportunities
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <p className="text-xs font-bold text-slate-500">
                      TASK
                    </p>
                    <p className="mt-2 text-xl font-black">
                      +₦180
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Article task
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4">
                    <p className="text-xs font-bold text-slate-500">
                      REFERRAL
                    </p>
                    <p className="mt-2 text-xl font-black">
                      +₦500
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Qualifying referral
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-200 p-4">
                  <ShieldCheck className="h-5 w-5" />
                  <div>
                    <p className="text-sm font-bold">
                      Your earnings dashboard
                    </p>
                    <p className="text-xs text-slate-500">
                      Tasks, wallet and referrals in one place
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK FACTS */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-7xl grid-cols-2 sm:grid-cols-4">
          <div className="border-b border-slate-200 p-6 text-center sm:border-b-0 sm:border-r">
            <p className="text-2xl font-black">₦180</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              Default article reward
            </p>
          </div>

          <div className="border-b border-slate-200 p-6 text-center sm:border-b-0 sm:border-r">
            <p className="text-2xl font-black">₦500</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              Referral reward
            </p>
          </div>

          <div className="border-slate-200 p-6 text-center sm:border-r">
            <p className="text-2xl font-black">6</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              Daily task limit
            </p>
          </div>

          <div className="p-6 text-center">
            <p className="text-2xl font-black">₦1,700</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              Account upgrade
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
            How it works
          </p>

          <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">
            A simple path from task to reward.
          </h2>

          <p className="mt-4 max-w-2xl leading-7 text-slate-600">
            PITNEX keeps the process straightforward so you can focus on
            completing genuine tasks and tracking your progress.
          </p>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                      <Icon className="h-5 w-5" />
                    </div>

                    <span className="font-black text-slate-300">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mt-6 text-lg font-black">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {step.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* WAYS TO EARN */}
      <section
        id="earn"
        className="border-t border-white/10 bg-slate-950 py-20 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-sm font-semibold text-emerald-300">
              <Coins className="h-4 w-4" />
              Ways to earn
            </div>

            <h2 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-5xl">
              Turn simple online activities into earnings.
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-400 sm:text-lg">
              PITNEX gives you different ways to earn inside one account.
              Complete available tasks, build your network and manage your
              earnings from your wallet.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {earningMethods.map((method) => (
              <div
                key={method.title}
                className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-white/[0.05]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                  <method.icon className="h-6 w-6" />
                </div>

                <h3 className="mt-6 text-lg font-bold text-white">
                  {method.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {method.text}
                </p>

                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-emerald-300">
                  <CheckCircle2 className="h-4 w-4" />
                  Available inside PITNEX
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* UPGRADE */}
      <section
        id="upgrade"
        className="border-t border-white/10 bg-slate-900 py-20 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[2rem] border border-emerald-400/20 bg-gradient-to-br from-emerald-500/10 via-slate-900 to-slate-950">
            <div className="grid gap-10 p-7 sm:p-10 lg:grid-cols-2 lg:p-14">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-sm font-semibold text-emerald-300">
                  <Zap className="h-4 w-4" />
                  PITNEX Upgrade
                </div>

                <h2 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-5xl">
                  Unlock the full earning experience.
                </h2>

                <p className="mt-5 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">
                  Upgrade your PITNEX account for ₦1,700 and unlock the
                  features required to participate fully in the platform,
                  including withdrawal access once the withdrawal window is
                  open.
                </p>

                <div className="mt-8 space-y-4">
                  {[
                    "Access the full PITNEX earning experience",
                    "Complete eligible tasks and earn rewards",
                    "Build your referral network",
                    "Use your PITNEX wallet to track earnings",
                    "Become eligible to request withdrawals when available",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                      <span className="text-sm leading-6 text-slate-300 sm:text-base">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-6 py-3.5 text-sm font-black text-slate-950 transition hover:bg-emerald-300"
                  >
                    Upgrade from dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
                  >
                    Create account
                  </Link>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-400">
                        Account upgrade
                      </p>
                      <p className="mt-1 text-2xl font-black text-white">
                        PITNEX Premium
                      </p>
                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10">
                      <ShieldCheck className="h-6 w-6 text-emerald-300" />
                    </div>
                  </div>

                  <div className="my-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-center">
                    <p className="text-sm font-medium text-slate-400">
                      One-time upgrade
                    </p>

                    <p className="mt-2 text-4xl font-black text-white">
                      ₦1,700
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                      Secure payment through Paystack
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-2xl bg-white/[0.03] px-4 py-3">
                      <span className="text-sm text-slate-400">
                        Task access
                      </span>
                      <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                    </div>

                    <div className="flex items-center justify-between rounded-2xl bg-white/[0.03] px-4 py-3">
                      <span className="text-sm text-slate-400">
                        Referral earnings
                      </span>
                      <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                    </div>

                    <div className="flex items-center justify-between rounded-2xl bg-white/[0.03] px-4 py-3">
                      <span className="text-sm text-slate-400">
                        Withdrawal eligibility
                      </span>
                      <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INVITE & EARN */}
      <section
        id="referrals"
        className="border-t border-white/10 bg-slate-950 py-20 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-sm font-semibold text-amber-300">
                <Gift className="h-4 w-4" />
                Invite & Earn
              </div>

              <h2 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-5xl">
                Grow with your network.
              </h2>

              <p className="mt-5 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">
                Invite people to PITNEX using your personal referral link.
                When an eligible referral qualifies, you can earn a ₦500
                referral reward.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                  <Users className="h-6 w-6 text-emerald-300" />

                  <p className="mt-5 text-2xl font-black text-white">
                    ₦500
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Referral reward
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                  <Target className="h-6 w-6 text-emerald-300" />

                  <p className="mt-5 text-2xl font-black text-white">
                    Simple
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Share your referral link
                  </p>
                </div>
              </div>

              <div className="mt-8 flex items-start gap-3 rounded-2xl border border-amber-400/10 bg-amber-400/5 p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />

                <p className="text-sm leading-6 text-slate-400">
                  Referral rewards are subject to PITNEX eligibility rules
                  and duplicate or self-referrals are not allowed.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-full bg-emerald-400/5 blur-3xl" />

              <div className="relative rounded-[2rem] border border-white/10 bg-slate-900 p-6 shadow-2xl sm:p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-400">
                      Referral dashboard
                    </p>

                    <p className="mt-1 text-2xl font-black text-white">
                      Invite & Earn
                    </p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10">
                    <Users className="h-6 w-6 text-emerald-300" />
                  </div>
                </div>

                <div className="mt-7 rounded-3xl border border-white/10 bg-slate-950 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Your referral reward
                  </p>

                  <div className="mt-2 flex items-end justify-between gap-4">
                    <p className="text-3xl font-black text-white">
                      ₦500
                    </p>

                    <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
                      Per qualifying referral
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
                      <span className="text-sm font-black text-emerald-300">
                        1
                      </span>
                    </div>

                    <div>
                      <p className="text-sm font-bold text-white">
                        Share your link
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Invite someone to join PITNEX
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
                      <span className="text-sm font-black text-emerald-300">
                        2
                      </span>
                    </div>

                    <div>
                      <p className="text-sm font-bold text-white">
                        Your referral qualifies
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Eligibility is checked automatically
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
                      <span className="text-sm font-black text-emerald-300">
                        3
                      </span>
                    </div>

                    <div>
                      <p className="text-sm font-bold text-white">
                        Reward enters your wallet
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Track it from your dashboard
                      </p>
                    </div>
                  </div>
                </div>

                <Link
                  href="/invite"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-sm font-black text-slate-950 transition hover:bg-slate-200"
                >
                  Open referral dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY PITNEX */}
      <section className="border-t border-white/10 bg-slate-900 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-semibold text-slate-300">
              <ShieldCheck className="h-4 w-4" />
              Built for clarity
            </div>

            <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-black tracking-tight text-white sm:text-5xl">
              Everything you need to manage your earning journey.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
              PITNEX keeps your tasks, rewards, referrals and wallet activity
              in one straightforward dashboard.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10">
                <Wallet className="h-6 w-6 text-emerald-300" />
              </div>

              <h3 className="mt-6 text-xl font-black text-white">
                One wallet
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Keep your eligible PITNEX earnings in one wallet and monitor
                your balance and transaction history.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10">
                <Target className="h-6 w-6 text-emerald-300" />
              </div>

              <h3 className="mt-6 text-xl font-black text-white">
                Clear tasks
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                See available tasks, understand what is required and submit
                your work directly from your account.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10">
                <Landmark className="h-6 w-6 text-emerald-300" />
              </div>

              <h3 className="mt-6 text-xl font-black text-white">
                Withdrawal control
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Withdrawal requests are controlled by account eligibility and
                the active PITNEX withdrawal schedule.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* FAQ */}
      <section
        id="faq"
        className="border-t border-white/10 bg-slate-950 py-20 sm:py-24"
      >
        <div className="mx-auto max-w-4xl px-5 sm:px-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-semibold text-slate-300">
              <ChevronDown className="h-4 w-4" />
              Frequently asked questions
            </div>

            <h2 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-5xl">
              Questions? We have answers.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
              Here are some of the common questions about joining and using
              PITNEX.
            </p>
          </div>

          <div className="mt-12 space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-left text-base font-bold text-white sm:text-lg">
                  <span>{faq.question}</span>

                  <ChevronDown className="h-5 w-5 shrink-0 text-slate-500 transition-transform group-open:rotate-180" />
                </summary>

                <p className="mt-4 max-w-3xl pr-8 text-sm leading-7 text-slate-400 sm:text-base">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="border-t border-white/10 bg-slate-900 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <div className="relative overflow-hidden rounded-[2rem] border border-emerald-400/20 bg-gradient-to-br from-emerald-500/15 via-slate-900 to-slate-950 px-6 py-14 text-center sm:px-12 sm:py-16">
            <div className="absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/20 blur-3xl" />

            <div className="relative">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/10">
                <Sparkles className="h-7 w-7 text-emerald-300" />
              </div>

              <h2 className="mx-auto mt-7 max-w-3xl text-3xl font-black tracking-tight text-white sm:text-5xl">
                Ready to start your PITNEX journey?
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
                Create your free account, explore available tasks and manage
                everything from your personal PITNEX dashboard.
              </p>

              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-7 py-4 text-sm font-black text-slate-950 transition hover:bg-emerald-300"
                >
                  Create your account
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-7 py-4 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    {/* FOOTER */}
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400 text-sm font-black text-slate-950">
                P
              </span>

              <span className="text-lg font-black tracking-tight text-white">
                PITNEX
              </span>
            </Link>

            <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
              A simple platform for completing eligible online activities,
              earning rewards and managing your PITNEX wallet.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400">
            <Link
              href="/dashboard"
              className="transition hover:text-white"
            >
              Dashboard
            </Link>

            <Link
              href="/tasks"
              className="transition hover:text-white"
            >
              Tasks
            </Link>

            <Link
              href="/invite"
              className="transition hover:text-white"
            >
              Invite & Earn
            </Link>

            <Link
              href="/login"
              className="transition hover:text-white"
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="transition hover:text-white"
            >
              Sign up
            </Link>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} PITNEX. All rights reserved.
          </p>

          <p>
            Built for a simple, transparent earning experience.
          </p>
        </div>
      </div>
    </footer>
  </div>
  );
}