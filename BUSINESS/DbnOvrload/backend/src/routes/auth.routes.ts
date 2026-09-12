import { Router } from "express";
import crypto from "crypto";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { signToken } from "../lib/jwt";
import { authenticate } from "../middleware/auth";

export const authRouter = Router();

const SALT_ROUNDS_NOTE = "scrypt"; // password hashing without a native dep

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}
function verifyPassword(password: string, stored: string): boolean {
  const [salt, derived] = stored.split(":");
  if (!salt || !derived) return false;
  const test = crypto.scryptSync(password, salt, 64).toString("hex");
  const a = Buffer.from(test);
  const b = Buffer.from(derived);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** Student self-registration — phone-first, POPIA consent captured explicitly. */
const registerSchema = z.object({
  fullName: z.string().min(2),
  mobileNumber: z.string().regex(/^(\+?27|0)\d{9}$/, "Valid SA mobile required"),
  email: z.string().email().optional(),
  campusSlug: z.string().optional(),
  consentPopia: z.literal(true, { errorMap: () => ({ message: "POPIA consent is required" }) }),
});

authRouter.post("/register", async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);
    const user = await prisma.user.create({
      data: {
        fullName: data.fullName,
        mobileNumber: data.mobileNumber,
        email: data.email,
        campusSlug: data.campusSlug,
        role: "STUDENT",
        consentPopiaAt: new Date(),
      },
    });
    const token = signToken({ sub: user.id, role: user.role, venueId: null });
    res.status(201).json({ token, user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

/** Lightweight phone-only login for students (OTP delivery is out of scope here). */
authRouter.post("/login/student", async (req, res, next) => {
  try {
    const { mobileNumber } = z.object({ mobileNumber: z.string() }).parse(req.body);
    const user = await prisma.user.findUnique({ where: { mobileNumber } });
    if (!user) return res.status(404).json({ error: "No account for that number" });
    const token = signToken({ sub: user.id, role: user.role, venueId: user.doorAtVenueId });
    res.json({ token, user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

/** Staff/owner login with password. */
authRouter.post("/login/staff", async (req, res, next) => {
  try {
    const { email, password } = z
      .object({ email: z.string().email(), password: z.string().min(6) })
      .parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user?.passwordHash || !verifyPassword(password, user.passwordHash)) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = signToken({ sub: user.id, role: user.role, venueId: user.doorAtVenueId });
    res.json({ token, user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

authRouter.get("/me", authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: req.auth!.sub } });
    res.json({ user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

function publicUser(u: {
  id: string;
  fullName: string;
  role: string;
  mobileNumber: string;
  campusSlug: string | null;
  membershipTier: string;
}) {
  return {
    id: u.id,
    fullName: u.fullName,
    role: u.role,
    mobileNumber: u.mobileNumber,
    campusSlug: u.campusSlug,
    membershipTier: u.membershipTier,
  };
}

export { hashPassword };
export const __hashing = SALT_ROUNDS_NOTE;
