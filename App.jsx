import { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMsg = { role: 'user', content: inputVal };
    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: userMsg.content }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const aiMsg = { role: 'ai', content: data.answer };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error('Failed to fetch from backend:', error);
      const errorMsg = { role: 'ai', content: 'Sorry, I encounted an error connecting to the backend. Please make sure the server is running on port 3001.' };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Synapse Stack AI</h1>
        <p>Premium Intelligence Engine</p>
      </header>

      <main className="chat-container glass-panel">
        <div className="chat-history">
          {messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">⚡</div>
              <h3>Welcome to Synapse Stack</h3>
              <p style={{ marginTop: '0.5rem' }}>
                Ask a question to begin. History is automatically archived to your local directory.
              </p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`message-wrapper ${msg.role}`}>
                <div className={`message ${msg.role}`}>
                  <div className="message-avatar">
                    {msg.role === 'ai' ? 'AI' : 'US'}
                  </div>
                  <div className="message-content">{msg.content}</div>
                </div>
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="message-wrapper ai">
              <div className="message ai">
                <div className="message-avatar">AI</div>
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="input-area" onSubmit={handleSend}>
          <input
            type="text"
            className="input-field"
            placeholder="Type your transmission..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={isLoading}
          />
          <button type="submit" className="send-button" disabled={isLoading || !inputVal.trim()}>
            <span>Send</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </main>

      {messages.length > 0 && (
        <div className="history-notification">
          🔒 Conversation dynamically mapped to server/history
        </div>
      )}
    </div>
  );
}

export default App;
