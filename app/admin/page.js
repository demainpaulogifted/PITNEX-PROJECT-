"use client";

import { useState } from "react";

const ADMIN_EMAIL = "paulotubo9@gmail.com";

export default function AdminPage() {
  const [withdrawalMinutes, setWithdrawalMinutes] =
    useState(60);

  const [saved, setSaved] = useState(false);

  function saveSettings(event) {
    event.preventDefault();

    /*
      Temporary frontend control.

      The next backend step will persist this
      value securely in PitnexSetting and restrict
      changes to SUPER_ADMIN.
    */

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "24px",
        background: "#f7f7f7",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <header
          style={{
            marginBottom: "32px",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "13px",
              fontWeight: 700,
              textTransform: "uppercase",
              opacity: 0.6,
            }}
          >
            PITNEX ADMIN
          </p>

          <h1
            style={{
              margin: "8px 0",
              fontSize: "34px",
            }}
          >
            Control Center
          </h1>

          <p style={{ margin: 0, opacity: 0.7 }}>
            Administrator: {ADMIN_EMAIL}
          </p>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div className="admin-card">
            <strong>Tasks</strong>
            <span>Create and manage earning tasks</span>
          </div>

          <div className="admin-card">
            <strong>Submissions</strong>
            <span>Review user proof</span>
          </div>

          <div className="admin-card">
            <strong>Wallets</strong>
            <span>Monitor user earnings</span>
          </div>

          <div className="admin-card">
            <strong>Withdrawals</strong>
            <span>Manage withdrawal requests</span>
          </div>
        </section>

        <section
          style={{
            background: "#fff",
            borderRadius: "18px",
            padding: "24px",
            border: "1px solid #e5e5e5",
            marginBottom: "24px",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              marginBottom: "8px",
            }}
          >
            Global Withdrawal Timer
          </h2>

          <p
            style={{
              marginTop: 0,
              opacity: 0.7,
            }}
          >
            Set how long users must wait before their
            withdrawal becomes eligible for processing.
          </p>

          <form onSubmit={saveSettings}>
            <label
              htmlFor="withdrawalMinutes"
              style={{
                display: "block",
                fontWeight: 600,
                marginBottom: "8px",
              }}
            >
              Withdrawal window (minutes)
            </label>

            <input
              id="withdrawalMinutes"
              type="number"
              min="1"
              value={withdrawalMinutes}
              onChange={(event) =>
                setWithdrawalMinutes(
                  event.target.value
                )
              }
              style={{
                width: "100%",
                maxWidth: "320px",
                padding: "13px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                fontSize: "16px",
              }}
            />

            <p
              style={{
                fontSize: "14px",
                opacity: 0.65,
                marginTop: "8px",
              }}
            >
              Current setting:
              {" "}
              {withdrawalMinutes} minutes
            </p>

            <button
              type="submit"
              style={{
                marginTop: "12px",
                padding: "13px 20px",
                border: 0,
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Save Withdrawal Timer
            </button>

            {saved && (
              <p
                style={{
                  marginTop: "12px",
                  fontWeight: 600,
                }}
              >
                Setting saved for this session.
              </p>
            )}
          </form>
        </section>

        <section
          style={{
            background: "#fff",
            borderRadius: "18px",
            padding: "24px",
            border: "1px solid #e5e5e5",
          }}
        >
          <h2
            style={{
              marginTop: 0,
            }}
          >
            Coming Controls
          </h2>

          <ul
            style={{
              lineHeight: 1.9,
              paddingLeft: "20px",
            }}
          >
            <li>Create article tasks</li>
            <li>Create custom tasks</li>
            <li>Set task rewards</li>
            <li>Approve or reject proof</li>
            <li>Automatic wallet rewards</li>
            <li>Six-task daily limit</li>
            <li>₦1,000 daily check-in</li>
            <li>₦1,700 account upgrade</li>
            <li>Paystack payments</li>
            <li>Withdrawal management</li>
            <li>User management</li>
          </ul>
        </section>
      </div>
    </main>
  );
}