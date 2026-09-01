"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Flame,
  ListChecks,
  Gamepad2,
  TrendingUp,
  ArrowDownToLine,
  Crown,
  X,
  Loader2,
} from "lucide-react";

import Header from "@/components/Header";
import WithdrawalTimer from "@/components/WithdrawalTimer";

export default function Dashboard() {
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function startUpgrade() {
    setMessage("");

    if (!email.trim()) {
      setMessage("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/payments/initialize",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            "Unable to start payment."
        );
      }

      if (!data.authorizationUrl) {
        throw new Error(
          "Paystack payment URL was not returned."
        );
      }

      window.location.href =
        data.authorizationUrl;
    } catch (error) {
      setMessage(
        error.message ||
          "Unable to start payment."
      );
      setLoading(false);
    }
  }

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
                <button
                  type="button"
                  className="invest-button"
                  onClick={() =>
                    setShowUpgrade(true)
                  }
                >
                  <Crown
                    size={16}
                    style={{
                      marginRight: "6px",
                    }}
                  />
                  Upgrade
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
            <Link
              href="/check-in"
              className="dashboard-item"
            >
              <Flame />
              <span>Check-in</span>
            </Link>

            <Link
              href="/tasks"
              className="dashboard-item"
            >
              <ListChecks />
              <span>Tasks</span>
            </Link>

            <Link
              href="/games"
              className="dashboard-item"
            >
              <Gamepad2 />
              <span>Games</span>
            </Link>

            <Link
              href="/packages"
              className="dashboard-item"
            >
              <TrendingUp />
              <span>Packages</span>
            </Link>

            <Link
              href="/withdraw"
              className="dashboard-item"
            >
              <ArrowDownToLine />
              <span>Withdraw</span>
            </Link>
          </div>
        </section>
      </main>

      {showUpgrade && (
        <div
          onClick={() => {
            if (!loading) {
              setShowUpgrade(false);
              setMessage("");
            }
          }}
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0, 0, 0, 0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(event) =>
              event.stopPropagation()
            }
            style={{
              width: "100%",
              maxWidth: "430px",
              background: "#fff",
              borderRadius: "22px",
              padding: "26px",
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.2)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent:
                  "space-between",
                gap: "16px",
              }}
            >
              <div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent:
                      "center",
                    width: "46px",
                    height: "46px",
                    borderRadius: "14px",
                    background: "#111",
                    color: "#fff",
                    marginBottom: "14px",
                  }}
                >
                  <Crown size={22} />
                </div>

                <h2
                  style={{
                    margin: 0,
                    fontSize: "24px",
                  }}
                >
                  Upgrade your account
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowUpgrade(false)
                }
                disabled={loading}
                aria-label="Close"
                style={{
                  border: 0,
                  background: "transparent",
                  cursor: loading
                    ? "not-allowed"
                    : "pointer",
                  padding: "4px",
                }}
              >
                <X size={22} />
              </button>
            </div>

            <p
              style={{
                marginTop: "14px",
                lineHeight: 1.6,
                opacity: 0.7,
              }}
            >
              Upgrade your PITNEX account for
              <strong> ₦1,700</strong>.
              Successful payment activates your
              upgraded account.
            </p>

            <div
              style={{
                margin: "20px 0",
                padding: "18px",
                borderRadius: "14px",
                background: "#f6f6f6",
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  opacity: 0.65,
                }}
              >
                UPGRADE FEE
              </div>

              <div
                style={{
                  fontSize: "28px",
                  fontWeight: 800,
                  marginTop: "4px",
                }}
              >
                ₦1,700
              </div>
            </div>

            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: 700,
                marginBottom: "8px",
              }}
            >
              Email address
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="you@example.com"
              disabled={loading}
              autoComplete="email"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "14px",
                borderRadius: "12px",
                border: "1px solid #ddd",
                outline: "none",
                fontSize: "15px",
              }}
            />

            {message && (
              <p
                style={{
                  marginTop: "12px",
                  color: "#b42318",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                {message}
              </p>
            )}

            <button
              type="button"
              onClick={startUpgrade}
              disabled={loading}
              style={{
                width: "100%",
                marginTop: "18px",
                padding: "15px",
                border: 0,
                borderRadius: "12px",
                background: "#111",
                color: "#fff",
                cursor: loading
                  ? "not-allowed"
                  : "pointer",
                fontSize: "16px",
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              {loading ? (
                <>
                  <Loader2
                    size={18}
                    className="pitnex-spin"
                  />
                  Connecting to Paystack...
                </>
              ) : (
                <>
                  <Crown size={18} />
                  Pay ₦1,700 & Upgrade
                </>
              )}
            </button>

            <p
              style={{
                textAlign: "center",
                fontSize: "12px",
                opacity: 0.55,
                marginTop: "14px",
              }}
            >
              You will be redirected to
              Paystack to complete your payment
              securely.
            </p>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes pitnex-spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        .pitnex-spin {
          animation: pitnex-spin 1s linear infinite;
        }
      `}</style>
    </>
  );
}