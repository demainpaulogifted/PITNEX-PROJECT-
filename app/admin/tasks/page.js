"use client";

import { useEffect, useState } from "react";

const DEFAULT_REWARD = 180;

export default function AdminTasksPage() {
  const [form, setForm] = useState({
    type: "ARTICLE",
    title: "",
    instructions: "",
    articleUrl: "",
    rewardNaira: DEFAULT_REWARD,
    maxCompletions: "",
    startsAt: "",
    endsAt: "",
    active: true,
  });

  const [submissions, setSubmissions] =
    useState([]);

  const [message, setMessage] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [loadingSubmissions, setLoadingSubmissions] =
    useState(true);

  const [processingId, setProcessingId] =
    useState(null);

  function updateField(event) {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  }

  async function submitTask(event) {
    event.preventDefault();

    setMessage("");
    setSaving(true);

    try {
      const response = await fetch(
        "/api/admin/tasks",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to create task."
        );
      }

      setMessage(
        "Task created successfully."
      );

      setForm({
        type: "ARTICLE",
        title: "",
        instructions: "",
        articleUrl: "",
        rewardNaira: DEFAULT_REWARD,
        maxCompletions: "",
        startsAt: "",
        endsAt: "",
        active: true,
      });
    } catch (error) {
      setMessage(
        error.message ||
          "Unable to create task."
      );
    } finally {
      setSaving(false);
    }
  }

  async function loadSubmissions() {
    try {
      setLoadingSubmissions(true);

      const response = await fetch(
        "/api/admin/task-submissions",
        {
          cache: "no-store",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to load submissions."
        );
      }

      setSubmissions(
        data.submissions || []
      );
    } catch (error) {
      setMessage(
        error.message ||
          "Unable to load submissions."
      );
    } finally {
      setLoadingSubmissions(false);
    }
  }

  useEffect(() => {
    loadSubmissions();
  }, []);

  async function reviewSubmission(
    submissionId,
    action
  ) {
    setProcessingId(
      submissionId
    );
    setMessage("");

    try {
      const response = await fetch(
        "/api/admin/task-submissions",
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            submissionId,
            action,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to process submission."
        );
      }

      setMessage(
        action === "APPROVE"
          ? "Submission approved and wallet credited."
          : "Submission rejected."
      );

      await loadSubmissions();
    } catch (error) {
      setMessage(
        error.message ||
          "Unable to process submission."
      );
    } finally {
      setProcessingId(null);
    }
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
              fontSize: "13px",
              fontWeight: 700,
              opacity: 0.6,
            }}
          >
            PITNEX ADMIN
          </p>

          <h1
            style={{
              margin: "8px 0",
              fontSize: "32px",
            }}
          >
            Task Control Center
          </h1>

          <p
            style={{
              opacity: 0.7,
            }}
          >
            Create earning tasks and review
            submitted task proofs.
          </p>
        </header>

        {message && (
          <div
            style={{
              marginBottom: "20px",
              padding: "14px 16px",
              background: "#fff",
              border:
                "1px solid #e5e5e5",
              borderRadius: "12px",
              fontWeight: 600,
            }}
          >
            {message}
          </div>
        )}

        <section
          style={{
            background: "#fff",
            border:
              "1px solid #e5e5e5",
            borderRadius: "18px",
            padding: "24px",
            marginBottom: "32px",
          }}
        >
          <h2
            style={{
              margin:
                "0 0 20px",
            }}
          >
            Create Task
          </h2>

          <form
            onSubmit={submitTask}
          >
            <label
              className="admin-field"
            >
              Task type

              <select
                name="type"
                value={form.type}
                onChange={
                  updateField
                }
              >
                <option value="ARTICLE">
                  Article — Read & Like
                </option>

                <option value="CUSTOM">
                  Custom Task
                </option>
              </select>
            </label>

            <label
              className="admin-field"
            >
              Task title

              <input
                name="title"
                value={form.title}
                onChange={
                  updateField
                }
                placeholder="Read and like this article"
                required
              />
            </label>

            <label
              className="admin-field"
            >
              Instructions

              <textarea
                name="instructions"
                value={
                  form.instructions
                }
                onChange={
                  updateField
                }
                placeholder="Tell the user exactly what to do..."
                rows={6}
                required
              />
            </label>

            {form.type ===
              "ARTICLE" && (
              <label
                className="admin-field"
              >
                THE INDEX article URL

                <input
                  name="articleUrl"
                  value={
                    form.articleUrl
                  }
                  onChange={
                    updateField
                  }
                  placeholder="https://theindex.name.ng/article/..."
                  type="url"
                  required
                />

                <small>
                  Article tasks should
                  point directly to
                  the THE INDEX article.
                </small>
              </label>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
              }}
            >
              <label
                className="admin-field"
              >
                Reward (₦)

                <input
                  name="rewardNaira"
                  type="number"
                  min="1"
                  value={
                    form.rewardNaira
                  }
                  onChange={
                    updateField
                  }
                  required
                />
              </label>

              <label
                className="admin-field"
              >
                Maximum completions

                <input
                  name="maxCompletions"
                  type="number"
                  min="1"
                  value={
                    form.maxCompletions
                  }
                  onChange={
                    updateField
                  }
                  placeholder="Unlimited"
                />
              </label>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
              }}
            >
              <label
                className="admin-field"
              >
                Start date/time

                <input
                  name="startsAt"
                  type="datetime-local"
                  value={
                    form.startsAt
                  }
                  onChange={
                    updateField
                  }
                />
              </label>

              <label
                className="admin-field"
              >
                End date/time

                <input
                  name="endsAt"
                  type="datetime-local"
                  value={
                    form.endsAt
                  }
                  onChange={
                    updateField
                  }
                />
              </label>
            </div>

            <label
              style={{
                display: "flex",
                gap: "10px",
                alignItems:
                  "center",
                marginTop: "20px",
              }}
            >
              <input
                name="active"
                type="checkbox"
                checked={
                  form.active
                }
                onChange={
                  updateField
                }
              />

              Task is active
            </label>

            <button
              type="submit"
              disabled={saving}
              style={{
                width: "100%",
                marginTop: "24px",
                padding: "15px",
                border: 0,
                borderRadius:
                  "12px",
                cursor: saving
                  ? "not-allowed"
                  : "pointer",
                fontWeight: 700,
                fontSize: "16px",
              }}
            >
              {saving
                ? "Creating..."
                : "Create Task"}
            </button>
          </form>
        </section>

        <section
          style={{
            background: "#fff",
            border:
              "1px solid #e5e5e5",
            borderRadius: "18px",
            padding: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems:
                "center",
              gap: "12px",
              flexWrap: "wrap",
              marginBottom:
                "20px",
            }}
          >
            <div>
              <h2
                style={{
                  margin:
                    "0 0 6px",
                }}
              >
                Pending Proofs
              </h2>

              <p
                style={{
                  margin: 0,
                  opacity: 0.65,
                }}
              >
                Review screenshots before
                paying users.
              </p>
            </div>

            <button
              type="button"
              onClick={
                loadSubmissions
              }
              disabled={
                loadingSubmissions
              }
              style={{
                padding:
                  "10px 14px",
                border:
                  "1px solid #ddd",
                borderRadius:
                  "10px",
                background:
                  "#fff",
                cursor:
                  "pointer",
                fontWeight: 700,
              }}
            >
              Refresh
            </button>
          </div>

          {loadingSubmissions ? (
            <p>
              Loading submissions...
            </p>
          ) : submissions.length ===
            0 ? (
            <div
              style={{
                padding: "30px",
                textAlign:
                  "center",
                border:
                  "1px dashed #ddd",
                borderRadius:
                  "12px",
                opacity: 0.7,
              }}
            >
              No pending submissions.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gap: "20px",
              }}
            >
              {submissions.map(
                (submission) => (
                  <article
                    key={
                      submission.id
                    }
                    style={{
                      border:
                        "1px solid #e5e5e5",
                      borderRadius:
                        "14px",
                      padding:
                        "18px",
                    }}
                  >
                    <div
                      style={{
                        display:
                          "flex",
                        justifyContent:
                          "space-between",
                        gap: "15px",
                        flexWrap:
                          "wrap",
                      }}
                    >
                      <div>
                        <h3
                          style={{
                            margin:
                              "0 0 8px",
                          }}
                        >
                          {
                            submission.task_title
                          }
                        </h3>

                        <p
                          style={{
                            margin:
                              "0 0 5px",
                            opacity:
                              0.7,
                          }}
                        >
                          User:{" "}
                          {submission.user_email ||
                            submission.user_id}
                        </p>

                        <p
                          style={{
                            margin: 0,
                            fontWeight: 800,
                          }}
                        >
                          Reward: ₦
                          {(
                            Number(
                              submission.reward_kobo
                            ) / 100
                          ).toLocaleString()}
                        </p>
                      </div>

                      <span
                        style={{
                          height:
                            "fit-content",
                          padding:
                            "6px 10px",
                          borderRadius:
                            "999px",
                          background:
                            "#fff4d6",
                          fontSize:
                            "12px",
                          fontWeight:
                            800,
                        }}
                      >
                        PENDING
                      </span>
                    </div>

                    {submission.proof_url && (
                      <div
                        style={{
                          marginTop:
                            "18px",
                        }}
                      >
                        <a
                          href={
                            submission.proof_url
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={
                              submission.proof_url
                            }
                            alt="Task proof"
                            style={{
                              display:
                                "block",
                              width:
                                "100%",
                              maxHeight:
                                "500px",
                              objectFit:
                                "contain",
                              borderRadius:
                                "10px",
                              background:
                                "#f5f5f5",
                              border:
                                "1px solid #ddd",
                            }}
                          />
                        </a>
                      </div>
                    )}

                    <div
                      style={{
                        display:
                          "grid",
                        gridTemplateColumns:
                          "1fr 1fr",
                        gap: "12px",
                        marginTop:
                          "18px",
                      }}
                    >
                      <button
                        type="button"
                        disabled={
                          processingId ===
                          submission.id
                        }
                        onClick={() =>
                          reviewSubmission(
                            submission.id,
                            "REJECT"
                          )
                        }
                        style={{
                          padding:
                            "13px",
                          border:
                            "1px solid #ddd",
                          borderRadius:
                            "10px",
                          background:
                            "#fff",
                          fontWeight:
                            800,
                          cursor:
                            "pointer",
                        }}
                      >
                        Reject
                      </button>

                      <button
                        type="button"
                        disabled={
                          processingId ===
                          submission.id
                        }
                        onClick={() =>
                          reviewSubmission(
                            submission.id,
                            "APPROVE"
                          )
                        }
                        style={{
                          padding:
                            "13px",
                          border: 0,
                          borderRadius:
                            "10px",
                          fontWeight:
                            800,
                          cursor:
                            "pointer",
                        }}
                      >
                        {processingId ===
                        submission.id
                          ? "Processing..."
                          : "Approve & Pay"}
                      </button>
                    </div>
                  </article>
                )
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}