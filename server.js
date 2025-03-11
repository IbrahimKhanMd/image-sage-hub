
require('dotenv').config();  // Load API keys from .env
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json({ limit: '50mb' }));  // Increased limit for image data
app.use(cors());  // Enable cross-origin requests

// Load API Keys from Environment Variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyCdrR-fEBCYuKWzAAFMVtgQRXpH4URqCoU';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || 'sk-68477dfc53194a30a3d26aeb7dc30b53';

// API Route to Handle AI Requests
app.post('/api/llm', async (req, res) => {
    const { input, imageData } = req.body;
    const prompt = "Identify the species of bird in the image?";
    const fullPrompt = imageData ? `${prompt} ${input || ''}` : input;

    try {
        // Call both APIs simultaneously using Promise.all()
        const [geminiRes, deepseekRes] = await Promise.all([
            axios.post(
                `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
                { contents: [{ role: "user", parts: [{ text: fullPrompt }] }] },
                { headers: { "Content-Type": "application/json" } }
            ),
            axios.post(
                'https://api.deepseek.com/v1/completions',
                { model: "deepseek-chat", messages: [{ role: "user", content: fullPrompt }] },
                { headers: { "Authorization": `Bearer ${DEEPSEEK_API_KEY}`, "Content-Type": "application/json" } }
            )
        ]);

        // Extract and format responses
        const geminiResponse = geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini";
        const deepseekResponse = deepseekRes.data.choices?.[0]?.message?.content || "No response from DeepSeek";

        // Mock Claude response (as we only have two API keys)
        const claudeResponse = "Based on the image analysis, this appears to be a bird from the [Species] family. " +
            "The distinctive features include [features]. This species is commonly found in [habitat].";

        res.json({ 
            modelA: geminiResponse, 
            modelB: deepseekResponse,
            modelC: claudeResponse
        });
    } catch (error) {
        console.error("API Error:", error.message);
        res.status(500).json({ 
            error: "Failed to fetch response",
            modelA: "Error fetching from Gemini API: " + error.message,
            modelB: "Error fetching from DeepSeek API: " + error.message,
            modelC: "Error processing request."
        });
    }
});

// Start the Backend Server
app.listen(3001, () => console.log('✅ Backend running on http://localhost:3001'));
