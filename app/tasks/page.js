import Header from "@/components/Header";

export default function TasksPage() {
  return (
    <>
      <Header />

      <main className="simple-page">

        <div className="page-heading">
          <span>Earn more</span>
          <h1>Available Tasks</h1>
          <p>
            Complete available tasks and receive
            rewards in your Pitnex wallet.
          </p>
        </div>

        <div className="task-card">

          <div>
            <h2>Community Task</h2>
            <p>
              Join the official community channel
              and complete the verification.
            </p>
          </div>

          <strong>₦500</strong>

          <button>
            Start Task
          </button>

        </div>

      </main>
    </>
  );
}