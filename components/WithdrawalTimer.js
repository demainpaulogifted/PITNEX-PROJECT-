"use client";

import { useEffect, useState } from "react";

function getNextWithdrawalWindow() {
  const now = new Date();

  const start = new Date(now);
  start.setHours(18, 0, 0, 0);

  const end = new Date(now);
  end.setHours(19, 0, 0, 0);

  if (now >= start && now < end) {
    return {
      status: "open",
      target: end
    };
  }

  if (now < start) {
    return {
      status: "closed",
      target: start
    };
  }

  start.setDate(start.getDate() + 1);

  return {
    status: "closed",
    target: start
  };
}

function formatTime(milliseconds) {
  if (milliseconds <= 0) {
    return "00:00:00";
  }

  const totalSeconds = Math.floor(milliseconds / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [
    hours.toString().padStart(2, "0"),
    minutes.toString().padStart(2, "0"),
    seconds.toString().padStart(2, "0")
  ].join(":");
}

export default function WithdrawalTimer() {
  const [remaining, setRemaining] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      const window = getNextWithdrawalWindow();

      const difference =
        window.target.getTime() - Date.now();

      setRemaining(difference);
      setOpen(window.status === "open");
    };

    update();

    const timer = setInterval(update, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`withdrawal-timer ${open ? "open" : ""}`}>

      <div>
        <strong>
          {open
            ? "Withdrawals are currently open"
            : "Next withdrawal window"}
        </strong>

        <p>
          {open
            ? "You can submit your withdrawal request now."
            : "Withdrawals are controlled by the global Pitnex withdrawal schedule."}
        </p>
      </div>

      <div className="timer-value">
        {formatTime(remaining)}
      </div>

    </div>
  );
}