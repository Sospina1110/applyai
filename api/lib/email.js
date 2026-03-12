import { Resend } from "resend";

let _resend = null;
function getResend() {
  if (!_resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY no configurada");
    }
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

export async function sendCVByEmail(toEmail, nombre, cvBuffer) {
  const resend = getResend();
  const firstName = nombre.split(" ")[0];
  const safeFileName = nombre.replace(/\s+/g, "_");

  const { data, error } = await resend.emails.send({
    from: "ApplyAI <cv@applyai.co>",
    to: [toEmail],
    subject: `Tu CV profesional está listo, ${firstName} 🎉`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #e5e5e5; border-radius: 12px; overflow: hidden;">

        <div style="background: linear-gradient(135deg, #059669, #047857); padding: 40px 32px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: white;">¡Tu CV está listo, ${firstName}!</h1>
          <p style="margin: 12px 0 0; color: rgba(255,255,255,0.85); font-size: 16px;">Creado con ApplyAI</p>
        </div>

        <div style="padding: 32px;">
          <p style="font-size: 16px; line-height: 1.6; color: #d4d4d4;">
            Hola <strong>${firstName}</strong>,
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #d4d4d4;">
            Tu CV profesional está adjunto a este correo en formato Word (.docx). Puedes abrirlo,
            revisarlo y hacer cualquier ajuste final antes de enviarlo.
          </p>

          <div style="background: #1a1a1a; border-left: 4px solid #059669; padding: 20px; border-radius: 8px; margin: 24px 0;">
            <p style="margin: 0; font-size: 15px; color: #a3a3a3; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Consejos rápidos</p>
            <ul style="margin: 12px 0 0; padding-left: 20px; color: #d4d4d4; line-height: 1.8;">
              <li>Revisa que toda la información esté correcta</li>
              <li>Convierte a PDF antes de enviar a empleadores</li>
              <li>Personaliza el perfil para cada aplicación</li>
              <li>Mantén el CV en una sola página</li>
            </ul>
          </div>

          <p style="font-size: 15px; color: #737373; line-height: 1.6;">
            ¿Necesitas hacer cambios o generar un nuevo CV? Vuelve a <strong>ApplyAI</strong> cuando quieras.
          </p>
        </div>

        <div style="padding: 20px 32px; border-top: 1px solid #262626; text-align: center;">
          <p style="margin: 0; font-size: 13px; color: #525252;">
            Creado con ApplyAI · Tu CV profesional en minutos
          </p>
        </div>
      </div>
    `,
    attachments: [
      {
        filename: `CV_${safeFileName}.docx`,
        content: cvBuffer,
      },
    ],
  });

  if (error) {
    console.error("Error enviando email:", error);
    throw new Error(`Error al enviar el email: ${error.message}`);
  }

  return data;
}
