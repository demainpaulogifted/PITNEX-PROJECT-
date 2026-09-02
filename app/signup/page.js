"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSignup(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const fullName = form.fullName.trim();
      const email = form.email.trim().toLowerCase();
      const password = form.password;

      if (!fullName) {
        throw new Error("Please enter your full name.");
      }

      if (!email) {
        throw new Error("Please enter your email address.");
      }

      if (password.length < 8) {
        throw new Error(
          "Password must be at least 8 characters."
        );
      }

      if (password !== form.confirmPassword) {
        throw new Error("Passwords do not match.");
      }

      const {
        data,
        error: signupError,
      } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (signupError) {
        console.error(
          "Supabase signup error:",
          signupError
        );

        throw new Error(signupError.message);
      }

      /*
       * Supabase may return a user without a session.
       * Do NOT automatically assume this means email
       * verification is enabled.
       */

      if (data?.session) {
        router.replace("/dashboard");
        router.refresh();
        return;
      }

      if (data?.user) {
        /*
         * The account was created successfully.
         *
         * If Supabase requires confirmation, the auth
         * response will normally expose that through the
         * user's confirmation state.
         */

        const identities =
          data.user.identities || [];

        if (identities.length === 0) {
          throw new Error(
            "This email may already be registered. Please try logging in."
          );
        }

        /*
         * Try refreshing the session once before showing
         * an error. This handles cases where the browser
         * client has not immediately received the session.
         */

        const {
          data: sessionData,
        } = await supabase.auth.getSession();

        if (sessionData?.session) {
          router.replace("/dashboard");
          router.refresh();
          return;
        }

        /*
         * The account exists, but Supabase did not return
         * an authenticated session.
         */
        setError(
          "Your account was created, but PITNEX could not sign you in automatically. Please try logging in."
        );

        return;
      }

      throw new Error(
        "PITNEX could not create your account."
      );
    } catch (err) {
      console.error("Signup error:", err);

      setError(
        err?.message ||
          "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "#f8fafc",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          background: "#fff",
          borderRadius: "20px",
          padding: "32px",
          boxShadow:
            "0 10px 35px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ marginBottom: "28px" }}>
          <h1
            style={{
              margin: 0,
              fontSize: "30px",
              fontWeight: 800,
              color: "#111827",
            }}
          >
            Create your PITNEX account
          </h1>

          <p
            style={{
              marginTop: "8px",
              color: "#6b7280",
              lineHeight: 1.6,
            }}
          >
            Create your account and start earning
            on PITNEX.
          </p>
        </div>

        {error && (
          <div
            style={{
              marginBottom: "20px",
              padding: "12px 14px",
              borderRadius: "10px",
              background: "#fef2f2",
              color: "#b91c1c",
              fontSize: "14px",
              lineHeight: 1.5,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSignup}>
          <label
            style={{
              display: "block",
              marginBottom: "7px",
              fontWeight: 600,
              color: "#374151",
            }}
          >
            Full name
          </label>

          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Your full name"
            autoComplete="name"
            required
            style={inputStyle}
          />

          <label
            style={labelStyle}
          >
            Email address
          </label>

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            autoComplete="email"
            required
            style={inputStyle}
          />

          <label
            style={labelStyle}
          >
            Password
          </label>

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            required
            style={inputStyle}
          />

          <label
            style={labelStyle}
          >
            Confirm password
          </label>

          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Enter your password again"
            autoComplete="new-password"
            required
            style={inputStyle}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              marginTop: "24px",
              padding: "14px",
              border: "none",
              borderRadius: "10px",
              background: loading
                ? "#9ca3af"
                : "#111827",
              color: "#fff",
              fontSize: "16px",
              fontWeight: 700,
              cursor: loading
                ? "not-allowed"
                : "pointer",
            }}
          >
            {loading
              ? "Creating account..."
              : "Create account"}
          </button>
        </form>

        <p
          style={{
            marginTop: "22px",
            textAlign: "center",
            color: "#6b7280",
            fontSize: "14px",
          }}
        >
          Already have an account?{" "}
          <Link
            href="/login"
            style={{
              color: "#111827",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: "7px",
  marginTop: "18px",
  fontWeight: 600,
  color: "#374151",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "13px 14px",
  border: "1px solid #d1d5db",
  borderRadius: "10px",
  outline: "none",
  fontSize: "15px",
  color: "#111827",
  background: "#fff",
};