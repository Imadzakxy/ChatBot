import { createContext, useContext, useState, useEffect } from 'react';

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [chatHistory, setChatHistory] = useState([]);

  // Load chat history from localStorage on initial render
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem("historique");
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        // Validate and clean the data
        const validHistory = parsedHistory.filter(chat => 
          chat && 
          typeof chat.id === 'number' && 
          Array.isArray(chat.messages) &&
          typeof chat.date === 'string'
        );
        // Sort by date, most recent first
        validHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
        setChatHistory(validHistory);
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
      setChatHistory([]);
    }
  }, []);

  // Function to update chat history
  const updateChatHistory = (newChat) => {
    try {
      // Validate new chat data
      if (!newChat || !newChat.id || !Array.isArray(newChat.messages) || !newChat.date) {
        console.error("Invalid chat data:", newChat);
        return;
      }

      const currentHistory = JSON.parse(localStorage.getItem("historique")) || [];
      const filtered = currentHistory.filter((c) => c.id !== newChat.id);
      const updated = [...filtered, newChat];
      
      // Sort by date, most recent first
      updated.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      // Save to localStorage
      localStorage.setItem("historique", JSON.stringify(updated));
      setChatHistory(updated);
    } catch (error) {
      console.error("Error updating chat history:", error);
    }
  };

  return (
    <ChatContext.Provider value={{ chatHistory, updateChatHistory }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
} 