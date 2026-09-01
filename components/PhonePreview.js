import {
  Flame,
  ListChecks,
  Gamepad2,
  TrendingUp
} from "lucide-react";

export default function PhonePreview() {
  return (
    <div className="phone-wrapper">

      <div className="phone">

        <div className="phone-screen">

          <div className="phone-top">

            <span>GOOD AFTERNOON</span>

            <div className="balance-label">
              WALLET BALANCE
            </div>

            <div className="phone-balance">
              ₦0.00
            </div>

            <div className="phone-actions">
              <button>Invest</button>
              <button>Withdraw</button>
            </div>

          </div>

          <div className="phone-grid">

            <div className="phone-card">
              <Flame />
              <span>Check-in</span>
            </div>

            <div className="phone-card">
              <ListChecks />
              <span>Tasks</span>
            </div>

            <div className="phone-card">
              <Gamepad2 />
              <span>Games</span>
            </div>

            <div className="phone-card">
              <TrendingUp />
              <span>Packages</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}