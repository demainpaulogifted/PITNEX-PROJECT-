"use client";

import { useEffect, useState } from "react";

const MAX_DAILY_TASKS = 6;

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedTask, setSelectedTask] =
    useState(null);
  const [proofFile, setProofFile] =
    useState(null);
  const [proofPreview, setProofPreview] =
    useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        "/api/tasks",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to load tasks."
        );
      }

      setTasks(
        Array.isArray(data.tasks)
          ? data.tasks
          : []
      );
    } catch (error) {
      console.error(error);
      setMessage(
        error.message ||
          "Unable to load tasks."
      );
    } finally {
      setLoading(false);
    }
  }

  function startTask(task) {
    setSelectedTask(task);
    setProofFile(null);
    setProofPreview("");
    setMessage("");
  }

  function closeTask() {
    if (submitting) return;

    if (proofPreview) {
      URL.revokeObjectURL(
        proofPreview
      );
    }

    setSelectedTask(null);
    setProofFile(null);
    setProofPreview("");
    setMessage("");
  }

  function handleProofChange(event) {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage(
        "Please select an image screenshot."
      );
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setMessage(
        "Screenshot must be smaller than 10MB."
      );
      return;
    }

    if (proofPreview) {
      URL.revokeObjectURL(
        proofPreview
      );
    }

    setProofFile(file);

    setProofPreview(
      URL.createObjectURL(file)
    );

    setMessage("");
  }

  async function submitProof(event) {
    event.preventDefault();

    if (!selectedTask) return;

    if (!proofFile) {
      setMessage(
        "Please select your screenshot proof."
      );
      return;
    }

    try {
      setSubmitting(true);
      setMessage("");

      /*
       * IMPORTANT:
       * The existing submit API accepts
       * multipart/form-data directly.
       *
       * We do NOT use /api/tasks/upload.
       */
      const formData =
        new FormData();

      formData.append(
        "taskId",
        selectedTask.id
      );

      formData.append(
        "proof",
        proofFile
      );

      const response =
        await fetch(
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

      setMessage(
        data.message ||
          "Proof submitted successfully. Your task is now pending review."
      );

      if (proofPreview) {
        URL.revokeObjectURL(
          proofPreview
        );
      }

      setSelectedTask(null);
      setProofFile(null);
      setProofPreview("");

      await loadTasks();
    } catch (error) {
      console.error(error);

      setMessage(
        error.message ||
          "Unable to submit proof."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
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
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          <p>Loading available tasks...</p>
        </div>
      </main>
    );
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
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        <header
          style={{
            marginBottom: "28px",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing:
                "0.08em",
              opacity: 0.55,
            }}
          >
            PITNEX EARN
          </p>

          <h1
            style={{
              margin:
                "8px 0 10px",
              fontSize: "34px",
              lineHeight: 1.1,
            }}
          >
            Available Tasks
          </h1>

          <p
            style={{
              margin: 0,
              opacity: 0.7,
            }}
          >
            Complete tasks, submit
            proof and earn rewards.
          </p>
        </header>

        {message && (
          <div
            style={{
              marginBottom: "20px",
              padding: "15px 18px",
              border:
                "1px solid #e5e5e5",
              borderRadius: "14px",
              background: "#fff",
              fontWeight: 600,
            }}
          >
            {message}
          </div>
        )}

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "14px",
            marginBottom: "28px",
          }}
        >
          <Stat
            label="Daily limit"
            value={MAX_DAILY_TASKS}
          />

          <Stat
            label="Available"
            value={tasks.length}
          />
        </section>

        {tasks.length === 0 ? (
          <section
            style={{
              background: "#fff",
              border:
                "1px solid #e5e5e5",
              borderRadius: "18px",
              padding: "40px 24px",
              textAlign: "center",
            }}
          >
            <h2>
              No tasks available
            </h2>

            <p
              style={{
                opacity: 0.65,
              }}
            >
              Check back later for
              new earning tasks.
            </p>
          </section>
        ) : (
          <section
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "18px",
            }}
          >
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStart={() =>
                  startTask(task)
                }
              />
            ))}
          </section>
        )}
      </div>

      {selectedTask && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background:
              "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "18px",
          }}
        >
          <section
            style={{
              width: "100%",
              maxWidth: "560px",
              maxHeight: "92vh",
              overflowY: "auto",
              background: "#fff",
              borderRadius: "20px",
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
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: "11px",
                    fontWeight: 800,
                    opacity: 0.55,
                  }}
                >
                  TASK REWARD
                </p>

                <h2
                  style={{
                    margin:
                      "6px 0",
                    fontSize: "28px",
                  }}
                >
                  ₦
                  {formatNaira(
                    selectedTask.reward_kobo
                  )}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeTask}
                disabled={submitting}
                style={{
                  border: 0,
                  background:
                    "transparent",
                  fontSize: "28px",
                  cursor:
                    submitting
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                ×
              </button>
            </div>

            <h3
              style={{
                margin:
                  "18px 0 10px",
                fontSize: "22px",
              }}
            >
              {selectedTask.title}
            </h3>

            {selectedTask.instructions && (
              <div
                style={{
                  lineHeight: 1.6,
                  marginBottom:
                    "20px",
                  whiteSpace:
                    "pre-wrap",
                }}
              >
                {
                  selectedTask.instructions
                }
              </div>
            )}

            {selectedTask.article_url && (
              <a
                href={
                  selectedTask.article_url
                }
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  padding: "15px",
                  textAlign: "center",
                  border:
                    "1px solid #ddd",
                  borderRadius:
                    "12px",
                  textDecoration:
                    "none",
                  fontWeight: 800,
                  marginBottom:
                    "20px",
                }}
              >
                Open THE INDEX Article ↗
              </a>
            )}

            <div
              style={{
                padding: "16px",
                borderRadius:
                  "14px",
                background:
                  "#f7f7f7",
                marginBottom:
                  "18px",
              }}
            >
              <strong>
                Complete the task
                and submit proof
              </strong>

              <p
                style={{
                  margin:
                    "8px 0 0",
                  fontSize: "14px",
                  opacity: 0.65,
                  lineHeight: 1.5,
                }}
              >
                After completing the
                task, select a
                screenshot showing
                your proof.
              </p>
            </div>

            <form
              onSubmit={submitProof}
            >
              <label
                style={{
                  display: "block",
                  padding: "24px",
                  textAlign: "center",
                  border:
                    "2px dashed #d9d9d9",
                  borderRadius:
                    "14px",
                  cursor:
                    "pointer",
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={
                    handleProofChange
                  }
                  style={{
                    display: "none",
                  }}
                />

                <strong>
                  {proofFile
                    ? proofFile.name
                    : "📸 Select Screenshot"}
                </strong>

                <div
                  style={{
                    marginTop:
                      "6px",
                    fontSize:
                      "13px",
                    opacity: 0.6,
                  }}
                >
                  JPG, PNG or other
                  image format
                </div>
              </label>

              {proofPreview && (
                <img
                  src={proofPreview}
                  alt="Selected task proof"
                  style={{
                    display: "block",
                    width: "100%",
                    maxHeight:
                      "320px",
                    objectFit:
                      "contain",
                    marginTop:
                      "16px",
                    borderRadius:
                      "12px",
                    background:
                      "#f5f5f5",
                  }}
                />
              )}

              <button
                type="submit"
                disabled={
                  submitting ||
                  !proofFile
                }
                style={{
                  width: "100%",
                  marginTop:
                    "18px",
                  padding: "15px",
                  border: 0,
                  borderRadius:
                    "12px",
                  fontWeight: 800,
                  fontSize: "16px",
                  cursor:
                    submitting ||
                    !proofFile
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {submitting
                  ? "Submitting Proof..."
                  : "Submit Proof"}
              </button>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}

function TaskCard({
  task,
  onStart,
}) {
  return (
    <article
      style={{
        background: "#fff",
        border:
          "1px solid #e5e5e5",
        borderRadius: "18px",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          gap: "15px",
          alignItems:
            "flex-start",
        }}
      >
        <div>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 800,
              opacity: 0.55,
              textTransform:
                "uppercase",
            }}
          >
            {task.type ||
              "TASK"}
          </span>

          <h2
            style={{
              fontSize: "20px",
              lineHeight: 1.3,
              margin:
                "8px 0",
            }}
          >
            {task.title}
          </h2>
        </div>

        <strong
          style={{
            whiteSpace:
              "nowrap",
            fontSize: "18px",
          }}
        >
          ₦
          {formatNaira(
            task.reward_kobo
          )}
        </strong>
      </div>

      {task.instructions && (
        <p
          style={{
            lineHeight: 1.5,
            opacity: 0.7,
          }}
        >
          {task.instructions}
        </p>
      )}

      <button
        type="button"
        onClick={onStart}
        style={{
          width: "100%",
          marginTop: "10px",
          padding: "14px",
          border: 0,
          borderRadius: "12px",
          fontWeight: 800,
          cursor: "pointer",
        }}
      >
        Start Task — ₦
        {formatNaira(
          task.reward_kobo
        )}
      </button>
    </article>
  );
}

function Stat({
  label,
  value,
}) {
  return (
    <div
      style={{
        background: "#fff",
        border:
          "1px solid #e5e5e5",
        borderRadius: "15px",
        padding: "18px",
      }}
    >
      <div
        style={{
          fontSize: "12px",
          opacity: 0.6,
          marginBottom: "6px",
        }}
      >
        {label}
      </div>

      <strong
        style={{
          fontSize: "24px",
        }}
      >
        {value}
      </strong>
    </div>
  );
}

function formatNaira(
  amountKobo
) {
  const amount =
    Number(amountKobo || 0) /
    100;

  return amount.toLocaleString(
    "en-NG",
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }
  );
}