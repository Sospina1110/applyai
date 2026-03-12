import { useState, useRef, useEffect, useCallback } from "react";

const PRICE_COP = "$19.900";
const PRICE_LABEL = "COP";

const WELCOME_MESSAGE = {
  role: "assistant",
  content:
    "¡Hola! Soy ApplyAI 👋 Te voy a ayudar a crear un CV profesional en minutos.\n\nTe haré preguntas una por una para entender tu perfil y al final generaré tu CV en Word listo para enviar.\n\nComencemos: ¿A qué puesto o empresa estás aplicando?",
};

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-4">
      <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
        AI
      </div>
      <div className="bg-zinc-800 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
        <span className="typing-dot w-2 h-2 bg-zinc-400 rounded-full inline-block" />
        <span className="typing-dot w-2 h-2 bg-zinc-400 rounded-full inline-block" />
        <span className="typing-dot w-2 h-2 bg-zinc-400 rounded-full inline-block" />
      </div>
    </div>
  );
}

function Message({ msg }) {
  const isBot = msg.role === "assistant";
  const lines = msg.content.split("\n");

  return (
    <div className={`flex items-end gap-2 mb-4 message-enter ${isBot ? "" : "flex-row-reverse"}`}>
      {isBot && (
        <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mb-0.5">
          AI
        </div>
      )}
      <div className={`max-w-[78%] sm:max-w-[65%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
        isBot ? "bg-zinc-800 text-zinc-100 rounded-bl-sm" : "bg-emerald-600 text-white rounded-br-sm"
      }`}>
        {lines.map((line, i) => (
          <span key={i}>{line}{i < lines.length - 1 && <br />}</span>
        ))}
      </div>
    </div>
  );
}

function Spinner({ className = "w-5 h-5" }) {
  return (
    <svg className={`spinner ${className}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

// Modal de pago — aparece antes de generar el CV
function PaymentModal({ nombre, onPay, onClose, isLoading }) {
  const firstName = nombre ? nombre.split(" ")[0] : "tu";
  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-8 max-w-sm w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600/20 border border-emerald-600/40 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <h3 className="text-white font-semibold text-lg">Tu CV está listo, {firstName}</h3>
          <p className="text-zinc-400 text-sm mt-1">Descárgalo ahora por un único pago</p>
        </div>

        {/* Precio */}
        <div className="bg-zinc-800 rounded-xl p-4 mb-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-zinc-300 text-sm">CV Profesional estilo McKinsey</span>
            <span className="text-white font-bold">{PRICE_COP}</span>
          </div>
          <div className="space-y-2">
            {[
              "Formato Word (.docx) profesional",
              "Perfil redactado con IA",
              "Bullets de impacto estilo consultoría",
              "Listo para enviar hoy",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-zinc-400 text-xs">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Botón de pago */}
        <button
          onClick={onPay}
          disabled={isLoading}
          className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-semibold py-3.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 mb-3"
        >
          {isLoading ? (
            <><Spinner className="w-5 h-5 text-white" /> Redirigiendo al pago...</>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
              </svg>
              Pagar {PRICE_COP} {PRICE_LABEL}
            </>
          )}
        </button>

        <p className="text-center text-zinc-600 text-xs">
          Pago seguro con Stripe · Tarjetas débito/crédito
        </p>

        <button onClick={onClose} className="w-full text-zinc-500 hover:text-zinc-300 text-xs mt-3 py-1 transition-colors">
          Volver al chat
        </button>
      </div>
    </div>
  );
}

function GeneratingModal() {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-8 max-w-sm w-full text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-600/20 border-2 border-emerald-600 flex items-center justify-center mx-auto mb-6">
          <Spinner className="w-8 h-8 text-emerald-500" />
        </div>
        <h3 className="text-white font-semibold text-lg mb-2">Generando tu CV...</h3>
        <p className="text-zinc-400 text-sm">Creando tu documento profesional. Esto tarda unos segundos.</p>
      </div>
    </div>
  );
}

function SuccessModal({ fileName, fileBase64, emailSent, nombre, onClose }) {
  const handleDownload = () => {
    const byteChars = atob(fileBase64);
    const byteNums = new Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) byteNums[i] = byteChars.charCodeAt(i);
    const blob = new Blob([new Uint8Array(byteNums)], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-8 max-w-sm w-full text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-600/20 border-2 border-emerald-500 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-white font-semibold text-lg mb-2">
          ¡CV listo{nombre ? `, ${nombre.split(" ")[0]}` : ""}!
        </h3>
        <p className="text-zinc-400 text-sm mb-6">
          {emailSent ? "Te lo enviamos a tu correo. También puedes descargarlo ahora." : "Tu CV profesional está listo para descargar."}
        </p>
        <button
          onClick={handleDownload}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 px-6 rounded-xl transition-colors mb-3 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Descargar CV (.docx)
        </button>
        <button onClick={onClose} className="w-full text-zinc-400 hover:text-zinc-200 text-sm py-2 transition-colors">
          Hacer otro CV
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [cvResult, setCvResult] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [pendingMessages, setPendingMessages] = useState(null);
  const [pendingNombre, setPendingNombre] = useState(null);
  const [pendingEmail, setPendingEmail] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // Verificar si volvió de Stripe con pago exitoso
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get("payment");
    const sessionId = params.get("session_id");

    if (payment === "success" && sessionId) {
      // Limpiar URL
      window.history.replaceState({}, "", "/");
      // Recuperar mensajes guardados
      const savedMessages = sessionStorage.getItem("applyai_messages");
      if (savedMessages) {
        const msgs = JSON.parse(savedMessages);
        sessionStorage.removeItem("applyai_messages");
        setMessages(msgs);
        generateCV(msgs);
      }
    } else if (payment === "cancelled") {
      window.history.replaceState({}, "", "/");
    }
  }, []);

  const generateCV = useCallback(async (msgs) => {
    setIsGenerating(true);
    setShowPayment(false);
    try {
      const response = await fetch("/api/generate-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: msgs }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Error generando CV");
      }

      const data = await response.json();
      setCvResult(data);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Hubo un error generando tu CV. Por favor intenta de nuevo.",
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const handlePay = useCallback(async () => {
    if (!pendingMessages) return;
    setIsCheckingOut(true);

    // Guardar mensajes en sessionStorage para recuperarlos al volver de Stripe
    sessionStorage.setItem("applyai_messages", JSON.stringify(pendingMessages));

    try {
      const response = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: pendingNombre,
          email: pendingEmail,
          conversationId: Date.now().toString(),
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Error creando pago");
      }
    } catch (error) {
      console.error("Error checkout:", error);
      alert("Error al iniciar el pago. Por favor intenta de nuevo.");
      setIsCheckingOut(false);
    }
  }, [pendingMessages, pendingNombre, pendingEmail]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isTyping || isGenerating || showPayment) return;

    const userMessage = { role: "user", content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    try {
      const apiMessages = newMessages.map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!response.ok) throw new Error("Error de conexión");

      const data = await response.json();
      const botMessage = { role: "assistant", content: data.message };
      const updatedMessages = [...newMessages, botMessage];
      setMessages(updatedMessages);

      if (data.readyToGenerate) {
        // Extraer nombre y email de los mensajes para el checkout
        const convText = updatedMessages.map((m) => m.content).join(" ");
        const emailMatch = convText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
        const nombreMatch = convText.match(/(?:me llamo|soy|nombre(?:\s+completo)?(?:\s+es)?)\s+([A-ZÁÉÍÓÚ][a-záéíóú]+(?:\s+[A-ZÁÉÍÓÚ][a-záéíóú]+){1,3})/i);

        setPendingMessages(updatedMessages);
        setPendingEmail(emailMatch ? emailMatch[0] : null);
        setPendingNombre(nombreMatch ? nombreMatch[1] : null);

        // Si Stripe no está configurado, generar directo
        if (!import.meta.env.VITE_STRIPE_ENABLED || import.meta.env.VITE_STRIPE_ENABLED === "false") {
          setTimeout(() => generateCV(updatedMessages), 800);
        } else {
          setTimeout(() => setShowPayment(true), 800);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Lo siento, hubo un problema de conexión. ¿Puedes intentar de nuevo?" },
      ]);
    } finally {
      setIsTyping(false);
    }
  }, [input, messages, isTyping, isGenerating, showPayment, generateCV]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleReset = () => {
    setMessages([WELCOME_MESSAGE]);
    setInput("");
    setCvResult(null);
    setShowPayment(false);
    setPendingMessages(null);
    inputRef.current?.focus();
  };

  const isBlocked = isTyping || isGenerating || showPayment || !!cvResult;

  return (
    <div className="flex flex-col h-screen bg-black">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-zinc-800 bg-zinc-950 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <div>
            <h1 className="text-white font-semibold text-base leading-none">ApplyAI</h1>
            <p className="text-zinc-500 text-xs mt-0.5">Generador de CVs profesionales</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-zinc-400 text-xs hidden sm:block">En línea</span>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          {messages.map((msg, i) => <Message key={i} msg={msg} />)}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input */}
      <footer className="flex-shrink-0 border-t border-zinc-800 bg-zinc-950 p-3 sm:p-4">
        <div className="max-w-2xl mx-auto flex items-end gap-2 sm:gap-3">
          <div className="flex-1 bg-zinc-800 rounded-2xl border border-zinc-700 focus-within:border-emerald-600 transition-colors">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu respuesta..."
              disabled={isBlocked}
              rows={1}
              className="w-full bg-transparent text-zinc-100 placeholder-zinc-500 text-sm px-4 py-3 resize-none outline-none leading-relaxed max-h-32"
              style={{ minHeight: "44px" }}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 128) + "px";
              }}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isBlocked}
            className="w-11 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 disabled:cursor-not-allowed flex items-center justify-center transition-colors flex-shrink-0"
          >
            {isTyping
              ? <Spinner className="w-5 h-5 text-zinc-400" />
              : <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
            }
          </button>
        </div>
        <p className="text-center text-zinc-600 text-xs mt-2">
          Enter para enviar · Shift+Enter para nueva línea
        </p>
      </footer>

      {/* Modals */}
      {showPayment && (
        <PaymentModal
          nombre={pendingNombre}
          onPay={handlePay}
          onClose={() => setShowPayment(false)}
          isLoading={isCheckingOut}
        />
      )}
      {isGenerating && <GeneratingModal />}
      {cvResult && (
        <SuccessModal
          fileName={cvResult.fileName}
          fileBase64={cvResult.fileBase64}
          emailSent={cvResult.emailSent}
          nombre={cvResult.nombre}
          onClose={handleReset}
        />
      )}
    </div>
  );
}
