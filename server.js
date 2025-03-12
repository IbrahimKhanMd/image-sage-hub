
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Initialize dotenv
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend development servers
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Get API keys from environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

// Extract base64 image data from data URL
const extractBase64 = (dataUrl) => {
  const matches = dataUrl.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
  if (matches && matches.length === 3) {
    return matches[2];
  }
  return null;
};

// Process image with Gemini Vision API (for Model A and Model C)
async function processWithGeminiVision(imageData, modelName) {
  try {
    console.log(`Processing image with ${modelName} (Gemini Vision API)...`);
    const base64Image = extractBase64(imageData);
    
    if (!base64Image) {
      throw new Error('Invalid image data format');
    }
    
    let prompt = "Identify the species of bird in the image?";
    
    // Different prompt for Model C to differentiate responses
    if (modelName === 'Model C') {
      prompt += " Also describe its habitat and key features.";
    }

    // Log API key (first few characters only, for debugging)
    console.log(`Using Gemini API Key (first 10 chars): ${GEMINI_API_KEY.substring(0, 10)}...`);
    
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro-vision:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: base64Image
                }
              }
            ]
          }
        ],
        generation_config: {
          temperature: 0.4,
          max_output_tokens: 2048,
        }
      }
    );

    // Extract the response text
    const result = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from API';
    return { success: true, data: result };
  } catch (error) {
    console.error(`Error processing with ${modelName}:`, error.response?.status, error.response?.data || error.message);
    return { 
      success: false, 
      error: `Failed to process image with ${modelName}: ${error.message}` 
    };
  }
}

// Process image with DeepSeek API (for Model B)
async function processWithDeepSeek(imageData) {
  try {
    console.log('Processing image with Model B (DeepSeek API)...');
    const base64Image = extractBase64(imageData);
    
    if (!base64Image) {
      throw new Error('Invalid image data format');
    }

    // Log API key (first few characters only, for debugging)
    console.log(`Using DeepSeek API Key (first 10 chars): ${DEEPSEEK_API_KEY.substring(0, 10)}...`);

    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: "deepseek-vision",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "Identify the species of bird in the image?" },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        temperature: 0.5,
        max_tokens: 2000
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
        }
      }
    );

    const result = response.data?.choices?.[0]?.message?.content || 'No response from API';
    return { success: true, data: result };
  } catch (error) {
    console.error('Error processing with Model B:', error.response?.status, error.response?.data || error.message);
    return { 
      success: false, 
      error: `Failed to process image with Model B: ${error.message}` 
    };
  }
}

// Test Gemini API with text prompt
async function testGeminiTextAPI() {
  try {
    console.log('Testing Gemini API with text prompt...');
    
    // Log API key (first few characters only, for debugging)
    console.log(`Using Gemini API Key (first 10 chars): ${GEMINI_API_KEY.substring(0, 10)}...`);

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              { text: "What are the prominent species of pigeon in India?" }
            ]
          }
        ],
        generation_config: {
          temperature: 0.4,
          max_output_tokens: 2048,
        }
      }
    );

    // Extract the response text
    const result = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from API';
    return { success: true, data: result };
  } catch (error) {
    console.error('Error testing Gemini API:', error.response?.status, error.response?.data || error.message);
    return {
      success: false,
      error: `Failed to test Gemini API: ${error.message}`
    };
  }
}

// Test DeepSeek API with text prompt
async function testDeepSeekTextAPI() {
  try {
    console.log('Testing DeepSeek API with text prompt...');
    
    // Log API key (first few characters only, for debugging)
    console.log(`Using DeepSeek API Key (first 10 chars): ${DEEPSEEK_API_KEY.substring(0, 10)}...`);

    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: "deepseek-chat", // Use text-only model for this test
        messages: [
          {
            role: "user",
            content: "What are the prominent species of pigeon in India?"
          }
        ],
        temperature: 0.5,
        max_tokens: 2000
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
        }
      }
    );

    const result = response.data?.choices?.[0]?.message?.content || 'No response from API';
    return { success: true, data: result };
  } catch (error) {
    console.error('Error testing DeepSeek API:', error.response?.status, error.response?.data || error.message);
    return {
      success: false,
      error: `Failed to test DeepSeek API: ${error.message}`
    };
  }
}

// API endpoints
app.post('/api/llm', async (req, res) => {
  try {
    const { imageData, model } = req.body;
    
    if (!imageData) {
      return res.status(400).json({ success: false, error: 'No image data provided' });
    }

    let result;
    
    switch (model) {
      case 'Model A':
        result = await processWithGeminiVision(imageData, 'Model A');
        break;
      case 'Model B':
        result = await processWithDeepSeek(imageData);
        break;
      case 'Model C':
        result = await processWithGeminiVision(imageData, 'Model C');
        break;
      default:
        return res.status(400).json({ success: false, error: 'Invalid model specified' });
    }
    
    return res.json(result);
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// API endpoints for testing text-based API requests
app.get('/api/test-gemini', async (req, res) => {
  try {
    const result = await testGeminiTextAPI();
    return res.json(result);
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/test-deepseek', async (req, res) => {
  try {
    const result = await testDeepSeekTextAPI();
    return res.json(result);
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Debug endpoint to check if server is running
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running', 
    apiKeys: {
      gemini: GEMINI_API_KEY ? `${GEMINI_API_KEY.substring(0, 5)}...` : 'Not set',
      deepseek: DEEPSEEK_API_KEY ? `${DEEPSEEK_API_KEY.substring(0, 5)}...` : 'Not set'
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Keys status:`);
  console.log(`- Gemini API Key: ${GEMINI_API_KEY ? 'Set' : 'Not set'}`);
  console.log(`- DeepSeek API Key: ${DEEPSEEK_API_KEY ? 'Set' : 'Not set'}`);
});
