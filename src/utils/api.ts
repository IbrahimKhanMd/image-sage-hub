
// API utilities for image processing with Gemini API

export interface ModelResponse {
  success: boolean;
  data?: string;
  error?: string;
}

const GEMINI_API_KEY = 'AIzaSyCdrR-fEBCYuKWzAAFMVtgQRXpH4URqCoU';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

// Common Gemini API call function with different prompt styles for each model
async function callGeminiAPI(imageData: string, modelName: string): Promise<ModelResponse> {
  try {
    console.log(`Processing image with ${modelName}...`);
    
    // Remove the data URL prefix to get just the base64 data
    const base64Image = imageData.split(',')[1];
    
    // Different prompts for different models to get varied responses
    let prompt = "Identify the species of bird in the image?";
    
    if (modelName === 'Model B') {
      prompt = "What bird species is shown in this image? Provide details about its appearance and habitat.";
    } else if (modelName === 'Model C') {
      prompt = "Analyze this bird image and identify the species. Include classification details and any notable features.";
    }
    
    // Gemini API request payload
    const payload = {
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
        top_p: 1,
        top_k: 32,
        max_output_tokens: 2048,
      }
    };

    // Make the API request
    const response = await fetch(
      `${GEMINI_API_URL}/gemini-pro-vision:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error (${modelName}):`, errorText);
      return {
        success: false,
        error: `Failed to process image with ${modelName}: HTTP error ${response.status}`
      };
    }

    const result = await response.json();
    
    // Extract the response text from the Gemini API response
    const responseText = result.candidates?.[0]?.content?.parts?.[0]?.text || 
                         "No response text received from the model.";
    
    return {
      success: true,
      data: responseText
    };
  } catch (error) {
    console.error(`Error processing with ${modelName}:`, error);
    return {
      success: false,
      error: `Failed to process image with ${modelName}: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

export const processImageWithModelA = async (imageData: string): Promise<ModelResponse> => {
  return callGeminiAPI(imageData, 'Model A');
};

export const processImageWithModelB = async (imageData: string): Promise<ModelResponse> => {
  return callGeminiAPI(imageData, 'Model B');
};

export const processImageWithModelC = async (imageData: string): Promise<ModelResponse> => {
  return callGeminiAPI(imageData, 'Model C');
};
