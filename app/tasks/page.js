"use client";

import { useRef, useState } from "react";
import Header from "@/components/Header";

const THE_INDEX_URL = "https://theindex.name.ng";

export default function TasksPage() {
  const fileInputRef = useRef(null);

  const [screenshot, setScreenshot] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");

  function handleScreenshot(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please select an image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Screenshot must be less than 5MB.");
      return;
    }

    setScreenshot(file);
    setMessage("");
  }

  async function handleSubmit() {
    if (!screenshot) {
      setMessage("Please select your screenshot first.");
      return;
    }

    setSubmitting(true);
    setMessage("");

    /*
      Task submission API will be connected to the existing
      PITNEX task tables next.

      For now we validate the complete user interaction
      without changing the database.
    */

    await new Promise((resolve) => setTimeout(resolve, 800));

    setSubmitting(false);
    setSubmitted(true);
    setMessage(
      "Proof submitted successfully. Your task is now pending review."
    );
  }

  return (
    <>
      <Header />

      <main className="simple-page">
        <div className="page-heading">
          <span>Earn more</span>

          <h1>Available Tasks</h1>

          <p>
            Complete tasks, submit proof and earn money
            directly into your Pitnex wallet.
          </p>
        </div>

        <section className="task-card">
          <div>
            <span
              style={{
                display: "inline-block",
                marginBottom: "8px",
                fontSize: "13px",
                fontWeight: 700,
                opacity: 0.7
              }}
            >
              ARTICLE TASK
            </span>

            <h2>Read &amp; Like a THE INDEX Article</h2>

            <p>
              Open the assigned article on THE INDEX,
              read it and like the article. Then return
              here and upload a screenshot as proof.
            </p>

            <strong
              style={{
                display: "block",
                marginTop: "12px",
                fontSize: "24px"
              }}
            >
              ₦180
            </strong>
          </div>

          {!submitted ? (
            <>
              <a
                href={THE_INDEX_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="invest-button"
                style={{
                  display: "inline-flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textDecoration: "none",
                  marginTop: "18px"
                }}
              >
                Open THE INDEX
              </a>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleScreenshot}
                style={{ display: "none" }}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: "100%",
                  marginTop: "12px"
                }}
              >
                {screenshot
                  ? `Selected: ${screenshot.name}`
                  : "Select Screenshot"}
              </button>

              {screenshot && (
                <p
                  style={{
                    marginTop: "8px",
                    fontSize: "13px",
                    opacity: 0.7
                  }}
                >
                  Screenshot selected and ready to submit.
                </p>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  width: "100%",
                  marginTop: "12px"
                }}
              >
                {submitting ? "Submitting..." : "Submit Proof"}
              </button>
            </>
          ) : (
            <div
              style={{
                marginTop: "18px",
                padding: "16px",
                borderRadius: "12px",
                background: "rgba(0,0,0,0.05)"
              }}
            >
              <strong>⏳ Pending Review</strong>

              <p style={{ marginTop: "6px" }}>
                Your screenshot has been submitted.
                Once approved, ₦180 will be added to
                your Pitnex wallet.
              </p>
            </div>
          )}

          {message && (
            <p
              style={{
                marginTop: "12px",
                fontSize: "14px"
              }}
            >
              {message}
            </p>
          )}
        </section>
      </main>
    </>
  );
}