"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";

function UpgradeCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState(
    "Verifying your payment..."
  );

  useEffect(() => {
    const reference = searchParams.get("reference");

    if (!reference) {
      setStatus("error");
      setMessage("No payment reference was found.");
      return;
    }

    let cancelled = false;

    async function verifyPayment() {
      try {
        const response = await fetch(
          "/api/payments/verify",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              reference,
            }),
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (cancelled) return;

        if (!response.ok || !data.success) {
          throw new Error(
            data.error ||
              "Payment verification failed."
          );
        }

        setStatus("success");

        setMessage(
          data.alreadyProcessed
            ? "Your account is already upgraded."
            : "Payment verified successfully. Your PITNEX account has been upgraded."
        );

        setTimeout(() => {
          router.replace("/dashboard");
          router.refresh();
        }, 2500);
      } catch (error) {
        if (cancelled) return;

        setStatus("error");

        setMessage(
          error.message ||
            "We could not verify your payment."
        );
      }
    }

    verifyPayment();

    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  if (status === "verifying") {
    return (
      <section className="callback-card">
        <Loader2
          size={52}
          className="callback-spinner"
        />

        <h1>Verifying payment</h1>

        <p>
          Please wait while we securely confirm
          your ₦1,700 upgrade payment.
        </p>
      </section>
    );
  }

  if (status === "success") {
    return (
      <section className="callback-card">
        <CheckCircle2
          size={58}
          className="success-icon"
        />

        <h1>Account upgraded 🎉</h1>

        <p>{message}</p>

        <small>
          Redirecting you to your dashboard...
        </small>
      </section>
    );
  }

  return (
    <section className="callback-card">
      <XCircle
        size={58}
        className="error-icon"
      />

      <h1>Payment verification failed</h1>

      <p>{message}</p>

      <button
        type="button"
        onClick={() =>
          router.replace("/dashboard")
        }
      >
        Return to Dashboard
      </button>
    </section>
  );
}

export default function UpgradeCallbackPage() {
  return (
    <>
      <main className="callback-page">
        <Suspense
          fallback={
            <section className="callback-card">
              <Loader2
                size={52}
                className="callback-spinner"
              />

              <h1>
                Loading payment verification...
              </h1>

              <p>
                Please wait...
              </p>
            </section>
          }
        >
          <UpgradeCallbackContent />
        </Suspense>
      </main>

      <style jsx global>{`
        .callback-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: #f7f7f7;
          box-sizing: border-box;
        }

        .callback-card {
          width: 100%;
          max-width: 440px;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 22px;
          padding: 32px 24px;
          text-align: center;
          box-shadow:
            0 15px 45px rgba(0, 0, 0, 0.08);
          box-sizing: border-box;
        }

        .callback-card h1 {
          margin: 12px 0 0;
          font-size: 25px;
        }

        .callback-card p {
          margin-top: 12px;
          opacity: 0.7;
          line-height: 1.6;
        }

        .callback-card small {
          display: block;
          margin-top: 18px;
          font-size: 13px;
          opacity: 0.55;
        }

        .callback-spinner {
          animation:
            pitnex-callback-spin
            1s linear infinite;
        }

        .success-icon {
          margin-bottom: 4px;
        }

        .error-icon {
          margin-bottom: 4px;
        }

        .callback-card button {
          width: 100%;
          margin-top: 22px;
          padding: 14px;
          border: 0;
          border-radius: 12px;
          background: #111;
          color: #fff;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
        }

        @keyframes pitnex-callback-spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}