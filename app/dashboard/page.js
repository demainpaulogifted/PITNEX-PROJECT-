"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownToLine,
  UserRound,
  LogOut,
  Loader2,
  ShieldCheck,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(null);

  const [loading, setLoading] = useState(true);
  const [walletLoading, setWalletLoading] =
    useState(true);

  const [upgradeOpen, setUpgradeOpen] =
    useState(false);

  const [upgradeLoading, setUpgradeLoading] =
    useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadAccount() {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          router.replace("/login");
          return;
        }

        if (mounted) {
          setUser(user);
        }
      } catch (err) {
        console.error(
          "Dashboard authentication error:",
          err
        );

        router.replace("/login");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadAccount();

    return () => {
      mounted = false;
    };
  }, [router]);

  useEffect(() => {
    if (!user) return;

    let mounted = true;

    async function loadWallet() {
      try {
        setWalletLoading(true);

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.access_token) {
          throw new Error(
            "Your session has expired. Please log in again."
          );
        }

        const response = await fetch(
          "/api/wallet/balance",
          {
            method: "GET",
            headers: {
              Authorization:
                `Bearer ${session.access_token}`,
            },
            cache: "no-store",
          }
        );

        const data =
          await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.error ||
              "Unable to load wallet."
          );
        }

        if (mounted) {
          setWallet(data.wallet);
        }
      } catch (err) {
        console.error(
          "Dashboard wallet error:",
          err
        );

        if (mounted) {
          setError(
            err?.message ||
              "Unable to load wallet balance."
          );
        }
      } finally {
        if (mounted) {
          setWalletLoading(false);
        }
      }
    }

    loadWallet();

    return () => {
      mounted = false;
    };
  }, [user]);

  async function handleLogout() {
    await supabase.auth.signOut();

    router.replace("/login");
    router.refresh();
  }

  async function handleUpgrade() {
    setError("");
    setMessage("");
    setUpgradeLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error(
          "Your session has expired. Please log in again."
        );
      }

      const response = await fetch(
        "/api/payments/initialize",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({}),
        }
      );

      const data =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            "Unable to initialize payment."
        );
      }

      if (!data.authorizationUrl) {
        throw new Error(
          "Paystack did not return a payment URL."
        );
      }

      window.location.href =
        data.authorizationUrl;
    } catch (err) {
      console.error(
        "Upgrade initialization error:",
        err
      );

      setError(
        err?.message ||
          "Unable to start upgrade payment."
      );

      setUpgradeLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="loading-page">
        <Loader2
          size={38}
          className="spinner"
        />

        <p>Loading your dashboard...</p>

        <style jsx>{`
          .loading-page {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 12px;
            background: #f7f7f7;
          }

          .loading-page p {
            margin: 0;
            color: #666;
          }

          .spinner {
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </main>
    );
  }

  const email =
    user?.email || "PITNEX Member";

  const balanceKobo =
    wallet?.balanceKobo ?? 0;

  const balanceNaira =
    Number(balanceKobo) / 100;

  const formattedBalance =
    balanceNaira.toLocaleString(
      "en-NG",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">
              PITNEX
            </p>

            <h1>
              Welcome back 👋
            </h1>

            <p className="email">
              {email}
            </p>
          </div>

          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            <LogOut size={17} />
            Logout
          </button>
        </header>

        {error && (
          <div className="alert error">
            {error}
          </div>
        )}

        {message && (
          <div className="alert success">
            {message}
          </div>
        )}

        <section className="balance-card">
          <div className="balance-top">
            <div className="wallet-icon">
              <Wallet size={24} />
            </div>

            <span>
              Available balance
            </span>
          </div>

          <div className="balance">
            {walletLoading ? (
              <Loader2
                size={28}
                className="spinner"
              />
            ) : (
              <>₦{formattedBalance}</>
            )}
          </div>

          <p>
            Your current PITNEX wallet balance
          </p>
        </section>

        <section className="quick-actions">
          <Link
            href="/tasks"
            className="action-card"
          >
            <ArrowUpRight size={21} />

            <div>
              <strong>
                Earn from Tasks
              </strong>

              <span>
                View available earning tasks
              </span>
            </div>
          </Link>

          <button
            type="button"
            className="action-card"
            onClick={() =>
              setUpgradeOpen(true)
            }
          >
            <ShieldCheck size={21} />

            <div>
              <strong>
                Upgrade Account
              </strong>

              <span>
                Upgrade for ₦1,700
              </span>
            </div>
          </button>

          <Link
            href="/withdraw"
            className="action-card"
          >
            <ArrowDownToLine size={21} />

            <div>
              <strong>
                Withdraw
              </strong>

              <span>
                Request a withdrawal
              </span>
            </div>
          </Link>

          <Link
            href="/profile"
            className="action-card"
          >
            <UserRound size={21} />

            <div>
              <strong>
                My Profile
              </strong>

              <span>
                Manage your account
              </span>
            </div>
          </Link>
        </section>
      </div>

      {upgradeOpen && (
        <div
          className="modal-backdrop"
          onClick={() =>
            !upgradeLoading &&
            setUpgradeOpen(false)
          }
        >
          <section
            className="upgrade-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              className="close-button"
              onClick={() =>
                !upgradeLoading &&
                setUpgradeOpen(false)
              }
            >
              <X size={20} />
            </button>

            <div className="upgrade-icon">
              <ShieldCheck size={30} />
            </div>

            <h2>
              Upgrade your PITNEX account
            </h2>

            <p>
              Complete the one-time ₦1,700
              account upgrade payment to
              unlock upgraded account
              features.
            </p>

            <div className="upgrade-price">
              ₦1,700
            </div>

            <button
              type="button"
              className="upgrade-button"
              onClick={handleUpgrade}
              disabled={upgradeLoading}
            >
              {upgradeLoading ? (
                <>
                  <Loader2
                    size={19}
                    className="spinner"
                  />
                  Opening Paystack...
                </>
              ) : (
                "Continue to Paystack"
              )}
            </button>

            <small>
              You will be redirected to
              Paystack to complete the
              payment securely.
            </small>
          </section>
        </div>
      )}

      <style jsx>{`
        .dashboard-page {
          min-height: 100vh;
          background: #f7f7f7;
          padding: 24px 16px 50px;
          box-sizing: border-box;
        }

        .dashboard-container {
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
        }

        .dashboard-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 24px;
        }

        .eyebrow {
          margin: 0 0 5px;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.14em;
        }

        h1 {
          margin: 0;
          font-size: 30px;
        }

        .email {
          margin: 7px 0 0;
          color: #777;
          font-size: 14px;
        }

        .logout-button {
          display: flex;
          align-items: center;
          gap: 7px;
          border: 1px solid #ddd;
          background: #fff;
          color: #111;
          border-radius: 10px;
          padding: 10px 13px;
          font-weight: 700;
          cursor: pointer;
        }

        .balance-card {
          background: #111;
          color: #fff;
          border-radius: 22px;
          padding: 25px;
          margin-bottom: 18px;
        }

        .balance-top {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #ccc;
          font-size: 14px;
        }

        .wallet-icon {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: #252525;
        }

        .balance {
          min-height: 48px;
          display: flex;
          align-items: center;
          margin-top: 17px;
          font-size: 38px;
          font-weight: 900;
        }

        .balance-card p {
          margin: 8px 0 0;
          color: #aaa;
          font-size: 13px;
        }

        .quick-actions {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 13px;
        }

        .action-card {
          min-height: 92px;
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 18px;
          border: 1px solid #e2e2e2;
          border-radius: 16px;
          background: #fff;
          color: #111;
          text-decoration: none;
          text-align: left;
          cursor: pointer;
          box-sizing: border-box;
        }

        .action-card > svg {
          flex-shrink: 0;
        }

        .action-card div {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .action-card strong {
          font-size: 15px;
        }

        .action-card span {
          color: #777;
          font-size: 12px;
          line-height: 1.4;
        }

        .alert {
          margin-bottom: 15px;
          padding: 12px 14px;
          border-radius: 11px;
          font-size: 14px;
        }

        .error {
          background: #fff1f1;
          color: #b42318;
        }

        .success {
          background: #effcf3;
          color: #18794e;
        }

        .modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(0, 0, 0, 0.55);
          box-sizing: border-box;
        }

        .upgrade-modal {
          position: relative;
          width: 100%;
          max-width: 420px;
          background: #fff;
          border-radius: 22px;
          padding: 30px 24px;
          text-align: center;
          box-sizing: border-box;
          box-shadow:
            0 25px 70px rgba(0, 0, 0, 0.2);
        }

        .close-button {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 50%;
          background: #f3f3f3;
          cursor: pointer;
        }

        .upgrade-icon {
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          border-radius: 17px;
          background: #111;
          color: #fff;
        }

        .upgrade-modal h2 {
          margin: 0;
          font-size: 24px;
        }

        .upgrade-modal p {
          margin: 12px 0 0;
          color: #666;
          line-height: 1.6;
        }

        .upgrade-price {
          margin: 20px 0;
          font-size: 32px;
          font-weight: 900;
        }

        .upgrade-button {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 15px;
          border: 0;
          border-radius: 12px;
          background: #111;
          color: #fff;
          font-weight: 800;
          font-size: 15px;
          cursor: pointer;
        }

        .upgrade-button:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .upgrade-modal small {
          display: block;
          margin-top: 13px;
          color: #888;
          line-height: 1.5;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 600px) {
          .dashboard-header {
            align-items: flex-start;
          }

          h1 {
            font-size: 25px;
          }

          .logout-button {
            padding: 9px;
          }

          .logout-button {
            font-size: 0;
          }

          .logout-button svg {
            width: 19px;
            height: 19px;
          }

          .balance {
            font-size: 32px;
          }

          .quick-actions {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}