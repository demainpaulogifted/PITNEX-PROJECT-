export const PITNEX_CONFIG = {
  appName: "Pitnex",

  currency: "₦",

  dailyCheckInReward: 1000,

  withdrawal: {
    enabled: true,

    // Global withdrawal schedule.
    // This will later be controlled from the admin panel/database.
    windowDurationMinutes: 60,

    // Example: withdrawals become available every day
    // during this global window.
    windowStartHour: 18,
    windowStartMinute: 0,

    windowEndHour: 19,
    windowEndMinute: 0
  },

  packages: [
    {
      id: "starter",
      name: "Starter",
      price: 5000,
      dailyReward: 500,
      description: "Start earning with the basic package."
    },
    {
      id: "elite",
      name: "Elite",
      price: 20000,
      dailyReward: 2000,
      description: "Unlock higher earning opportunities."
    },
    {
      id: "premium",
      name: "Premium",
      price: 50000,
      dailyReward: 5000,
      description: "Maximum earning potential for active users."
    }
  ]
};