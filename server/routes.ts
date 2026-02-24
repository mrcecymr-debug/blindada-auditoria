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

    const { data: allUsers, error } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    if (error) {
      return res.status(500).json({ exists: false, message: "Erro ao verificar e-mail." });
    }

    const userExists = allUsers?.users?.some(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );

    return res.json({ exists: !!userExists });
  });

  const httpServer = createServer(app);

  return httpServer;
}
