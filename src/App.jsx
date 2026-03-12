import { useState, useRef, useEffect, useCallback } from "react";

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
    <div
      className={`flex items-end gap-2 mb-4 message-enter ${
        isBot ? "" : "flex-row-reverse"
      }`}
    >
      {isBot && (
        <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mb-0.5">
          AI
        </div>
      )}
      <div
        className={`max-w-[78%] sm:max-w-[65%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isBot
            ? "bg-zinc-800 text-zinc-100 rounded-bl-sm"
            : "bg-emerald-600 text-white rounded-br-sm"
        }`}
      >
        {lines.map((line, i) => (
          <span key={i}>
            {line}
            {i < lines.length - 1 && <br />}
          </span>
        ))}
      </div>
    </div>
  );
}

function GeneratingModal({ nombre }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-8 max-w-sm w-full text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-600/20 border-2 border-emerald-600 flex items-center justify-center mx-auto mb-6">
          <svg
            className="spinner w-8 h-8 text-emerald-500"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        </div>
        <h3 className="text-white font-semibold text-lg mb-2">
          Generando tu CV...
        </h3>
        <p className="text-zinc-400 text-sm">
          Estoy creando un CV profesional{nombre ? ` para ${nombre.split(" ")[0]}` : ""}. Esto tarda unos segundos.
        </p>
      </div>
    </div>
  );
}

function SuccessModal({ fileName, fileBase64, emailSent, nombre, onClose }) {
  const handleDownload = () => {
    const byteChars = atob(fileBase64);
    const byteNums = new Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) {
      byteNums[i] = byteChars.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNums);
    const blob = new Blob([byteArray], {
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
          <svg
            className="w-8 h-8 text-emerald-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h3 className="text-white font-semibold text-lg mb-2">
          ¡CV listo{nombre ? `, ${nombre.split(" ")[0]}` : ""}!
        </h3>

        {emailSent && (
          <p className="text-zinc-400 text-sm mb-6">
            Te lo enviamos a tu correo. También puedes descargarlo ahora.
          </p>
        )}
        {!emailSent && (
          <p className="text-zinc-400 text-sm mb-6">
            Tu CV profesional está listo para descargar.
          </p>
        )}

        <button
          onClick={handleDownload}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 px-6 rounded-xl transition-colors mb-3 flex items-center justify-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Descargar CV (.docx)
        </button>

        <button
          onClick={onClose}
          className="w-full text-zinc-400 hover:text-zinc-200 text-sm py-2 transition-colors"
        >
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
  const [readyToGenerate, setReadyToGenerate] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const generateCV = useCallback(async (msgs) => {
    setIsGenerating(true);
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
          content:
            "Hubo un error generando tu CV. Por favor intenta de nuevo o escríbeme para solucionarlo.",
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isTyping || isGenerating) return;

    const userMessage = { role: "user", content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    try {
      const apiMessages = newMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!response.ok) {
        throw new Error("Error de conexión");
      }

      const data = await response.json();
      const botMessage = { role: "assistant", content: data.message };
      const updatedMessages = [...newMessages, botMessage];
      setMessages(updatedMessages);

      if (data.readyToGenerate) {
        setReadyToGenerate(true);
        setTimeout(() => {
          generateCV(updatedMessages);
        }, 1000);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Lo siento, hubo un problema de conexión. ¿Puedes intentar de nuevo?",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }, [input, messages, isTyping, isGenerating, generateCV]);

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
    setReadyToGenerate(false);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-screen bg-black">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-zinc-800 bg-zinc-950 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <div>
            <h1 className="text-white font-semibold text-base leading-none">
              ApplyAI
            </h1>
            <p className="text-zinc-500 text-xs mt-0.5">
              Generador de CVs profesionales
            </p>
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
          {messages.map((msg, i) => (
            <Message key={i} msg={msg} />
          ))}
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
              disabled={isTyping || isGenerating || readyToGenerate}
              rows={1}
              className="w-full bg-transparent text-zinc-100 placeholder-zinc-500 text-sm px-4 py-3 resize-none outline-none leading-relaxed max-h-32"
              style={{ minHeight: "44px" }}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height =
                  Math.min(e.target.scrollHeight, 128) + "px";
              }}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isTyping || isGenerating || readyToGenerate}
            className="w-11 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 disabled:cursor-not-allowed flex items-center justify-center transition-colors flex-shrink-0"
          >
            {isTyping ? (
              <svg
                className="spinner w-5 h-5 text-zinc-400"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            )}
          </button>
        </div>
        <p className="text-center text-zinc-600 text-xs mt-2">
          Enter para enviar · Shift+Enter para nueva línea
        </p>
      </footer>

      {/* Modals */}
      {isGenerating && <GeneratingModal nombre={null} />}
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
