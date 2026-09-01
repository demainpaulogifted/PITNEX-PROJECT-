import { prisma } from "./prisma";

function createReference(prefix = "PIT") {
  return `${prefix}_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 10)
    .toUpperCase()}`;
}


/**
 * Get or create a user's wallet.
 */
export async function getOrCreateWallet(userId) {
  let wallet = await prisma.pitnexWallet.findUnique({
    where: {
      userId,
    },
  });

  if (!wallet) {
    wallet = await prisma.pitnexWallet.create({
      data: {
        userId,
        balanceKobo: 0,
        lifetimeEarnedKobo: 0,
        lifetimeWithdrawnKobo: 0,
      },
    });
  }

  return wallet;
}


/**
 * Get wallet balance.
 */
export async function getWalletBalance(userId) {
  const wallet = await getOrCreateWallet(userId);

  return {
    balanceKobo: wallet.balanceKobo,
    balanceNaira: Number(wallet.balanceKobo) / 100,
    lifetimeEarnedNaira:
      Number(wallet.lifetimeEarnedKobo) / 100,
    lifetimeWithdrawnNaira:
      Number(wallet.lifetimeWithdrawnKobo) / 100,
  };
}


/**
 * Credit a user's wallet.
 *
 * IMPORTANT:
 * This must only be called from trusted server-side code.
 */
export async function creditWallet({
  userId,
  amountKobo,
  type,
  description,
  metadata = {},
}) {
  if (!Number.isInteger(amountKobo) || amountKobo <= 0) {
    throw new Error("Invalid wallet credit amount.");
  }

  return prisma.$transaction(async (tx) => {
    const wallet = await tx.pitnexWallet.upsert({
      where: {
        userId,
      },

      create: {
        userId,
        balanceKobo: BigInt(amountKobo),
        lifetimeEarnedKobo: BigInt(amountKobo),
        lifetimeWithdrawnKobo: 0,
      },

      update: {},
    });

    const transaction =
      await tx.pitnexWalletTransaction.create({
        data: {
          userId,
          walletId: wallet.id,
          type,
          status: "COMPLETED",
          amountKobo: BigInt(amountKobo),
          reference: createReference("EARN"),
          description,
          metadata,
        },
      });

    await tx.pitnexWallet.update({
      where: {
        id: wallet.id,
      },

      data: {
        balanceKobo: {
          increment: BigInt(amountKobo),
        },

        lifetimeEarnedKobo: {
          increment: BigInt(amountKobo),
        },
      },
    });

    return transaction;
  });
}


/**
 * Debit a user's wallet.
 *
 * Used later for withdrawals.
 *
 * This function prevents the balance from becoming negative.
 */
export async function debitWallet({
  userId,
  amountKobo,
  type,
  description,
  metadata = {},
}) {
  if (!Number.isInteger(amountKobo) || amountKobo <= 0) {
    throw new Error("Invalid wallet debit amount.");
  }

  return prisma.$transaction(async (tx) => {
    const wallet = await tx.pitnexWallet.findUnique({
      where: {
        userId,
      },
    });

    if (!wallet) {
      throw new Error("Wallet not found.");
    }

    if (wallet.balanceKobo < BigInt(amountKobo)) {
      throw new Error("Insufficient wallet balance.");
    }

    const transaction =
      await tx.pitnexWalletTransaction.create({
        data: {
          userId,
          walletId: wallet.id,
          type,
          status: "COMPLETED",
          amountKobo: BigInt(amountKobo),
          reference: createReference("DEBIT"),
          description,
          metadata,
        },
      });

    await tx.pitnexWallet.update({
      where: {
        id: wallet.id,
      },

      data: {
        balanceKobo: {
          decrement: BigInt(amountKobo),
        },
      },
    });

    return transaction;
  });
}