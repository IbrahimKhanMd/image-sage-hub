
// API utility for making calls to our server which handles the actual API requests

export interface ModelResponse {
  success: boolean;
  data?: string;
  error?: string;
}

// Get the correct backend URL
const getBackendUrl = () => {
  // Ensure we're using the correct backend URL
  const port = 5000;
  return `http://localhost:${port}`;
};

// Base function to process image with any model
const processImageWithModel = async (modelName: string, imageData: string): Promise<ModelResponse> => {
  try {
    console.log(`Processing image with ${modelName}...`);
    
    // Ensure we're using the correct backend URL
    const backendUrl = `${getBackendUrl()}/api/llm`;
    
    console.log(`Sending request to: ${backendUrl}`);
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageData, model: modelName }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error response (${response.status}):`, errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log(`${modelName} result:`, result);
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

// Functions for testing text-based API requests
export const testGeminiAPI = async (): Promise<ModelResponse> => {
  try {
    console.log('Testing Gemini API with text prompt...');
    
    const backendUrl = `${getBackendUrl()}/api/test-gemini`;
    console.log(`Sending request to: ${backendUrl}`);
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error response (${response.status}):`, errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Gemini API test result:', result);
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
    
    const backendUrl = `${getBackendUrl()}/api/test-deepseek`;
    console.log(`Sending request to: ${backendUrl}`);
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error response (${response.status}):`, errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('DeepSeek API test result:', result);
    return result;
  } catch (error) {
    console.error('Error testing DeepSeek API:', error);
    return {
      success: false,
      error: `Failed to test DeepSeek API: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

// Health check function
export const checkServerHealth = async (): Promise<{status: string, message: string, apiKeys?: any}> => {
  try {
    const backendUrl = `${getBackendUrl()}/api/health`;
    const response = await fetch(backendUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Server health check failed:', error);
    throw error;
  }
};
