"use client";

import { useState } from "react";

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

  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  function updateField(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function submitTask(event) {
    event.preventDefault();

    setMessage("");
    setSaving(true);

    try {
      const response = await fetch("/api/admin/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to create task."
        );
      }

      setMessage("Task created successfully.");

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
      setMessage(error.message);
    } finally {
      setSaving(false);
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
          maxWidth: "850px",
          margin: "0 auto",
        }}
      >
        <header style={{ marginBottom: "28px" }}>
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
            Create Task
          </h1>

          <p style={{ opacity: 0.7 }}>
            Create article-reading tasks or other
            earning tasks for PITNEX users.
          </p>
        </header>

        <form
          onSubmit={submitTask}
          style={{
            background: "#fff",
            border: "1px solid #e5e5e5",
            borderRadius: "18px",
            padding: "24px",
          }}
        >
          <label className="admin-field">
            Task type

            <select
              name="type"
              value={form.type}
              onChange={updateField}
            >
              <option value="ARTICLE">
                Article — Read & Like
              </option>

              <option value="CUSTOM">
                Custom Task
              </option>
            </select>
          </label>

          <label className="admin-field">
            Task title

            <input
              name="title"
              value={form.title}
              onChange={updateField}
              placeholder="Read and like this article"
              required
            />
          </label>

          <label className="admin-field">
            Instructions

            <textarea
              name="instructions"
              value={form.instructions}
              onChange={updateField}
              placeholder="Tell the user exactly what to do..."
              rows={6}
              required
            />
          </label>

          {form.type === "ARTICLE" && (
            <label className="admin-field">
              THE INDEX article URL

              <input
                name="articleUrl"
                value={form.articleUrl}
                onChange={updateField}
                placeholder="https://theindex.name.ng/article/..."
                type="url"
                required
              />

              <small>
                Article tasks should point directly to
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
            <label className="admin-field">
              Reward (₦)

              <input
                name="rewardNaira"
                type="number"
                min="1"
                value={form.rewardNaira}
                onChange={updateField}
                required
              />
            </label>

            <label className="admin-field">
              Maximum completions

              <input
                name="maxCompletions"
                type="number"
                min="1"
                value={form.maxCompletions}
                onChange={updateField}
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
            <label className="admin-field">
              Start date/time

              <input
                name="startsAt"
                type="datetime-local"
                value={form.startsAt}
                onChange={updateField}
              />
            </label>

            <label className="admin-field">
              End date/time

              <input
                name="endsAt"
                type="datetime-local"
                value={form.endsAt}
                onChange={updateField}
              />
            </label>
          </div>

          <label
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <input
              name="active"
              type="checkbox"
              checked={form.active}
              onChange={updateField}
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
              borderRadius: "12px",
              cursor: saving
                ? "not-allowed"
                : "pointer",
              fontWeight: 700,
              fontSize: "16px",
            }}
          >
            {saving ? "Creating..." : "Create Task"}
          </button>

          {message && (
            <p
              style={{
                marginTop: "16px",
                fontWeight: 600,
              }}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}