import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  APP_BASE_URL: z.string().url().default("http://localhost:4000"),
  WEB_BASE_URL: z.string().url().default("http://localhost:5173"),

  DATABASE_URL: z.string().min(1),

  JWT_SECRET: z.string().min(16),
  JWT_EXPIRES_IN: z.string().default("7d"),

  TOTP_MASTER_SECRET: z.string().min(16),
  VOUCHER_TOKEN_TTL_SECONDS: z.coerce.number().default(60),
  ENTRANCE_TOTP_STEP_SECONDS: z.coerce.number().default(60),

  STITCH_CLIENT_ID: z.string().default(""),
  STITCH_CLIENT_SECRET: z.string().default(""),
  STITCH_TOKEN_URL: z.string().url().default("https://secure.stitch.money/connect/token"),
  STITCH_API_URL: z.string().url().default("https://api.stitch.money/v2"),
  STITCH_REDIRECT_URI: z.string().url().default("http://localhost:5173/membership/return"),
  STITCH_WEBHOOK_SECRET: z.string().default(""),
  STITCH_BENEFICIARY_NAME: z.string().default("DbnOvrload Pty Ltd"),
  STITCH_BENEFICIARY_BANK: z.string().default("capitec"),
  STITCH_BENEFICIARY_ACCOUNT: z.string().default("0000000000"),

  PROMOTER_WEBHOOK_URL: z.string().default(""),
  PROMOTER_SURGE_THRESHOLD: z.coerce.number().default(50),

  MEMBERSHIP_PRICE_CENTS: z.coerce.number().default(4900),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error("Invalid environment configuration:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
export const isProd = env.NODE_ENV === "production";
