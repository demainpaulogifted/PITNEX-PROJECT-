import Link from "next/link";
import {
  Flame,
  ListChecks,
  Gamepad2,
  TrendingUp,
  ArrowDownToLine
} from "lucide-react";

import Header from "@/components/Header";
import WithdrawalTimer from "@/components/WithdrawalTimer";

export default function Dashboard() {
  return (
    <>
      <Header />

      <main className="dashboard-page">

        <section className="dashboard-container">

          <div className="dashboard-card">

            <div className="dashboard-top">

              <div>
                <span className="dashboard-greeting">
                  GOOD AFTERNOON
                </span>

                <span className="wallet-label">
                  WALLET BALANCE
                </span>

                <strong className="wallet-balance">
                  ₦0.00
                </strong>
              </div>

              <div className="dashboard-actions">
                <button className="invest-button">
                  Invest
                </button>

                <Link
                  href="/withdraw"
                  className="withdraw-button"
                >
                  Withdraw
                </Link>
              </div>

            </div>

            <WithdrawalTimer />

          </div>


          <div className="dashboard-grid">

            <Link href="/check-in" className="dashboard-item">
              <Flame />
              <span>Check-in</span>
            </Link>

            <Link href="/tasks" className="dashboard-item">
              <ListChecks />
              <span>Tasks</span>
            </Link>

            <Link href="/games" className="dashboard-item">
              <Gamepad2 />
              <span>Games</span>
            </Link>

            <Link href="/packages" className="dashboard-item">
              <TrendingUp />
              <span>Packages</span>
            </Link>

            <Link href="/withdraw" className="dashboard-item">
              <ArrowDownToLine />
              <span>Withdraw</span>
            </Link>

          </div>

        </section>

      </main>
    </>
  );
}