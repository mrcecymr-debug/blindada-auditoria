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

  const httpServer = createServer(app);

  return httpServer;
}
