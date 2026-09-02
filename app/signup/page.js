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
        setError("Please enter your full name.");
        return;
      }

      if (!email) {
        setError("Please enter your email address.");
        return;
      }

      if (password.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
      }

      if (password !== form.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      const { data, error: signupError } =
        await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
            emailRedirectTo:
              "https://pitnex.name.ng/auth/callback",
          },
        });

      if (signupError) {
        console.error("Signup error:", signupError);
        setError(signupError.message);
        return;
      }

      /*
       * Confirm Email OFF:
       * Supabase should return a session immediately.
       */
      if (data?.session) {
        router.replace("/dashboard");
        router.refresh();
        return;
      }

      /*
       * Give Supabase's browser client a moment to persist
       * the newly-created session.
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
       * Listen briefly for the auth state event.
       * This catches cases where the session arrives
       * immediately after signUp().
       */
      let redirected = false;

      const {
        data: listener,
      } = supabase.auth.onAuthStateChange(
        (event, session) => {
          if (
            session &&
            !redirected &&
            (event === "SIGNED_IN" ||
              event === "INITIAL_SESSION")
          ) {
            redirected = true;
            router.replace("/dashboard");
            router.refresh();
          }
        }
      );

      setTimeout(() => {
        listener?.subscription?.unsubscribe();

        if (!redirected) {
          setError(
            "Your account was created, but Supabase did not start a session. Please check that Confirm email is OFF in the PITNEX Supabase project."
          );
        }
      }, 1500);
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
          background: "#ffffff",
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
          <label style={labelStyle}>
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

          <label style={labelStyle}>
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

          <label style={labelStyle}>
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

          <label style={labelStyle}>
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
              color: "#ffffff",
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
  background: "#ffffff",
};