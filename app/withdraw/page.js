"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import WithdrawalTimer from "@/components/WithdrawalTimer";

export default function WithdrawPage() {
  const [wallet, setWallet] = useState(null);
  const [loadingWallet, setLoadingWallet] = useState(true);

  const [form, setForm] = useState({
    amount: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadWallet() {
    try {
      setLoadingWallet(true);

      const response = await fetch(
        "/api/wallet/balance",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Unable to load wallet."
        );
      }

      setWallet(data.wallet);
    } catch (err) {
      setError(
        err.message || "Unable to load wallet balance."
      );
    } finally {
      setLoadingWallet(false);
    }
  }

  useEffect(() => {
    loadWallet();
  }, []);

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function submitWithdrawal(event) {
    event.preventDefault();

    setError("");
    setMessage("");

    const amount = Number(form.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Enter a valid withdrawal amount.");
      return;
    }

    if (!form.bankName.trim()) {
      setError("Enter your bank name.");
      return;
    }

    if (!/^\d{10}$/.test(form.accountNumber.trim())) {
      setError("Enter a valid 10-digit account number.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        "/api/withdraw",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount,
            bankName: form.bankName.trim(),
            accountNumber: form.accountNumber.trim(),
            accountName: form.accountName.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (
          data.code === "UPGRADE_REQUIRED"
        ) {
          throw new Error(
            "You must upgrade your PITNEX account before you can withdraw."
          );
        }

        throw new Error(
          data.error ||
            "Unable to submit withdrawal request."
        );
      }

      setMessage(
        `Withdrawal request submitted successfully. Reference: ${data.withdrawal.reference}`
      );

      setForm({
        amount: "",
        bankName: "",
        accountNumber: "",
        accountName: "",
      });

      await loadWallet();
    } catch (err) {
      setError(
        err.message ||
          "Unable to submit withdrawal request."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const balance =
    wallet?.balanceNaira ??
    (wallet?.balanceKobo != null
      ? Number(wallet.balanceKobo) / 100
      : 0);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f7f8fa",
        padding: "24px 16px 60px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "620px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            marginBottom: "24px",
          }}
        >
          <Link
            href="/dashboard"
            style={{
              color: "#667085",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            ← Back to dashboard
          </Link>

          <h1
            style={{
              margin: "16px 0 6px",
              fontSize: "30px",
              fontWeight: 800,
              color: "#101828",
            }}
          >
            Withdraw
          </h1>

          <p
            style={{
              margin: 0,
              color: "#667085",
              lineHeight: 1.6,
            }}
          >
            Request a withdrawal from your PITNEX wallet.
          </p>
        </div>

        {/* WALLET BALANCE */}
        <section
          style={{
            background: "#111827",
            color: "#fff",
            borderRadius: "20px",
            padding: "24px",
            marginBottom: "18px",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#9ca3af",
              fontSize: "14px",
            }}
          >
            Available balance
          </p>

          <div
            style={{
              marginTop: "8px",
              fontSize: "34px",
              fontWeight: 800,
            }}
          >
            {loadingWallet
              ? "Loading..."
              : `₦${balance.toLocaleString(
                  "en-NG",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}`}
          </div>
        </section>

        {/* WITHDRAWAL TIMER */}
        <div
          style={{
            marginBottom: "18px",
          }}
        >
          <WithdrawalTimer />
        </div>

        {/* ALERTS */}
        {error && (
          <div
            style={{
              marginBottom: "18px",
              padding: "14px 16px",
              borderRadius: "12px",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#b91c1c",
              fontSize: "14px",
              lineHeight: 1.5,
            }}
          >
            {error}
          </div>
        )}

        {message && (
          <div
            style={{
              marginBottom: "18px",
              padding: "14px 16px",
              borderRadius: "12px",
              background: "#ecfdf3",
              border: "1px solid #a7f3d0",
              color: "#047857",
              fontSize: "14px",
              lineHeight: 1.5,
            }}
          >
            {message}
          </div>
        )}

        {/* WITHDRAWAL FORM */}
        <section
          style={{
            background: "#fff",
            border: "1px solid #e4e7ec",
            borderRadius: "20px",
            padding: "24px",
          }}
        >
          <h2
            style={{
              margin: "0 0 20px",
              fontSize: "20px",
              fontWeight: 800,
              color: "#101828",
            }}
          >
            Bank details
          </h2>

          <form onSubmit={submitWithdrawal}>
            <label style={labelStyle}>
              Withdrawal amount (₦)

              <input
                name="amount"
                type="number"
                min="1"
                step="1"
                value={form.amount}
                onChange={updateField}
                placeholder="Enter amount"
                required
                style={inputStyle}
              />
            </label>

            <label style={labelStyle}>
              Bank name

              <input
                name="bankName"
                type="text"
                value={form.bankName}
                onChange={updateField}
                placeholder="e.g. GTBank"
                required
                style={inputStyle}
              />
            </label>

            <label style={labelStyle}>
              Account number

              <input
                name="accountNumber"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={form.accountNumber}
                onChange={updateField}
                placeholder="10-digit account number"
                required
                style={inputStyle}
              />
            </label>

            <label style={labelStyle}>
              Account name

              <input
                name="accountName"
                type="text"
                value={form.accountName}
                onChange={updateField}
                placeholder="Name on bank account"
                style={inputStyle}
              />
            </label>

            <div
              style={{
                marginTop: "20px",
                padding: "14px",
                borderRadius: "12px",
                background: "#f8fafc",
                color: "#667085",
                fontSize: "13px",
                lineHeight: 1.6,
              }}
            >
              Withdrawal requests are accepted only during
              the daily withdrawal window. Your account must
              also be upgraded before a withdrawal can be
              submitted.
            </div>

            <button
              type="submit"
              disabled={submitting || loadingWallet}
              style={{
                width: "100%",
                marginTop: "20px",
                padding: "15px",
                border: "none",
                borderRadius: "12px",
                background:
                  submitting || loadingWallet
                    ? "#98a2b3"
                    : "#111827",
                color: "#fff",
                fontSize: "16px",
                fontWeight: 800,
                cursor:
                  submitting || loadingWallet
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {submitting
                ? "Submitting..."
                : "Request Withdrawal"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: "18px",
  color: "#344054",
  fontSize: "14px",
  fontWeight: 700,
};

const inputStyle = {
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  marginTop: "8px",
  padding: "13px 14px",
  border: "1px solid #d0d5dd",
  borderRadius: "10px",
  background: "#fff",
  color: "#101828",
  fontSize: "15px",
  outline: "none",
};