import { extractCVDataAndProfile } from "./lib/claude.js";
import { generateCV } from "./lib/cv-generator.js";
import { sendCVByEmail } from "./lib/email.js";

export const maxDuration = 60;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages, email } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "messages array is required" });
  }

  try {
    const conversation = messages
      .map((m) => `${m.role === "user" ? "Usuario" : "Asistente"}: ${m.content}`)
      .join("\n\n");

    console.log("Extrayendo datos y generando perfil...");
    const { cvData, profileText } = await extractCVDataAndProfile(conversation);

    console.log("Generando documento Word...");
    const cvBuffer = await generateCV(cvData, profileText);

    const emailTarget = email || cvData.email;
    if (emailTarget && process.env.RESEND_API_KEY) {
      await sendCVByEmail(emailTarget, cvData.nombre, cvBuffer);
    }

    const base64 = cvBuffer.toString("base64");
    const safeFileName = (cvData.nombre || "CV").replace(/\s+/g, "_");

    return res.status(200).json({
      success: true,
      fileName: `CV_${safeFileName}.docx`,
      fileBase64: base64,
      emailSent: !!(emailTarget && process.env.RESEND_API_KEY),
      nombre: cvData.nombre,
    });
  } catch (error) {
    console.error("Error generando CV:", error);
    return res.status(500).json({ error: "Error generando el CV: " + error.message });
  }
}
