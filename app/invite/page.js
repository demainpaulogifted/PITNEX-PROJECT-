"use client";

import { useEffect, useState } from "react";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://pitnex.name.ng";

export default function InvitePage() {
  const [inviteLink, setInviteLink] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [referrals, setReferrals] = useState(0);
  const [rewarded, setRewarded] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadReferralData();
  }, []);

  async function loadReferralData() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/referrals", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            "Unable to load referral information."
        );
      }

      const code = data.referralCode || "";

      setReferralCode(code);
      setReferrals(data.referralCount || 0);
      setRewarded(data.rewardedCount || 0);
      setTotalEarned(data.totalEarnedNaira || 0);

      if (code) {
        setInviteLink(
          `${SITE_URL}/signup?ref=${encodeURIComponent(code)}`
        );
      }
    } catch (err) {
      console.error("Referral page error:", err);

      setError(
        err?.message ||
          "Unable to load referral information."
      );
    } finally {
      setLoading(false);
    }
  }

  async function copyInviteLink() {
    if (!inviteLink) return;

    try {
      await navigator.clipboard.writeText(inviteLink);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setError("Unable to copy the invite link.");
    }
  }

  async function shareInvite() {
    if (!inviteLink) return;

    const shareData = {
      title: "Join PITNEX",
      text:
        "Join PITNEX and start earning from available tasks.",
      url: inviteLink,
    };

    if (
      typeof navigator !== "undefined" &&
      navigator.share
    ) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled sharing.
      }
    } else {
      await copyInviteLink();
    }
  }

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
        <div style={{ marginBottom: "24px" }}>
          <a
            href="/dashboard"
            style={{
              color: "#667085",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            ← Back to dashboard
          </a>

          <h1
            style={{
              margin: "16px 0 6px",
              fontSize: "30px",
              fontWeight: 800,
              color: "#101828",
            }}
          >
            Invite & Earn
          </h1>

          <p
            style={{
              margin: 0,
              color: "#667085",
              lineHeight: 1.6,
            }}
          >
            Invite people to PITNEX and earn ₦500
            for each qualifying referral.
          </p>
        </div>

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
            }}
          >
            {error}
          </div>
        )}

        <section
          style={{
            background: "#111827",
            color: "#fff",
            borderRadius: "20px",
            padding: "28px 24px",
            marginBottom: "18px",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              color: "#9ca3af",
            }}
          >
            Referral reward
          </div>

          <div
            style={{
              marginTop: "6px",
              fontSize: "40px",
              fontWeight: 900,
            }}
          >
            ₦500
          </div>

          <p
            style={{
              margin: "8px 0 0",
              color: "#d1d5db",
              lineHeight: 1.5,
              fontSize: "14px",
            }}
          >
            Earn ₦500 when your invited user
            completes the required qualification.
          </p>
        </section>

        <section
          style={{
            background: "#fff",
            border: "1px solid #e4e7ec",
            borderRadius: "20px",
            padding: "24px",
            marginBottom: "18px",
          }}
        >
          <h2
            style={{
              margin: "0 0 8px",
              fontSize: "20px",
              fontWeight: 800,
              color: "#101828",
            }}
          >
            Your invite link
          </h2>

          <p
            style={{
              margin: "0 0 16px",
              color: "#667085",
              fontSize: "14px",
            }}
          >
            Share this link with friends.
          </p>

          <input
            value={loading ? "Loading..." : inviteLink}
            readOnly
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "13px 14px",
              border: "1px solid #d0d5dd",
              borderRadius: "10px",
              background: "#f9fafb",
              color: "#344054",
              fontSize: "14px",
            }}
          />

          {referralCode && (
            <div
              style={{
                marginTop: "10px",
                fontSize: "13px",
                color: "#667085",
              }}
            >
              Referral code:{" "}
              <strong>{referralCode}</strong>
            </div>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              marginTop: "12px",
            }}
          >
            <button
              type="button"
              onClick={copyInviteLink}
              disabled={!inviteLink}
              style={buttonDark}
            >
              {copied ? "Copied!" : "Copy Link"}
            </button>

            <button
              type="button"
              onClick={shareInvite}
              disabled={!inviteLink}
              style={buttonLight}
            >
              Share
            </button>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "14px",
            marginBottom: "18px",
          }}
        >
          <Stat
            title="People invited"
            value={loading ? "..." : referrals}
          />

          <Stat
            title="Qualified"
            value={loading ? "..." : rewarded}
          />

          <Stat
            title="Referral earnings"
            value={
              loading
                ? "..."
                : `₦${Number(totalEarned).toLocaleString()}`
            }
          />
        </section>

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
              margin: "0 0 18px",
              fontSize: "20px",
              fontWeight: 800,
              color: "#101828",
            }}
          >
            How it works
          </h2>

          <Step
            number="1"
            title="Share your link"
            text="Send your personal PITNEX invite link."
          />

          <Step
            number="2"
            title="They join"
            text="Your friend creates a PITNEX account through your link."
          />

          <Step
            number="3"
            title="They qualify"
            text="They complete PITNEX's required qualification."
          />

          <Step
            number="4"
            title="You earn ₦500"
            text="The ₦500 referral reward becomes eligible for your wallet."
          />
        </section>
      </div>
    </main>
  );
}

function Stat({ title, value }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e4e7ec",
        borderRadius: "18px",
        padding: "20px",
      }}
    >
      <div
        style={{
          color: "#667085",
          fontSize: "13px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          marginTop: "6px",
          fontSize: "24px",
          fontWeight: 900,
          color: "#101828",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function Step({ number, title, text }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "14px",
        marginBottom: "16px",
      }}
    >
      <div
        style={{
          width: "32px",
          height: "32px",
          minWidth: "32px",
          borderRadius: "50%",
          background: "#111827",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 800,
        }}
      >
        {number}
      </div>

      <div>
        <div
          style={{
            fontWeight: 800,
            color: "#101828",
          }}
        >
          {title}
        </div>

        <p
          style={{
            margin: "4px 0 0",
            color: "#667085",
            fontSize: "14px",
            lineHeight: 1.5,
          }}
        >
          {text}
        </p>
      </div>
    </div>
  );
}

const buttonDark = {
  padding: "13px",
  border: "none",
  borderRadius: "10px",
  background: "#111827",
  color: "#fff",
  fontWeight: 800,
  cursor: "pointer",
};

const buttonLight = {
  padding: "13px",
  border: "1px solid #d0d5dd",
  borderRadius: "10px",
  background: "#fff",
  color: "#111827",
  fontWeight: 800,
  cursor: "pointer",
};