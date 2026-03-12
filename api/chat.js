import { chat } from "./lib/claude.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "messages array is required" });
  }

  try {
    const reply = await chat(messages);
    const readyToGenerate = reply.includes("###READY_TO_GENERATE###");
    const cleanReply = reply.replace("###READY_TO_GENERATE###", "").trim();

    return res.status(200).json({
      message: cleanReply,
      readyToGenerate,
    });
  } catch (error) {
    const fs = await import("fs");
    fs.default.writeFileSync("/tmp/chat_error.txt", String(error?.message) + "\n" + String(error?.stack));
    return res.status(500).json({ error: error?.message || "Error desconocido" });
  }
}
