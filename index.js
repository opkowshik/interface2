const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Ensure history directory exists
const historyDir = path.join(__dirname, 'history');
if (!fs.existsSync(historyDir)) {
    fs.mkdirSync(historyDir);
}

const historyFile = path.join(historyDir, 'chat_history.json');

// Helper to wait to simulate AI thinking
const delay = (ms) => new Promise(res => setTimeout(res, ms));

// Mock AI Logic
const generateMockAnswer = (question) => {
    const lowerQ = question.toLowerCase();
    if (lowerQ.includes('hello') || lowerQ.includes('hi')) return "Hello! I am Synapse Stack AI. How can I help you today?";
    if (lowerQ.includes('who are you')) return "I am Synapse Stack AI, a mock assistant created for this interface demonstration.";
    if (lowerQ.includes('react')) return "React is a JavaScript library for building user interfaces, often used for single-page applications.";
    
    return `This is a mock response to your question: "${question}". I am currently running without a real AI backend.`;
};

// API Endpoint
app.post('/api/ask', async (req, res) => {
    try {
        const { question } = req.body;
        
        if (!question) {
            return res.status(400).json({ error: 'Question is required' });
        }

        // Simulate processing time
        await delay(1000);

        const answer = generateMockAnswer(question);
        
        // Save to history
        const timestamp = new Date().toISOString();
        const chatEntry = { timestamp, question, answer };
        
        let history = [];
        if (fs.existsSync(historyFile)) {
            const rawData = fs.readFileSync(historyFile, 'utf8');
            if (rawData) {
                history = JSON.parse(rawData);
            }
        }
        
        history.push(chatEntry);
        fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));

        res.json({ answer, timestamp });
        
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Synapse Stack AI Server is running on http://localhost:${PORT}`);
});
