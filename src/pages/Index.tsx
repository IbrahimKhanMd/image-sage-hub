
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import ImageUpload from '@/components/ImageUpload';
import ModelCard from '@/components/ModelCard';
import { 
  processImageWithModelA, 
  processImageWithModelB, 
  processImageWithModelC,
  type ModelResponse 
} from '@/utils/api';

const Index = () => {
  const [imageData, setImageData] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [modelResponses, setModelResponses] = useState<{
    modelA: { data: string | null; loading: boolean };
    modelB: { data: string | null; loading: boolean };
    modelC: { data: string | null; loading: boolean };
  }>({
    modelA: { data: null, loading: false },
    modelB: { data: null, loading: false },
    modelC: { data: null, loading: false },
  });
  
  const { toast } = useToast();
  
  const handleImageSelected = (data: string) => {
    setImageData(data);
    setShowResults(false);
    
    // Reset model responses when a new image is selected
    setModelResponses({
      modelA: { data: null, loading: false },
      modelB: { data: null, loading: false },
      modelC: { data: null, loading: false },
    });
  };
  
  const handleProceed = () => {
    if (!imageData) {
      toast({
        title: "No image selected",
        description: "Please upload an image first",
        variant: "destructive",
      });
      return;
    }
    
    setShowResults(true);
    
    // Set all models to loading state
    setModelResponses({
      modelA: { data: null, loading: true },
      modelB: { data: null, loading: true },
      modelC: { data: null, loading: true },
    });
    
    // Process image with all models
    processImageWithAllModels(imageData);
  };
  
  const processImageWithAllModels = async (image: string) => {
    try {
      // Process with Model A
      processImageWithModelA(image).then((response: ModelResponse) => {
        setModelResponses(prev => ({
          ...prev,
          modelA: { 
            data: response.success ? response.data || null : response.error || "Error processing image", 
            loading: false 
          }
        }));
      });
      
      // Process with Model B
      processImageWithModelB(image).then((response: ModelResponse) => {
        setModelResponses(prev => ({
          ...prev,
          modelB: { 
            data: response.success ? response.data || null : response.error || "Error processing image", 
            loading: false 
          }
        }));
      });
      
      // Process with Model C
      processImageWithModelC(image).then((response: ModelResponse) => {
        setModelResponses(prev => ({
          ...prev,
          modelC: { 
            data: response.success ? response.data || null : response.error || "Error processing image", 
            loading: false 
          }
        }));
      });
      
    } catch (error) {
      console.error("Error processing image:", error);
      toast({
        title: "Processing Error",
        description: "An error occurred while processing the image",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full min-h-screen pt-24 pb-16 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-slide-down">
          <div className="inline-block mb-3 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium text-gray-800 dark:text-gray-200">
            Image Recognition
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Multi-Model Image Analysis
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Upload an image and analyze it with Gemini Pro Vision AI
          </p>
        </div>
        
        <div className="mb-16">
          <ImageUpload 
            onImageSelected={handleImageSelected} 
            onProceed={handleProceed} 
          />
        </div>
        
        {showResults && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 text-center">Analysis Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ModelCard
                title="Model A"
                description="General bird species identification"
                image={imageData}
                modelResponse={modelResponses.modelA.data}
                isLoading={modelResponses.modelA.loading}
              />
              
              <ModelCard
                title="Model B"
                description="Detailed bird analysis with habitat information"
                image={imageData}
                modelResponse={modelResponses.modelB.data}
                isLoading={modelResponses.modelB.loading}
              />
              
              <ModelCard
                title="Model C"
                description="Classification and feature recognition"
                image={imageData}
                modelResponse={modelResponses.modelC.data}
                isLoading={modelResponses.modelC.loading}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
