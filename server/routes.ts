import type { Express } from "express";
import { createServer, type Server } from "node:http";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://guczydknusnhpooaxvtb.supabase.co";

const supabaseAdmin = createClient(
  SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const resetCooldowns = new Map<string, number>();

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/check-email", async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ exists: false, message: "E-mail não informado." });
    }

    const trimmedEmail = email.trim().toLowerCase();

    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

    const response = await fetch(
      `${SUPABASE_URL}/auth/v1/admin/users?page=1&per_page=50`,
      {
        headers: {
          "Authorization": `Bearer ${serviceKey}`,
          "apikey": serviceKey,
        },
      }
    );

    if (!response.ok) {
      console.error("Supabase admin API error:", response.status, await response.text());
      return res.status(500).json({ exists: false, message: "Erro ao verificar e-mail." });
    }

    const data = await response.json();
    const users = data.users || data || [];

    const userExists = Array.isArray(users) && users.some(
      (u: { email?: string }) => u.email?.toLowerCase() === trimmedEmail
    );

    console.log(`check-email: "${trimmedEmail}" -> exists: ${userExists}`);

    return res.json({ exists: !!userExists });
  });

  app.post("/api/reset-password", async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "E-mail não informado." });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

    const usersRes = await fetch(
      `${SUPABASE_URL}/auth/v1/admin/users?page=1&per_page=50`,
      {
        headers: {
          "Authorization": `Bearer ${serviceKey}`,
          "apikey": serviceKey,
        },
      }
    );

    if (!usersRes.ok) {
      return res.status(500).json({ success: false, message: "Erro ao verificar e-mail." });
    }

    const usersData = await usersRes.json();
    const users = usersData.users || usersData || [];
    const user = Array.isArray(users) && users.find(
      (u: { email?: string; id?: string }) => u.email?.toLowerCase() === trimmedEmail
    );

    if (!user) {
      return res.json({ success: false, message: "E-mail não cadastrado." });
    }

    const now = Date.now();
    const lastReset = resetCooldowns.get(trimmedEmail) || 0;
    const cooldownMs = 65000;
    const remaining = cooldownMs - (now - lastReset);

    if (remaining > 0) {
      const seconds = Math.ceil(remaining / 1000);
      return res.json({
        success: false,
        message: `Aguarde ${seconds} segundos antes de solicitar novamente.`,
      });
    }

    resetCooldowns.set(trimmedEmail, now);

    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: "recovery",
      email: trimmedEmail,
    });

    if (linkError || !linkData) {
      console.error("generate link error:", linkError?.message);
      resetCooldowns.delete(trimmedEmail);
      return res.status(500).json({ success: false, message: "Erro ao gerar link de redefinição." });
    }

    const actionLink = linkData.properties?.action_link;

    if (!actionLink) {
      resetCooldowns.delete(trimmedEmail);
      return res.status(500).json({ success: false, message: "Erro ao gerar link de redefinição." });
    }

    console.log(`reset-password: link gerado para "${trimmedEmail}": ${actionLink}`);
    return res.json({
      success: true,
      recoveryLink: actionLink,
      maskedEmail: trimmedEmail.replace(/(.{2})(.*)(@.*)/, "$1***$3"),
      message: "Link de redefinição gerado com sucesso.",
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
