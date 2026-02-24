import type { Express } from "express";
import { createServer, type Server } from "node:http";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://guczydknusnhpooaxvtb.supabase.co";

const supabaseAdmin = createClient(
  SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  { auth: { autoRefreshToken: false, persistSession: false } }
);

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

    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    let tempPassword = "";
    for (let i = 0; i < 10; i++) {
      tempPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const updateRes = await fetch(
      `${SUPABASE_URL}/auth/v1/admin/users/${user.id}`,
      {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${serviceKey}`,
          "apikey": serviceKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: tempPassword,
        }),
      }
    );

    if (!updateRes.ok) {
      const errText = await updateRes.text();
      console.error("update password error:", updateRes.status, errText);
      return res.status(500).json({ success: false, message: "Erro ao redefinir senha." });
    }

    console.log(`reset-password: senha redefinida para "${trimmedEmail}"`);
    return res.json({
      success: true,
      tempPassword,
      message: "Senha redefinida com sucesso!",
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
