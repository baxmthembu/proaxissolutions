import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import { prisma } from "./lib/prisma";
import { notFound, errorHandler } from "./middleware/error";
import { expireStaleTokens } from "./services/token.service";

import { authRouter } from "./routes/auth.routes";
import { voucherRouter } from "./routes/voucher.routes";
import { tokenRouter } from "./routes/token.routes";
import { paymentRouter } from "./routes/payment.routes";
import { doorRouter } from "./routes/door.routes";
import { dashboardRouter } from "./routes/dashboard.routes";
import { seoRouter } from "./routes/seo.routes";
import { ugcRouter } from "./routes/ugc.routes";
import { cloutshareRouter } from "./routes/cloutshare.routes";

const app = express();

app.set("trust proxy", 1);
app.use(helmet());
app.use(cors({ origin: env.WEB_BASE_URL, credentials: true }));

// The Stitch webhook needs the raw body for signature verification, so JSON
// parsing is skipped for that one path (the route mounts its own raw parser).
app.use((req, res, next) => {
  if (req.originalUrl === "/api/payments/webhook") return next();
  return express.json({ limit: "1mb" })(req, res, next);
});

app.use(
  rateLimit({
    windowMs: 60_000,
    limit: 120,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get("/health", (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

app.use("/api/auth", authRouter);
app.use("/api/vouchers", voucherRouter);
app.use("/api/tokens", tokenRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/door", doorRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/seo", seoRouter);
app.use("/api/ugc", ugcRouter);
app.use("/api/cloutshare", cloutshareRouter);

app.use(notFound);
app.use(errorHandler);

// Sweep expired single-use tokens every 30s so scarcity counts stay honest.
const sweep = setInterval(() => {
  expireStaleTokens().catch((e) => console.error("token sweep failed", e));
}, 30_000);

const server = app.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`DbnOvrload API listening on http://localhost:${env.PORT}`);
});

async function shutdown() {
  clearInterval(sweep);
  server.close();
  await prisma.$disconnect();
  process.exit(0);
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
