"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LogIn,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event) {
    event.preventDefault();

    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError(
        "Please enter your email and password."
      );
      return;
    }

    setLoading(true);

    try {
      const {
        error: loginError,
      } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (loginError) {
        throw loginError;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      console.error("PITNEX login error:", err);

      setError(
        err?.message ||
          "Unable to log in. Please check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-icon">
          <LogIn size={30} />
        </div>

        <h1>Welcome back</h1>

        <p className="login-subtitle">
          Log in to your PITNEX account to continue
          earning.
        </p>

        <form
          onSubmit={handleLogin}
          className="login-form"
        >
          <div className="field">
            <label htmlFor="email">
              Email address
            </label>

            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              autoComplete="email"
              disabled={loading}
            />
          </div>

          <div className="field">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              autoComplete="current-password"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="message error">
              <AlertCircle size={19} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="login-button"
          >
            {loading ? (
              <>
                <Loader2
                  size={19}
                  className="spinner"
                />
                Logging in...
              </>
            ) : (
              <>
                <LogIn size={19} />
                Log in
              </>
            )}
          </button>
        </form>

        <p className="signup-text">
          Don't have an account?{" "}
          <Link href="/signup">
            Create an account
          </Link>
        </p>
      </section>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: #f7f7f7;
          box-sizing: border-box;
        }

        .login-card {
          width: 100%;
          max-width: 440px;
          background: #ffffff;
          border: 1px solid #e5e5e5;
          border-radius: 22px;
          padding: 32px 24px;
          box-shadow:
            0 15px 45px rgba(0, 0, 0, 0.08);
          box-sizing: border-box;
        }

        .login-icon {
          width: 58px;
          height: 58px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #111111;
          color: #ffffff;
          margin-bottom: 18px;
        }

        h1 {
          margin: 0;
          font-size: 28px;
          line-height: 1.2;
        }

        .login-subtitle {
          margin: 12px 0 26px;
          color: #666666;
          line-height: 1.6;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 17px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .field label {
          font-size: 14px;
          font-weight: 700;
          color: #222222;
        }

        .field input {
          width: 100%;
          padding: 14px 13px;
          border: 1px solid #dcdcdc;
          border-radius: 11px;
          background: #ffffff;
          color: #111111;
          font-size: 15px;
          outline: none;
          box-sizing: border-box;
        }

        .field input:focus {
          border-color: #111111;
        }

        .field input:disabled {
          opacity: 0.65;
        }

        .message {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          padding: 12px;
          border-radius: 11px;
          font-size: 14px;
          line-height: 1.5;
        }

        .error {
          background: #fff1f1;
          color: #b42318;
        }

        .login-button {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: 0;
          border-radius: 12px;
          padding: 15px;
          background: #111111;
          color: #ffffff;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          margin-top: 3px;
        }

        .login-button:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .signup-text {
          text-align: center;
          margin: 24px 0 0;
          color: #666666;
          font-size: 14px;
        }

        .signup-text a {
          color: #111111;
          font-weight: 800;
          text-decoration: none;
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