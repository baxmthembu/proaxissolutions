import { Router, raw } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { env } from "../config/env";
import { authenticate } from "../middleware/auth";
import {
  createCapitecPayment,
  getPaymentStatus,
  verifyWebhookSignature,
  mapStitchStatus,
} from "../services/stitch.service";

export const paymentRouter = Router();

/**
 * Start a premium membership (R49/mo) via Capitec Pay.
 * Returns the Stitch interaction URL — the student completes payment inside
 * their Capitec app, no card checkout.
 */
paymentRouter.post("/membership", authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: req.auth!.sub } });

    const membership = await prisma.membership.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        tier: "PREMIUM",
        priceCents: env.MEMBERSHIP_PRICE_CENTS,
        stitchPayerRef: user.id,
      },
      update: { priceCents: env.MEMBERSHIP_PRICE_CENTS },
    });

    const externalReference = `mem_${membership.id}_${Date.now()}`;

    const payment = await createCapitecPayment({
      amountCents: env.MEMBERSHIP_PRICE_CENTS,
      externalReference,
      payer: {
        identifier: user.id,
        mobileNumber: user.mobileNumber,
        fullName: user.fullName,
        email: user.email,
      },
      metadata: { purpose: "premium_membership", userId: user.id },
    });

    await prisma.transaction.create({
      data: {
        type: "MEMBERSHIP",
        status: mapStitchStatus(payment.status),
        amountCents: env.MEMBERSHIP_PRICE_CENTS,
        userId: user.id,
        membershipId: membership.id,
        stitchPaymentId: payment.id,
        externalReference,
        interactionUrl: payment.redirectUrl,
      },
    });

    res.status(201).json({ paymentId: payment.id, redirectUrl: payment.redirectUrl });
  } catch (err) {
    next(err);
  }
});

/** Poll a payment's status (used by the /membership/return page). */
paymentRouter.get("/membership/:paymentId/status", authenticate, async (req, res, next) => {
  try {
    const txn = await prisma.transaction.findFirst({
      where: { stitchPaymentId: req.params.paymentId, userId: req.auth!.sub },
    });
    if (!txn) return res.status(404).json({ error: "Unknown payment" });

    const remote = await getPaymentStatus(req.params.paymentId);
    const status = mapStitchStatus(remote);
    if (status !== txn.status) await applyPaymentOutcome(txn.id, status);
    res.json({ status });
  } catch (err) {
    next(err);
  }
});

/**
 * Stitch webhook. Mounted with a raw body parser so the HMAC signature is
 * verified against the exact bytes Stitch signed.
 */
paymentRouter.post("/webhook", raw({ type: "*/*" }), async (req, res) => {
  const signature = req.header("x-stitch-signature") ?? req.header("stitch-signature");
  const rawBody = req.body as Buffer;

  if (!verifyWebhookSignature(rawBody, signature)) {
    return res.status(401).json({ error: "Bad signature" });
  }

  let payload: any;
  try {
    payload = JSON.parse(rawBody.toString("utf8"));
  } catch {
    return res.status(400).json({ error: "Bad payload" });
  }

  // Stitch payment webhooks reference the payment-request id + status.
  const node = payload?.data?.client?.paymentRequest ?? payload?.paymentRequest ?? payload;
  const paymentId: string | undefined = node?.id ?? payload?.id;
  const remoteStatus: string | undefined = node?.status ?? payload?.status;
  if (!paymentId || !remoteStatus) return res.status(202).json({ ignored: true });

  const txn = await prisma.transaction.findUnique({ where: { stitchPaymentId: paymentId } });
  if (txn) {
    await prisma.transaction.update({
      where: { id: txn.id },
      data: { rawWebhookPayload: payload },
    });
    await applyPaymentOutcome(txn.id, mapStitchStatus(remoteStatus));
  }
  res.json({ received: true });
});

/** Idempotently apply a terminal payment outcome to membership + transaction. */
async function applyPaymentOutcome(
  transactionId: string,
  status: "COMPLETED" | "FAILED" | "EXPIRED" | "CANCELLED" | "PENDING"
) {
  const txn = await prisma.transaction.findUniqueOrThrow({ where: { id: transactionId } });
  if (txn.status === "COMPLETED") return; // already settled

  await prisma.transaction.update({ where: { id: txn.id }, data: { status } });

  if (status === "COMPLETED" && txn.membershipId && txn.userId) {
    const now = new Date();
    const end = new Date(now);
    end.setMonth(end.getMonth() + 1);
    await prisma.$transaction([
      prisma.membership.update({
        where: { id: txn.membershipId },
        data: { active: true, currentStart: now, currentEnd: end },
      }),
      prisma.user.update({ where: { id: txn.userId }, data: { membershipTier: "PREMIUM" } }),
    ]);
  }
}
