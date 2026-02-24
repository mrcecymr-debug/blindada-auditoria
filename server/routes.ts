import type { Express } from "express";
import { createServer, type Server } from "node:http";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  "https://guczydknusnhpooaxvtb.supabase.co",
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

    const supabaseUrl = "https://guczydknusnhpooaxvtb.supabase.co";
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

    const response = await fetch(
      `${supabaseUrl}/auth/v1/admin/users?page=1&per_page=50`,
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
    const supabaseUrl = "https://guczydknusnhpooaxvtb.supabase.co";
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

    const usersRes = await fetch(
      `${supabaseUrl}/auth/v1/admin/users?page=1&per_page=50`,
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
      (u: { email?: string }) => u.email?.toLowerCase() === trimmedEmail
    );

    if (!user) {
      return res.json({ success: false, message: "E-mail não cadastrado." });
    }

    const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1Y3p5ZGtudXNuaHBvb2F4dnRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMzM0NTgsImV4cCI6MjA4NjkwOTQ1OH0.1LbtGWDL79v04gogWdWTw118TdncwpPEXIxzjYKlLME";

    const recoveryRes = await fetch(
      `${supabaseUrl}/auth/v1/recover`,
      {
        method: "POST",
        headers: {
          "apikey": anonKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: trimmedEmail,
        }),
      }
    );

    if (!recoveryRes.ok) {
      const errText = await recoveryRes.text();
      console.error("recovery error:", recoveryRes.status, errText);

      if (recoveryRes.status === 429) {
        return res.json({ success: false, message: "Aguarde alguns segundos antes de tentar novamente." });
      }

      return res.status(500).json({ success: false, message: "Erro ao enviar e-mail de redefinição." });
    }

    console.log(`reset-password: email de recuperação enviado para "${trimmedEmail}"`);
    return res.json({ success: true, message: "E-mail de redefinição enviado com sucesso." });
  });

  const httpServer = createServer(app);

  return httpServer;
}
