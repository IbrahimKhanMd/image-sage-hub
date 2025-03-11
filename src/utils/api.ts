
// API calls to LLM models for image recognition

export interface ModelResponse {
  success: boolean;
  data?: string;
  error?: string;
}

// Endpoint for our Express server - use a relative URL in this environment
const API_ENDPOINT = '/api/llm';

// Common function to process image with the LLM API
const processImageWithAPI = async (
  modelName: string,
  imageData: string
): Promise<ModelResponse> => {
  try {
    console.log(`Processing image with ${modelName}...`);
    
    // Send both the image data and the default prompt
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: "Identify the species of bird in the image?",
        imageData: imageData,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract the correct model response based on the model name
    const modelResponse = data[modelNameToKey(modelName)];
    
    if (!modelResponse) {
      throw new Error(`No response from ${modelName}`);
    }

    return {
      success: true,
      data: modelResponse,
    };
  } catch (error) {
    console.error(`Error processing with ${modelName}:`, error);
    return {
      success: false,
      error: `Failed to process image with ${modelName}: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
};

// Helper function to map model names to response keys
const modelNameToKey = (modelName: string): string => {
  switch (modelName) {
    case 'Model A':
      return 'modelA';
    case 'Model B':
      return 'modelB';
    case 'Model C':
      return 'modelC';
    default:
      return 'modelA';
  }
};

export const processImageWithModelA = async (imageData: string): Promise<ModelResponse> => {
  return processImageWithAPI('Model A', imageData);
};

export const processImageWithModelB = async (imageData: string): Promise<ModelResponse> => {
  return processImageWithAPI('Model B', imageData);
};

export const processImageWithModelC = async (imageData: string): Promise<ModelResponse> => {
  return processImageWithAPI('Model C', imageData);
};
