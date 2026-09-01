import Header from "@/components/Header";
import { PITNEX_CONFIG } from "@/lib/config";

export default function PackagesPage() {
  return (
    <>
      <Header />

      <main className="simple-page">

        <div className="page-heading">

          <span>Grow your earnings</span>

          <h1>Investment Packages</h1>

          <p>
            Explore available Pitnex packages.
          </p>

        </div>

        <div className="packages-grid">

          {PITNEX_CONFIG.packages.map((pkg) => (

            <div
              className="package-card"
              key={pkg.id}
            >

              <h2>{pkg.name}</h2>

              <div className="package-price">
                ₦{pkg.price.toLocaleString()}
              </div>

              <p>{pkg.description}</p>

              <div className="package-reward">
                Daily reward: ₦
                {pkg.dailyReward.toLocaleString()}
              </div>

              <button>
                View Package
              </button>

            </div>

          ))}

        </div>

      </main>
    </>
  );
}