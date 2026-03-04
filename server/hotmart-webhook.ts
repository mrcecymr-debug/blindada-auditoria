import type { Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://guczydknusnhpooaxvtb.supabase.co";

function getSupabaseAdmin() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY not configured");
  }
  return createClient(SUPABASE_URL, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function validateHottok(req: Request): boolean {
  const hottok = process.env.HOTMART_HOTTOK;
  if (!hottok) return false;

  const receivedToken =
    req.body?.hottok || req.query?.hottok || req.headers["x-hotmart-hottok"];

  return receivedToken === hottok;
}

function generateTempPassword(): string {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghjkmnpqrstuvwxyz";
  const digits = "23456789";
  let password = "";
  password += upper.charAt(Math.floor(Math.random() * upper.length));
  password += lower.charAt(Math.floor(Math.random() * lower.length));
  password += digits.charAt(Math.floor(Math.random() * digits.length));
  const all = upper + lower + digits;
  for (let i = 0; i < 5; i++) {
    password += all.charAt(Math.floor(Math.random() * all.length));
  }
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

export async function handleHotmartWebhook(
  req: Request,
  res: Response,
): Promise<void> {
  console.log("[Hotmart Webhook] Received request");
  console.log("[Hotmart Webhook] Body:", JSON.stringify(req.body, null, 2));

  if (!validateHottok(req)) {
    console.log("[Hotmart Webhook] Invalid hottok token");
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const event = req.body?.event;
  const validEvents = ["PURCHASE_APPROVED", "PURCHASE_COMPLETE"];
  if (!validEvents.includes(event)) {
    console.log(`[Hotmart Webhook] Ignoring event: ${event}`);
    res.status(200).json({ status: "ignored", event });
    return;
  }

  const buyerData = req.body?.data?.buyer;
  if (!buyerData?.email) {
    console.log("[Hotmart Webhook] No buyer email found");
    res.status(400).json({ error: "No buyer email" });
    return;
  }

  const email = buyerData.email.toLowerCase().trim();
  const name = buyerData.name || email.split("@")[0];

  console.log(`[Hotmart Webhook] Creating user for: ${email}`);

  try {
    const supabase = getSupabaseAdmin();

    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const userExists = existingUsers?.users?.some(
      (u) => u.email?.toLowerCase() === email,
    );

    if (userExists) {
      console.log(`[Hotmart Webhook] User already exists: ${email}`);
      res.status(200).json({ status: "user_already_exists", email });
      return;
    }

    const tempPassword = generateTempPassword();

    const { data: newUser, error: createError } =
      await supabase.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
          full_name: name,
          source: "hotmart",
          purchase_date: new Date().toISOString(),
          needs_password_reset: true,
          temp_password: tempPassword,
        },
      });

    if (createError) {
      console.error("[Hotmart Webhook] Error creating user:", createError);
      res.status(500).json({ error: "Failed to create user" });
      return;
    }

    console.log(`[Hotmart Webhook] User created with temp password: ${email} (ID: ${newUser.user.id})`);

    const { error: resetError } =
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "https://www.mrserver.com.br",
      });

    if (resetError) {
      console.log(`[Hotmart Webhook] Email note: ${resetError.message}`);
    } else {
      console.log(`[Hotmart Webhook] Welcome email sent to: ${email}`);
    }

    res.status(200).json({
      status: "user_created",
      email,
      userId: newUser.user.id,
    });
  } catch (err) {
    console.error("[Hotmart Webhook] Unexpected error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
