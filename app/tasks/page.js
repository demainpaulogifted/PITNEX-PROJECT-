"use client";

import { useEffect, useState } from "react";

const DAILY_LIMIT = 6;
const DEFAULT_REWARD = 180;

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [completedToday, setCompletedToday] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/tasks",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

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

      setCompletedToday(
        Number(data.completedToday || 0)
      );
    } catch (err) {
      setError(
        err.message ||
          "Unable to load tasks."
      );
    } finally {
      setLoading(false);
    }
  }

  function openArticle(url) {
    if (!url) return;

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  }

  const remaining =
    Math.max(
      0,
      DAILY_LIMIT - completedToday
    );

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "24px 16px 48px",
        background: "#f7f7f7",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <header
          style={{
            marginBottom: "24px",
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
            PITNEX EARN
          </p>

          <h1
            style={{
              margin:
                "8px 0 10px",
              fontSize:
                "clamp(28px, 7vw, 40px)",
            }}
          >
            Available Tasks
          </h1>

          <p
            style={{
              margin: 0,
              opacity: 0.7,
              lineHeight: 1.5,
            }}
          >
            Complete tasks, submit proof and earn
            rewards after approval.
          </p>
        </header>

        <section
          style={{
            background: "#fff",
            border:
              "1px solid #e5e5e5",
            borderRadius: "18px",
            padding: "20px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <strong>
                Today's progress
              </strong>

              <p
                style={{
                  margin:
                    "6px 0 0",
                  opacity: 0.7,
                }}
              >
                {completedToday} of{" "}
                {DAILY_LIMIT} tasks completed
              </p>
            </div>

            <div
              style={{
                fontSize: "20px",
                fontWeight: 800,
              }}
            >
              {remaining} left
            </div>
          </div>

          <div
            style={{
              height: "8px",
              background:
                "#eaeaea",
              borderRadius: "999px",
              overflow: "hidden",
              marginTop: "16px",
            }}
          >
            <div
              style={{
                width: `${Math.min(
                  100,
                  (completedToday /
                    DAILY_LIMIT) *
                    100
                )}%`,
                height: "100%",
                background:
                  "#111",
                borderRadius:
                  "999px",
              }}
            />
          </div>
        </section>

        {loading && (
          <section
            style={{
              background: "#fff",
              padding: "24px",
              borderRadius: "18px",
              border:
                "1px solid #e5e5e5",
            }}
          >
            Loading available tasks...
          </section>
        )}

        {!loading && error && (
          <section
            style={{
              background: "#fff",
              padding: "24px",
              borderRadius: "18px",
              border:
                "1px solid #e5e5e5",
            }}
          >
            <strong>
              Unable to load tasks
            </strong>

            <p>{error}</p>

            <button
              onClick={loadTasks}
              style={{
                padding:
                  "12px 18px",
                border: 0,
                borderRadius:
                  "10px",
                cursor:
                  "pointer",
                fontWeight: 700,
              }}
            >
              Try again
            </button>
          </section>
        )}

        {!loading &&
          !error &&
          tasks.length === 0 && (
            <section
              style={{
                background: "#fff",
                padding: "28px",
                borderRadius: "18px",
                border:
                  "1px solid #e5e5e5",
                textAlign: "center",
              }}
            >
              <h2>
                No tasks available
              </h2>

              <p
                style={{
                  opacity: 0.7,
                }}
              >
                Check back later for new
                earning opportunities.
              </p>
            </section>
          )}

        {!loading &&
          !error &&
          tasks.length > 0 && (
            <div
              style={{
                display: "grid",
                gap: "16px",
              }}
            >
              {tasks.map((task) => {
                const reward =
                  Number(
                    task.reward_kobo
                  ) / 100 ||
                  DEFAULT_REWARD;

                return (
                  <article
                    key={task.id}
                    style={{
                      background: "#fff",
                      border:
                        "1px solid #e5e5e5",
                      borderRadius:
                        "18px",
                      padding: "20px",
                    }}
                  >
                    <div
                      style={{
                        display:
                          "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "flex-start",
                        gap: "16px",
                      }}
                    >
                      <div>
                        <span
                          style={{
                            display:
                              "inline-block",
                            fontSize:
                              "12px",
                            fontWeight:
                              800,
                            padding:
                              "5px 9px",
                            borderRadius:
                              "999px",
                            background:
                              "#f0f0f0",
                            marginBottom:
                              "10px",
                          }}
                        >
                          ARTICLE TASK
                        </span>

                        <h2
                          style={{
                            margin:
                              "0 0 10px",
                            fontSize:
                              "21px",
                          }}
                        >
                          {task.title}
                        </h2>

                        <p
                          style={{
                            margin: 0,
                            lineHeight:
                              1.6,
                            opacity:
                              0.75,
                          }}
                        >
                          Read the article
                          on THE INDEX,
                          like it, take a
                          screenshot and
                          submit your proof.
                        </p>
                      </div>

                      <div
                        style={{
                          flexShrink: 0,
                          textAlign:
                            "right",
                        }}
                      >
                        <div
                          style={{
                            fontSize:
                              "22px",
                            fontWeight:
                              900,
                          }}
                        >
                          ₦
                          {reward.toLocaleString()}
                        </div>

                        <small
                          style={{
                            opacity:
                              0.6,
                          }}
                        >
                          reward
                        </small>
                      </div>
                    </div>

                    {task.article_url && (
                      <button
                        type="button"
                        onClick={() =>
                          openArticle(
                            task.article_url
                          )
                        }
                        disabled={
                          remaining ===
                          0
                        }
                        style={{
                          width:
                            "100%",
                          marginTop:
                            "20px",
                          padding:
                            "14px",
                          border: 0,
                          borderRadius:
                            "12px",
                          cursor:
                            remaining ===
                            0
                              ? "not-allowed"
                              : "pointer",
                          fontWeight:
                            800,
                          fontSize:
                            "15px",
                          opacity:
                            remaining ===
                            0
                              ? 0.5
                              : 1,
                        }}
                      >
                        Read Article & Earn ₦
                        {reward.toLocaleString()}
                      </button>
                    )}
                  </article>
                );
              })}
            </div>
          )}

        <section
          style={{
            marginTop: "24px",
            padding: "18px",
            borderRadius: "16px",
            background: "#fff",
            border:
              "1px solid #e5e5e5",
          }}
        >
          <strong>
            How earning works
          </strong>

          <ol
            style={{
              lineHeight: 1.8,
              paddingLeft: "22px",
              marginBottom: 0,
            }}
          >
            <li>
              Choose an available task.
            </li>
            <li>
              Check the reward before starting.
            </li>
            <li>
              Open THE INDEX in another tab.
            </li>
            <li>
              Complete the required action.
            </li>
            <li>
              Select your screenshot from your device.
            </li>
            <li>
              Submit your proof.
            </li>
            <li>
              Wait for admin approval.
            </li>
            <li>
              Approved rewards are credited to your wallet.
            </li>
          </ol>
        </section>
      </div>
    </main>
  );
}