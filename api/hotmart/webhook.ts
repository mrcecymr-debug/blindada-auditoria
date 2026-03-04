import type { VercelRequest, VercelResponse } from "@vercel/node";
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

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  console.log("[Hotmart Webhook] Received request");

  const hottok = process.env.HOTMART_HOTTOK;
  if (!hottok) {
    console.log("[Hotmart Webhook] HOTMART_HOTTOK not configured");
    res.status(500).json({ error: "Server misconfigured" });
    return;
  }

  const receivedToken =
    req.body?.hottok ||
    req.query?.hottok ||
    req.headers["x-hotmart-hottok"];

  if (receivedToken !== hottok) {
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

    const { data: inviteData, error: inviteError } =
      await supabase.auth.admin.inviteUserByEmail(email, {
        data: {
          full_name: name,
          source: "hotmart",
          purchase_date: new Date().toISOString(),
          needs_password_reset: true,
          temp_password: tempPassword,
        },
      });

    if (inviteError) {
      console.error("[Hotmart Webhook] Error inviting user:", inviteError);
      res.status(500).json({ error: "Failed to create user" });
      return;
    }

    const { error: updateError } = await supabase.auth.admin.updateUserById(
      inviteData.user.id,
      {
        password: tempPassword,
        email_confirm: true,
      },
    );

    if (updateError) {
      console.error("[Hotmart Webhook] Error setting password:", updateError);
    }

    console.log(`[Hotmart Webhook] User created: ${email} (ID: ${inviteData.user.id})`);

    res.status(200).json({
      status: "user_created",
      email,
      userId: inviteData.user.id,
    });
  } catch (err) {
    console.error("[Hotmart Webhook] Unexpected error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
