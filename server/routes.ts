import type { Express } from "express";
import { createServer, type Server } from "node:http";
import { handleHotmartWebhook } from "./hotmart-webhook";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/hotmart/webhook", handleHotmartWebhook);

  const httpServer = createServer(app);

  return httpServer;
}
