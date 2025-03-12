
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

// Enable CORS and increase payload limit for image data
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'], // Add your frontend URLs
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Get API keys from environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyCdrR-fEBCYuKWzAAFMVtgQRXpH4URqCoU';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || 'sk-68477dfc53194a30a3d26aeb7dc30b53';

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

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${GEMINI_API_KEY}`,
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
    console.error(`Error processing with ${modelName}:`, error.message);
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

    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: "deepseek-vision-v1",
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
    console.error('Error processing with Model B:', error.message);
    return { 
      success: false, 
      error: `Failed to process image with Model B: ${error.message}` 
    };
  }
}

// API endpoint for image processing
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

// Debug endpoint to check if server is running
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
