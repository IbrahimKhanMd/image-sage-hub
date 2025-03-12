
// API utility for making calls to our server which handles the actual API requests

export interface ModelResponse {
  success: boolean;
  data?: string;
  error?: string;
}

// Base function to process image with any model
const processImageWithModel = async (modelName: string, imageData: string): Promise<ModelResponse> => {
  try {
    console.log(`Processing image with ${modelName}...`);
    
    // Ensure we're using the correct backend URL
    const backendUrl = 'http://localhost:5000/api/llm';
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageData, model: modelName }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`Error processing with ${modelName}:`, error);
    return {
      success: false,
      error: `Failed to process image with ${modelName}: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

export const processImageWithModelA = async (imageData: string): Promise<ModelResponse> => {
  return processImageWithModel('Model A', imageData);
};

export const processImageWithModelB = async (imageData: string): Promise<ModelResponse> => {
  return processImageWithModel('Model B', imageData);
};

export const processImageWithModelC = async (imageData: string): Promise<ModelResponse> => {
  return processImageWithModel('Model C', imageData);
};

// New functions for testing text-based API requests
export const testGeminiAPI = async (): Promise<ModelResponse> => {
  try {
    console.log('Testing Gemini API with text prompt...');
    
    const backendUrl = 'http://localhost:5000/api/test-gemini';
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error testing Gemini API:', error);
    return {
      success: false,
      error: `Failed to test Gemini API: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

export const testDeepSeekAPI = async (): Promise<ModelResponse> => {
  try {
    console.log('Testing DeepSeek API with text prompt...');
    
    const backendUrl = 'http://localhost:5000/api/test-deepseek';
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error testing DeepSeek API:', error);
    return {
      success: false,
      error: `Failed to test DeepSeek API: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};
