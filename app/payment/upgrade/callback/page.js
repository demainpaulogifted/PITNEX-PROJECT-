"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";

export default function UpgradeCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState(
    "Verifying your payment..."
  );

  useEffect(() => {
    const reference =
      searchParams.get("reference");

    if (!reference) {
      setStatus("error");
      setMessage(
        "No payment reference was found."
      );
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

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "#f7f7f7",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "440px",
          background: "#fff",
          border: "1px solid #e5e5e5",
          borderRadius: "22px",
          padding: "32px 24px",
          textAlign: "center",
          boxShadow:
            "0 15px 45px rgba(0,0,0,0.08)",
        }}
      >
        {status === "verifying" && (
          <>
            <Loader2
              size={52}
              style={{
                animation:
                  "pitnex-callback-spin 1s linear infinite",
                marginBottom: "18px",
              }}
            />

            <h1
              style={{
                margin: 0,
                fontSize: "25px",
              }}
            >
              Verifying payment
            </h1>

            <p
              style={{
                marginTop: "12px",
                opacity: 0.65,
                lineHeight: 1.6,
              }}
            >
              Please wait while we securely
              confirm your ₦1,700 upgrade
              payment.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2
              size={58}
              style={{
                marginBottom: "18px",
              }}
            />

            <h1
              style={{
                margin: 0,
                fontSize: "25px",
              }}
            >
              Account upgraded 🎉
            </h1>

            <p
              style={{
                marginTop: "12px",
                opacity: 0.7,
                lineHeight: 1.6,
              }}
            >
              {message}
            </p>

            <p
              style={{
                marginTop: "18px",
                fontSize: "13px",
                opacity: 0.55,
              }}
            >
              Redirecting you to your dashboard...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle
              size={58}
              style={{
                marginBottom: "18px",
              }}
            />

            <h1
              style={{
                margin: 0,
                fontSize: "25px",
              }}
            >
              Payment verification failed
            </h1>

            <p
              style={{
                marginTop: "12px",
                opacity: 0.7,
                lineHeight: 1.6,
              }}
            >
              {message}
            </p>

            <button
              type="button"
              onClick={() =>
                router.replace("/dashboard")
              }
              style={{
                width: "100%",
                marginTop: "22px",
                padding: "14px",
                border: 0,
                borderRadius: "12px",
                background: "#111",
                color: "#fff",
                fontSize: "15px",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Return to Dashboard
            </button>
          </>
        )}
      </section>

      <style jsx global>{`
        @keyframes pitnex-callback-spin {
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