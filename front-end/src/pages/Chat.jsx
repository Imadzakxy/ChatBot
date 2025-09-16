import React, { useEffect, useRef, useState } from "react";
import FileUploader from "../components/FileUploader";
import { useLocation } from "react-router-dom";
import { useChat } from "../components/ChatContext";

// Error Boundary to prevent crashes
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return <h1 className="text-white text-center mt-10">Something went wrong. Please refresh the page.</h1>;
    }
    return this.props.children;
  }
}

function Chat() {
  const textareaRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const [chatToolsDisplay, setChatToolsDisplay] = useState(false);
  const [sessionId] = useState(Date.now()); // Single session ID for the app
  const location = useLocation();
  const { updateChatHistory } = useChat();

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Parse text with bold formatting
  const parseBoldText = (text) => {
    const boldParts = text.split(/(\*\*.*?\*\*)/g);
    return boldParts.map((boldPart, boldIndex) => {
      if (boldPart.startsWith('**') && boldPart.endsWith('**')) {
        const boldText = boldPart.slice(2, -2);
        return <span key={boldIndex} className="font-bold">{boldText}</span>;
      } else {
        const lineParts = boldPart.split('\n');
        return lineParts.map((linePart, lineIndex) => (
          <React.Fragment key={`${boldIndex}-${lineIndex}`}>
            {lineIndex > 0 && <br />}
            <span className="font-normal">{linePart}</span>
          </React.Fragment>
        ));
      }
    });
  };

  // Function to clear chat
  const clearChat = () => {
    setMessages([]);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.value = "";
      textareaRef.current.style.height = "auto";
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    try {
      const userMessage = { text: input, sender: "user" };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.value = "";
        textareaRef.current.style.height = "auto";
      }

      const response = await fetch("http://localhost:5005/webhooks/rest/webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: sessionId.toString(),
          message: input,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data || data.length === 0) {
        throw new Error("No response from Rasa");
      }

      const botResponseText = data.map(item => item.text).join('\n');
      const botMessage = { text: botResponseText, sender: "Bot" };
      const finalMessages = [...newMessages, botMessage];
      setMessages(finalMessages);

      // Save chat to history
      updateChatHistory({
        id: sessionId,
        messages: finalMessages,
        date: new Date().toISOString()
      });

    } catch (error) {
      console.error("Error communicating with Rasa:", error);
      try {
        const healthCheck = await fetch("http://localhost:5005/status");
        if (!healthCheck.ok) {
          throw new Error("Rasa server is not running");
        }
      } catch {
        setMessages(prev => [
          ...prev,
          {
            text: "I'm having trouble connecting to my brain right now. Please make sure the Rasa server is running (rasa run --enable-api --cors \"*\") and try again.",
            sender: "Bot"
          }
        ]);
        return;
      }
      setMessages(prev => [
        ...prev,
        {
          text: "I'm having trouble processing your message. Please try again.",
          sender: "Bot"
        }
      ]);
    }
  };

  const defaultMessageFile = () => {
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: "Our Model does not have this feature yet.",
          sender: "Bot",
        },
      ]);
    }, 600);
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 170) + "px";
  };

  const micRef = useRef(null);

  const lancerMicro = () => {
    const ReconnaissanceVocale =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!ReconnaissanceVocale) {
      alert("Ton navigateur ne supporte pas le micro");
      return;
    }

    const envoyerMessage = async (textePerso = null) => {
      const message = textePerso || input;
      if (!message.trim()) return;

      const nouveauMessage = [...messages, { text: message, sender: "user" }];
      setMessages(nouveauMessage);
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.value = "";
        textareaRef.current.style.height = "auto";
      }

      try {
        const reponse = await fetch(
          "http://localhost:5005/webhooks/rest/webhook",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sender: sessionId.toString(),
              message: message,
            }),
          }
        );

        const data = await reponse.json();
        const messagesBot = data.map((item) => ({
          text: item.text,
          sender: "Bot",
        }));

        setMessages((ancien) => [...ancien, ...messagesBot]);

        data.forEach((item) => {
          if (item.text) parler(item.text);
        });
      } catch (erreur) {
        console.error("Erreur avec Rasa :", erreur);
        setMessages((ancien) => [
          ...ancien,
          { text: "Désolé, une erreur est survenue.", sender: "Bot" },
        ]);
      }
    };

    micRef.current = new ReconnaissanceVocale();
    micRef.current.lang = "fr-FR";
    micRef.current.interimResults = false;

    micRef.current.onresult = (event) => {
      const texteEntendu = event.results[0][0].transcript;
      setInput(texteEntendu);
      envoyerMessage(texteEntendu);
    };

    micRef.current.start();
  };

  const parler = (texte) => {
    const phrase = new SpeechSynthesisUtterance(texte);
    phrase.lang = "fr-FR";
    speechSynthesis.speak(phrase);
  };

  return (
    <ErrorBoundary>
      <section className="relative w-full flex flex-col">
        <div className="h-[70vh] overflow-y-scroll custom-scrollbar">
          <div className="flex flex-col p-5">
            {messages.map((msg, index) => (
              <div key={index} className="flex flex-row mb-7">
                {msg.sender === "Bot" ? (
                  <div className="mr-3 p-1.5 rounded-full">
                    <img
                      src="/startupgenie.png"
                      alt="Image non disponible"
                      className="w-10 h-10 rounded-full flex-1"
                    />
                  </div>
                ) : (
                  ""
                )}
                <div
                  className={`p-2 sm:max-w-[80%] max-w-[100%] my-2 rounded-b-lg shadow-md ${
                    msg.sender === "user"
                      ? "bg-[var(--color-3)] text-[var(--color-1)] font-bold self-end ml-auto"
                      : "bg-transparent backdrop-blur-lg text-white font-secondary self-start flex-[2]"
                  }`}
                >
                  {msg.sender === "Bot" ? parseBoldText(msg.text) : msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Chat Input Area */}
        <div className="fixed bottom-2 flex flex-row items-center justify-center w-full md:px-0">
          <div className="w-[95%] flex flex-col md:w-[60%] bg-[var(--color-3)] rounded-4xl p-2 backdrop-blur-sm shadow-[0_0_15px_10px_rgba(0,0,0,0.6)]">
            <textarea
              placeholder="Poser une question ..."
              ref={textareaRef}
              className="mb-2 w-full border-none px-4 py-2 flex-grow resize-none outline-none bg-transparent h-auto min-h-[40px] custom-scrollbar"
              rows="1"
              onChange={handleInput}
              value={input}
            />
            <div className="flex flex-row relative">
              <div className="flex flex-row flex-[4]">
                {!chatToolsDisplay ? (
                  <button
                    className="cursor-pointer mr-3 bg-[var(--color-1)] text-2xl font-bold text-white w-12 h-12 rounded-full flex items-center text-center justify-center flex-shrink-0"
                    onClick={() => setChatToolsDisplay(!chatToolsDisplay)}
                  >
                    <i className="bx bx-plus"></i>
                  </button>
                ) : (
                  <div className="mr-3 w-auto p-2 rounded-full bg-[var(--color-1)] h-12 flex flex-row items-center gap-2">
                    <button
                      className="cursor-pointer w-10 h-10 flex justify-center items-center rounded-full border border-white bg-[var(--color-3)]"
                      onClick={() => setChatToolsDisplay(!chatToolsDisplay)}
                    >
                      <i className="bx bx-x text-[var(--color-1)] text-xl"></i>
                    </button>
                    <FileUploader />
                    <button
                      className="cursor-pointer w-10 h-10 flex justify-center items-center rounded-full border border-white bg-[var(--color-3)]"
                      onClick={lancerMicro}
                    >
                      <i className="bx bx-microphone text-[var(--color-1)] text-xl"></i>
                    </button>
                  </div>
                )}
                {chatToolsDisplay && (
                  <>
                    <button
                      className="cursor-pointer mr-3 font-bold border border-[var(--color-1)] bg-[var(--color-3)] text-[var(--color-1)] w-12 md:w-30 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      onClick={defaultMessageFile}
                    >
                      <i className="bx bx-globe"></i>{" "}
                      <span className="hidden md:flex">Search</span>
                    </button>
                    <button
                      className="cursor-pointer mr-3 font-bold border border-[var(--color-1)] bg-[var(--color-3)] text-[var(--color-1)] w-12 md:w-30 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      onClick={defaultMessageFile}
                    >
                      <i className="bx bx-sun"></i>{" "}
                      <span className="hidden md:flex">Think</span>
                    </button>
                  </>
                )}
              </div>
              <button
                className="cursor-pointer text-2xl border border-[var(--color-1)] bg-[var(--color-3)] font-extrabold text-[var(--color-1)] w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                onClick={sendMessage}
              >
                <i className="bx bx-up-arrow-alt"></i>
              </button>
            </div>
          </div>
        </div>
      </section>
    </ErrorBoundary>
  );
}

export default Chat;