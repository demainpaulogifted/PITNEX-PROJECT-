"use client";

import { useState } from "react";

import Header from "@/components/Header";
import WithdrawalTimer from "@/components/WithdrawalTimer";

export default function WithdrawPage() {
  const [amount, setAmount] = useState("");

  return (
    <>
      <Header />

      <main className="simple-page">

        <div className="page-heading">

          <span>Wallet</span>

          <h1>Withdraw Funds</h1>

          <p>
            Withdraw your available balance to
            your Nigerian bank account.
          </p>

        </div>

        <WithdrawalTimer />

        <div className="withdraw-card">

          <div className="available-balance">
            <span>Available Balance</span>
            <strong>₦0.00</strong>
          </div>

          <label>
            Withdrawal Amount

            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(event) =>
                setAmount(event.target.value)
              }
            />
          </label>

          <label>
            Bank

            <select>
              <option>Select bank</option>
              <option>Access Bank</option>
              <option>GTBank</option>
              <option>First Bank</option>
              <option>UBA</option>
              <option>Zenith Bank</option>
            </select>
          </label>

          <label>
            Account Number

            <input
              type="text"
              placeholder="Enter account number"
            />
          </label>

          <button className="primary-button full-width">
            Submit Withdrawal Request
          </button>

          <p className="withdraw-note">
            Withdrawal requests are processed
            according to the global Pitnex
            withdrawal schedule.
          </p>

        </div>

      </main>
    </>
  );
}