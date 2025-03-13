
# Multi-Model Image Analysis with Gemini Pro Vision

This application demonstrates the capabilities of the Gemini Pro Vision AI model to analyze images of birds and identify their species.

## Project Structure

```
├── src/
│   ├── components/       # UI components
│   │   ├── ImageUpload.tsx   # Image upload component
│   │   ├── ModelCard.tsx     # Card to display model results
│   │   └── LoadingEffect.tsx # Loading animation
│   ├── pages/            # Application pages
│   │   └── Index.tsx     # Main page
│   ├── utils/            # Utility functions
│   │   └── api.ts        # API integration with Gemini
│   └── ...               # Other project files
```

## Features

- Upload images of birds
- Process images with three different prompting strategies using Gemini Pro Vision
- Display analysis results in a clean, responsive interface
- Error handling and loading states

## How It Works

1. User uploads an image of a bird
2. The application sends the image to Gemini Pro Vision with three different prompts
3. Each model provides a unique analysis of the bird species
4. Results are displayed in separate cards for easy comparison

## API Integration

The application uses the Gemini Pro Vision API for image analysis. Three different prompting strategies are used to generate varied responses:

- **Model A**: Basic species identification
- **Model B**: Detailed analysis with habitat information
- **Model C**: Classification and feature recognition

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open your browser and navigate to http://localhost:5173
