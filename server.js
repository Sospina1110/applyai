// Servidor de desarrollo local
// En producción Vercel maneja las funciones serverless automáticamente

import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

// Importar handlers de la API
import chatHandler from "./api/chat.js";
import generateCVHandler from "./api/generate-cv.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3001;

// Verificar API key
if (!process.env.ANTHROPIC_API_KEY) {
  console.error("❌ ANTHROPIC_API_KEY no está configurada en .env");
  process.exit(1);
}

const app = express();
app.use(express.json({ limit: "10mb" }));

// Adaptador para convertir handlers de Vercel a Express
function vercelToExpress(handler) {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (err) {
      console.error("Handler error:", err.message, err.stack);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}

// Rutas de API
app.post("/api/chat", vercelToExpress(chatHandler));
app.post("/api/generate-cv", vercelToExpress(generateCVHandler));

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ API server corriendo en http://localhost:${PORT}`);
  console.log(`   Para el frontend corre: npm run dev`);
});
