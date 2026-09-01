"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const DEFAULT_REWARD = 180;

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();

  const taskId = params?.taskId;

  const [task, setTask] = useState(null);
  const [proofFile, setProofFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!taskId) return;

    loadTask();
  }, [taskId]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  async function loadTask() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/tasks/${taskId}`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to load this task."
        );
      }

      if (!data.task) {
        throw new Error(
          "Task not found."
        );
      }

      setTask(data.task);
    } catch (err) {
      setError(
        err.message ||
          "Unable to load task."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(event) {
    const file =
      event.target.files?.[0];

    if (!file) return;

    setError("");
    setStatus("");

    if (!file.type.startsWith("image/")) {
      setError(
        "Please select an image screenshot."
      );
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError(
        "Screenshot must be 10MB or smaller."
      );
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setProofFile(file);
    setPreviewUrl(
      URL.createObjectURL(file)
    );
  }

  async function submitProof() {
    if (!taskId) return;

    if (!proofFile) {
      setError(
        "Please select your screenshot first."
      );
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setStatus("");

      const formData = new FormData();

      formData.append(
        "taskId",
        taskId
      );

      formData.append(
        "proof",
        proofFile
      );

      const response = await fetch(
        "/api/tasks/submit",
        {
          method: "POST",
          body: formData,
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to submit proof."
        );
      }

      setStatus(
        "Proof submitted successfully. Your task is now pending admin approval."
      );

      setProofFile(null);

      if (previewUrl) {
        URL.revokeObjectURL(
          previewUrl
        );
      }

      setPreviewUrl("");
    } catch (err) {
      setError(
        err.message ||
          "Unable to submit task proof."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="tasks-page">
        <div className="container">
          <div className="task-card">
            Loading task...
          </div>
        </div>
      </main>
    );
  }

  if (error && !task) {
    return (
      <main className="tasks-page">
        <div className="container">
          <div className="task-card">
            <h1>
              Task unavailable
            </h1>

            <p>{error}</p>

            <button
              type="button"
              onClick={() =>
                router.push("/tasks")
              }
            >
              Back to Tasks
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!task) {
    return null;
  }

  const reward =
    Number(task.reward_kobo) / 100 ||
    DEFAULT_REWARD;

  return (
    <main className="tasks-page">
      <div
        className="container"
        style={{
          maxWidth: "760px",
          margin: "0 auto",
          padding:
            "24px 16px 48px",
        }}
      >
        <button
          type="button"
          onClick={() =>
            router.push("/tasks")
          }
          style={{
            marginBottom: "20px",
            border: 0,
            background: "transparent",
            cursor: "pointer",
            fontWeight: 700,
            padding: 0,
          }}
        >
          ← Back to Tasks
        </button>

        <section
          className="task-card"
          style={{
            padding: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              gap: "20px",
              alignItems:
                "flex-start",
              flexWrap: "wrap",
            }}
          >
            <div>
              <span
                style={{
                  display:
                    "inline-block",
                  fontSize: "12px",
                  fontWeight: 800,
                  padding:
                    "6px 10px",
                  borderRadius:
                    "999px",
                  background:
                    "#f0f0f0",
                  marginBottom:
                    "12px",
                }}
              >
                ARTICLE TASK
              </span>

              <h1
                style={{
                  margin:
                    "0 0 12px",
                  fontSize:
                    "clamp(25px, 6vw, 34px)",
                  lineHeight: 1.2,
                }}
              >
                {task.title}
              </h1>
            </div>

            <div
              style={{
                minWidth: "110px",
                textAlign: "right",
              }}
            >
              <div
                style={{
                  fontSize: "26px",
                  fontWeight: 900,
                }}
              >
                ₦
                {reward.toLocaleString()}
              </div>

              <small
                style={{
                  opacity: 0.6,
                }}
              >
                task reward
              </small>
            </div>
          </div>

          <div
            style={{
              marginTop: "24px",
              padding: "18px",
              borderRadius: "14px",
              background: "#f7f7f7",
            }}
          >
            <h2
              style={{
                margin:
                  "0 0 12px",
                fontSize: "19px",
              }}
            >
              Before you start
            </h2>

            <ol
              style={{
                margin: 0,
                paddingLeft: "22px",
                lineHeight: 1.8,
              }}
            >
              <li>
                Your reward is ₦
                {reward.toLocaleString()}.
              </li>

              <li>
                Open the THE INDEX article
                using the button below.
              </li>

              <li>
                Read the article and complete
                the required action.
              </li>

              <li>
                Take a clear screenshot as
                proof.
              </li>

              <li>
                Select your screenshot and
                submit it for review.
              </li>
            </ol>
          </div>

          {task.article_url && (
            <button
              type="button"
              onClick={() =>
                window.open(
                  task.article_url,
                  "_blank",
                  "noopener,noreferrer"
                )
              }
              style={{
                width: "100%",
                marginTop: "22px",
                padding: "15px",
                border: 0,
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: 800,
                fontSize: "16px",
              }}
            >
              📖 Open THE INDEX Article
            </button>
          )}

          <div
            style={{
              marginTop: "30px",
              paddingTop: "28px",
              borderTop:
                "1px solid #e5e5e5",
            }}
          >
            <h2
              style={{
                margin:
                  "0 0 8px",
                fontSize: "21px",
              }}
            >
              Submit Screenshot Proof
            </h2>

            <p
              style={{
                margin:
                  "0 0 18px",
                opacity: 0.7,
                lineHeight: 1.5,
              }}
            >
              Select the screenshot directly
              from your phone or device.
            </p>

            <label
              htmlFor="proof"
              style={{
                display: "block",
                border:
                  "2px dashed #ccc",
                borderRadius: "14px",
                padding: "25px 16px",
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              <strong>
                📸 Select Screenshot
              </strong>

              <div
                style={{
                  marginTop: "7px",
                  fontSize: "13px",
                  opacity: 0.6,
                }}
              >
                PNG, JPG or WEBP · Max 10MB
              </div>

              <input
                id="proof"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                capture="environment"
                onChange={
                  handleFileChange
                }
                style={{
                  display: "none",
                }}
              />
            </label>

            {proofFile && (
              <div
                style={{
                  marginTop: "18px",
                }}
              >
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                  }}
                >
                  Selected:{" "}
                  {proofFile.name}
                </p>

                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Screenshot proof preview"
                    style={{
                      display: "block",
                      width: "100%",
                      maxHeight: "500px",
                      objectFit:
                        "contain",
                      borderRadius:
                        "12px",
                      border:
                        "1px solid #ddd",
                      background:
                        "#f5f5f5",
                    }}
                  />
                )}
              </div>
            )}

            {error && (
              <div
                style={{
                  marginTop: "18px",
                  padding: "13px",
                  borderRadius:
                    "10px",
                  background:
                    "#fff1f1",
                }}
              >
                {error}
              </div>
            )}

            {status && (
              <div
                style={{
                  marginTop: "18px",
                  padding: "15px",
                  borderRadius:
                    "12px",
                  background:
                    "#f1f8f1",
                  fontWeight: 700,
                  lineHeight: 1.5,
                }}
              >
                ⏳ {status}
              </div>
            )}

            <button
              type="button"
              onClick={submitProof}
              disabled={
                submitting ||
                !proofFile ||
                Boolean(status)
              }
              style={{
                width: "100%",
                marginTop: "20px",
                padding: "15px",
                border: 0,
                borderRadius: "12px",
                cursor:
                  submitting ||
                  !proofFile ||
                  status
                    ? "not-allowed"
                    : "pointer",
                fontWeight: 800,
                fontSize: "16px",
                opacity:
                  submitting ||
                  !proofFile ||
                  status
                    ? 0.5
                    : 1,
              }}
            >
              {submitting
                ? "Uploading proof..."
                : status
                ? "⏳ Proof Pending Review"
                : `Submit Proof & Earn ₦${reward.toLocaleString()}`}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}