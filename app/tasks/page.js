"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";

const THE_INDEX_URL = "https://theindex.name.ng";
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [screenshot, setScreenshot] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/tasks", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Unable to load tasks."
        );
      }

      setTasks(data.tasks || []);
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Unable to load tasks."
      );
    } finally {
      setLoading(false);
    }
  }

  function openTask(task) {
    setSelectedTask(task);
    setScreenshot(null);
    setMessage("");
    setError("");
  }

  function closeTask() {
    setSelectedTask(null);
    setScreenshot(null);
    setMessage("");
    setError("");
  }

  function handleScreenshotChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Screenshot must be 5MB or smaller.");
      return;
    }

    setScreenshot(file);
    setError("");
    setMessage("");
  }

  async function submitProof() {
    if (!selectedTask) return;

    if (!screenshot) {
      setError("Please select your screenshot first.");
      return;
    }

    /*
      Temporary submission state.

      The real proof-submission API will be connected
      in the next step after the task UI is confirmed.
    */
    setMessage(
      "Proof selected successfully. Your submission system is being connected."
    );
    setError("");
  }

  function formatReward(reward) {
    return `₦${Number(reward || 0).toLocaleString(
      "en-NG",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  }

  function getStatusLabel(status) {
    switch (status) {
      case "PENDING":
        return "Pending Review";

      case "COMPLETED":
        return "Completed";

      default:
        return "Available";
    }
  }

  if (loading) {
    return (
      <>
        <Header />

        <main className="simple-page">
          <div className="page-heading">
            <span>Earn more</span>
            <h1>Available Tasks</h1>
            <p>Loading available tasks...</p>
          </div>
        </main>
      </>
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
            Complete tasks and earn money directly
            into your Pitnex wallet.
          </p>
        </div>

        {error && (
          <div className="task-message task-error">
            {error}
          </div>
        )}

        {!error && tasks.length === 0 && (
          <div className="task-card">
            <div>
              <h2>No tasks available</h2>

              <p>
                New earning tasks will appear here
                when they become available.
              </p>
            </div>
          </div>
        )}

        <div className="tasks-list">
          {tasks.map((task) => {
            const isPending =
              task.status === "PENDING";

            const isCompleted =
              task.status === "COMPLETED";

            return (
              <div
                className="task-card"
                key={task.id}
              >
                <div className="task-card-content">

                  <div>
                    <span className="task-status">
                      {getStatusLabel(task.status)}
                    </span>

                    <h2>{task.title}</h2>

                    <p>
                      Read the article on THE INDEX,
                      like it, then submit a screenshot
                      as proof.
                    </p>
                  </div>

                  <strong className="task-reward">
                    {formatReward(
                      task.rewardNaira
                    )}
                  </strong>

                </div>

                <div className="task-actions">

                  <button
                    type="button"
                    onClick={() => {
                      if (!isPending && !isCompleted) {
                        openTask(task);
                      }
                    }}
                    disabled={
                      isPending || isCompleted
                    }
                    className="task-start-button"
                  >
                    {isCompleted
                      ? "Completed"
                      : isPending
                      ? "Pending Review"
                      : "Start Task"}
                  </button>

                </div>
              </div>
            );
          })}
        </div>

        {selectedTask && (
          <div className="task-modal-overlay">

            <div className="task-modal">

              <button
                type="button"
                className="task-modal-close"
                onClick={closeTask}
                aria-label="Close"
              >
                ×
              </button>

              <span className="task-status">
                EARN {formatReward(
                  selectedTask.rewardNaira
                )}
              </span>

              <h2>
                {selectedTask.title}
              </h2>

              <p>
                Follow these steps carefully before
                submitting your proof.
              </p>

              <div className="task-steps">

                <div className="task-step">
                  <strong>1</strong>

                  <div>
                    <h3>Open THE INDEX</h3>

                    <p>
                      Open the article in a new tab.
                    </p>

                    <a
                      href={
                        selectedTask.articleUrl ||
                        THE_INDEX_URL
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="task-link-button"
                    >
                      Open Article
                    </a>
                  </div>
                </div>

                <div className="task-step">
                  <strong>2</strong>

                  <div>
                    <h3>Read & Like</h3>

                    <p>
                      Read the article and complete
                      the required interaction.
                    </p>
                  </div>
                </div>

                <div className="task-step">
                  <strong>3</strong>

                  <div>
                    <h3>Take a Screenshot</h3>

                    <p>
                      Take a screenshot showing your
                      completed interaction.
                    </p>

                    <label className="screenshot-button">
                      Select Screenshot

                      <input
                        type="file"
                        accept="image/*"
                        onChange={
                          handleScreenshotChange
                        }
                        hidden
                      />
                    </label>

                    {screenshot && (
                      <p className="selected-file">
                        ✓ {screenshot.name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="task-step">
                  <strong>4</strong>

                  <div>
                    <h3>Submit Proof</h3>

                    <p>
                      Submit your screenshot for
                      admin review.
                    </p>

                    <button
                      type="button"
                      className="task-submit-button"
                      onClick={submitProof}
                      disabled={!screenshot}
                    >
                      Submit Proof
                    </button>
                  </div>
                </div>

              </div>

              {message && (
                <div className="task-message task-success">
                  {message}
                </div>
              )}

              {error && (
                <div className="task-message task-error">
                  {error}
                </div>
              )}

            </div>

          </div>
        )}

      </main>
    </>
  );
}