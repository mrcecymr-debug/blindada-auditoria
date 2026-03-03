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

    const { data: inviteData, error: inviteError } =
      await supabase.auth.admin.inviteUserByEmail(email, {
        data: {
          full_name: name,
          source: "hotmart",
          purchase_date: new Date().toISOString(),
        },
        redirectTo: "https://www.mrserver.com.br/login",
      });

    if (inviteError) {
      console.error("[Hotmart Webhook] Error inviting user:", inviteError);
      res.status(500).json({ error: "Failed to invite user" });
      return;
    }

    console.log(
      `[Hotmart Webhook] User invited: ${email} (ID: ${inviteData.user.id})`,
    );

    res.status(200).json({
      status: "user_invited",
      email,
      userId: inviteData.user.id,
    });
  } catch (err) {
    console.error("[Hotmart Webhook] Unexpected error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
