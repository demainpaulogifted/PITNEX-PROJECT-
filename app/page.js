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

const earningSteps = [
  {
    number: "01",
    icon: Users,
    title: "Create your account",
    text: "Sign up for your free PITNEX account and get access to your personal earning dashboard.",
  },
  {
    number: "02",
    icon: Target,
    title: "Complete tasks",
    text: "Choose available tasks, follow the instructions, and submit your proof when required.",
  },
  {
    number: "03",
    icon: Coins,
    title: "Earn rewards",
    text: "Approved tasks add rewards to your PITNEX wallet so you can track what you have earned.",
  },
  {
    number: "04",
    icon: Landmark,
    title: "Withdraw",
    text: "Once your account meets the withdrawal requirements and the withdrawal window is open, request payment to your bank account.",
  },
];

const earningMethods = [
  {
    icon: Sparkles,
    title: "Article Tasks",
    text: "Read and engage with selected articles published through THE INDEX and complete the required task.",
    reward: "From ₦180",
  },
  {
    icon: Zap,
    title: "Custom Tasks",
    text: "Complete other promotional and engagement tasks made available by PITNEX administrators.",
    reward: "Varies by task",
  },
  {
    icon: Gift,
    title: "Invite & Earn",
    text: "Invite people using your personal referral link and earn when eligible referrals qualify.",
    reward: "₦500",
  },
  {
    icon: Wallet,
    title: "Wallet Rewards",
    text: "Keep track of your task rewards, referral rewards and other approved earnings in one wallet.",
    reward: "Track everything",
  },
];

const faqs = [
  {
    question: "What is PITNEX?",
    answer:
      "PITNEX is an earning platform where registered users can complete eligible tasks, earn rewards, invite qualifying users and manage their earnings through a personal wallet.",
  },
  {
    question: "Do I need to pay to create an account?",
    answer:
      "No. Creating a PITNEX account is free. Account upgrading is a separate step required before withdrawals can be requested.",
  },
  {
    question: "How much does the account upgrade cost?",
    answer:
      "The PITNEX account upgrade costs ₦1,700. Payments are processed securely through Paystack.",
  },
  {
    question: "How do I earn from article tasks?",
    answer:
      "When an article task is available, open the assigned article, follow the task instructions and submit the required proof. Once your submission is approved, the reward is added to your wallet.",
  },
  {
    question: "How much can I earn from referrals?",
    answer:
      "PITNEX provides a ₦500 referral reward when a referred user meets the qualifying requirements. Referral abuse and duplicate rewards are prevented by the platform.",
  },
  {
    question: "Can I withdraw immediately after upgrading?",
    answer:
      "No. Upgrading your account makes you eligible to meet the withdrawal requirement, but withdrawals are still controlled by the platform's global withdrawal schedule and other eligibility checks.",
  },
  {
    question: "Is PITNEX available on mobile?",
    answer:
      "Yes. PITNEX is designed with mobile users in mind, so you can create an account, complete tasks, check your wallet and manage your account from your phone.",
  },
];

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={() => setMenuOpen(false)}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-lg font-black text-white">
              P
            </div>

            <div>
              <div className="text-xl font-black tracking-tight">
                PITNEX
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Earn. Complete. Grow.
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#how-it-works"
              className="text-sm font-semibold text-slate-600 transition hover:text-slate-950"
            >
              How It Works
            </a>

            <a
              href="#earn"
              className="text-sm font-semibold text-slate-600 transition hover:text-slate-950"
            >
              Ways to Earn
            </a>

            <a
              href="#faq"
              className="text-sm font-semibold text-slate-600 transition hover:text-slate-950"
            >
              FAQ
            </a>

            <Link
              href="/login"
              className="text-sm font-bold text-slate-700 hover:text-slate-950"
            >
              Log in
            </Link>

            <Link
              href="/signup"
              className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800"
            >
              Create Account
            </Link>
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            className="rounded-xl border border-slate-200 p-2 md:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-slate-200 bg-white px-5 py-5 md:hidden">
            <nav className="flex flex-col gap-2">
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
                className="mt-2 rounded-xl bg-slate-950 px-4 py-3 text-center font-bold text-white"
              >
                Create Account
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-slate-100 blur-3xl" />
        <div className="absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-slate-100 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:py-20 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-28">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700">
              <Sparkles className="h-4 w-4" />
              A smarter way to earn from tasks
            </div>

            <h1 className="max-w-3xl text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-7xl">
              Turn simple tasks into{" "}
              <span className="text-slate-500">
                real rewards.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              PITNEX gives you a simple way to discover eligible tasks,
              complete them from your phone, earn rewards, invite others and
              manage your earnings from one personal dashboard.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-4 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Create Free Account
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-4 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
              >
                Log in to PITNEX
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Free account creation
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Mobile friendly
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Wallet tracking
              </div>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
            <div className="rounded-[2rem] bg-slate-950 p-3 shadow-2xl">
              <div className="overflow-hidden rounded-[1.5rem] bg-white">
                <div className="border-b border-slate-200 px-5 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-500">
                        PITNEX WALLET
                      </p>
                      <p className="mt-1 text-3xl font-black">
                        ₦12,480
                      </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">
                      <Wallet className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 p-5">
                  <div className="rounded-2xl bg-slate-950 p-5 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-slate-400">
                          TODAY
                        </p>
                        <p className="mt-1 text-2xl font-black">
                          ₦540
                        </p>
                      </div>

                      <div className="rounded-xl bg-white/10 p-3">
                        <Coins className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="mt-5 h-2 rounded-full bg-white/10">
                      <div className="h-2 w-2/3 rounded-full bg-white" />
                    </div>

                    <p className="mt-2 text-xs text-slate-400">
                      4 of 6 daily task opportunities
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <p className="text-xs font-semibold text-slate-500">
                        TASK REWARD
                      </p>
                      <p className="mt-2 text-xl font-black">
                        +₦180
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Article task
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 p-4">
                      <p className="text-xs font-semibold text-slate-500">
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

                  <div className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                        <ShieldCheck className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="text-sm font-bold">
                          Everything in one dashboard
                        </p>
                        <p className="text-xs text-slate-500">
                          Tasks, wallet, referrals and account status
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:block">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
                  <Gift className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-500">
                    INVITE & EARN
                  </p>
                  <p className="font-black">₦500 reward</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-7xl grid-cols-2 px-5 py-8 sm:grid-cols-4 lg:px-8">
          <div className="border-slate-200 px-4 py-4 text-center sm:border-r">
            <p className="text-2xl font-black sm:text-3xl">
              ₦180
            </p>
            <p className="mt-1 text-xs font-semibold text-slate-500 sm:text-sm">
              Default article reward
            </p>
          </div>

          <div className="border-slate-200 px-4 py-4 text-center sm:border-r">
            <p className="text-2xl font-black sm:text-3xl">
              ₦500
            </p>
            <p className="mt-1 text-xs font-semibold text-slate-500 sm:text-sm">
              Referral reward
            </p>
          </div>

          <div className="border-slate-200 px-4 py-4 text-center sm:border-r">
            <p className="text-2xl font-black sm:text-3xl">
              6
            </p>
            <p className="mt-1 text-xs font-semibold text-slate-500 sm:text-sm">
              Daily task limit
            </p>
          </div>

          <div className="px-4 py-4 text-center">
            <p className="text-2xl font-black sm:text-3xl">
              ₦1,700
            </p>
            <p className="mt-1 text-xs font-semibold text-slate-500 sm:text-sm">
              Account upgrade
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="bg-white py-20 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
              How PITNEX works
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Start earning in four simple steps.
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              PITNEX is designed to keep the earning process straightforward:
              find an eligible task, complete it properly, get approved and
              track your reward.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {earningSteps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="relative rounded-3xl border border-slate-200 bg-slate-50 p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                      <Icon className="h-5 w-5" />
                    </div>

                    <span className="text-sm font-black text-slate-300">
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

      {/* Ways to earn */}
      <section
        id="earn"
        className="bg-slate-950 py-20 text-white sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              Ways to earn
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              More than one way to grow your wallet.
            </h2>

            <p className="mt-4 leading-7 text-slate-400">
              Available opportunities can change over time. Your PITNEX
              dashboard is where you will find tasks currently available to
              your account.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {earningMethods.map((method) => {
              const Icon = method.icon;

              return (
                <div
                  key={method.title}
                  className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 transition hover:bg-white/[0.09]"
                >
                  <div className="flex items-start justify-between gap-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-950">
                      <Icon className="h-5 w-5" />
                    </div>

                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-slate-200">
                      {method.reward}
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-black">
                    {method.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-400">
                    {method.text}
                  </p>
      