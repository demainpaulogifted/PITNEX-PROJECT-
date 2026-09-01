"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  UserPlus,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSignup(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      setError("Please enter your full name.");
      return;
    }

    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (password.length < 8) {
      setError(
        "Your password must be at least 8 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const {
        data,
        error: signupError,
      } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: cleanName,
          },
        },
      });

      if (signupError) {
        throw signupError;
      }

      if (data.session) {
        setSuccess(
          "Account created successfully. Redirecting..."
        );

        setTimeout(() => {
          router.replace("/dashboard");
          router.refresh();
        }, 1000);

        return;
      }

      setSuccess(
        "Account created successfully. Please check your email to confirm your account."
      );
    } catch (err) {
      console.error("PITNEX signup error:", err);

      setError(
        err?.message ||
          "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="signup-page">
      <section className="signup-card">
        <div className="signup-icon">
          <UserPlus size={30} />
        </div>

        <h1>Create your PITNEX account</h1>

        <p className="signup-subtitle">
          Join PITNEX and start earning from available
          tasks and opportunities.
        </p>

        <form
          onSubmit={handleSignup}
          className="signup-form"
        >
          <div className="field">
            <label htmlFor="fullName">
              Full name
            </label>

            <input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(event) =>
                setFullName(event.target.value)
              }
              autoComplete="name"
              disabled={loading}
            />
          </div>

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
              placeholder="At least 8 characters"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              autoComplete="new-password"
              disabled={loading}
            />
          </div>

          <div className="field">
            <label htmlFor="confirmPassword">
              Confirm password
            </label>

            <input
              id="confirmPassword"
              type="password"
              placeholder="Enter your password again"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value
                )
              }
              autoComplete="new-password"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="message error">
              <AlertCircle size={19} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="message success">
              <CheckCircle2 size={19} />
              <span>{success}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="signup-button"
          >
            {loading ? (
              <>
                <Loader2
                  size={19}
                  className="spinner"
                />
                Creating account...
              </>
            ) : (
              <>
                <UserPlus size={19} />
                Create account
              </>
            )}
          </button>
        </form>

        <p className="login-text">
          Already have an account?{" "}
          <Link href="/login">
            Log in
          </Link>
        </p>
      </section>

      <style jsx>{`
        .signup-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: #f7f7f7;
          box-sizing: border-box;
        }

        .signup-card {
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

        .signup-icon {
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

        .signup-subtitle {
          margin: 12px 0 26px;
          color: #666666;
          line-height: 1.6;
        }

        .signup-form {
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

        .success {
          background: #effcf3;
          color: #18794e;
        }

        .signup-button {
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

        .signup-button:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .login-text {
          text-align: center;
          margin: 24px 0 0;
          color: #666666;
          font-size: 14px;
        }

        .login-text a {
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