
import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Upload, ArrowRight, Image as ImageIcon, X, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { testGeminiAPI, testDeepSeekAPI } from '@/utils/api';
import { Card } from '@/components/ui/card';

interface ImageUploadProps {
  onImageSelected: (imageData: string) => void;
  onProceed: () => void;
}

const ImageUpload = ({ onImageSelected, onProceed }: ImageUploadProps) => {
  const [image, setImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [testingAPIs, setTestingAPIs] = useState(false);
  const [apiResponses, setApiResponses] = useState<{
    gemini: { data: string | null; loading: boolean; error: string | null };
    deepseek: { data: string | null; loading: boolean; error: string | null };
  }>({
    gemini: { data: null, loading: false, error: null },
    deepseek: { data: null, loading: false, error: null }
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setImage(imageData);
      onImageSelected(imageData);
    };
    reader.readAsDataURL(file);
  };

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  }, []);

  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const testAPIs = async () => {
    setTestingAPIs(true);
    
    // Reset responses
    setApiResponses({
      gemini: { data: null, loading: true, error: null },
      deepseek: { data: null, loading: true, error: null }
    });
    
    // Test Gemini API
    testGeminiAPI().then(response => {
      setApiResponses(prev => ({
        ...prev,
        gemini: { 
          data: response.success ? response.data || null : null, 
          loading: false,
          error: response.success ? null : response.error || "Error testing Gemini API"
        }
      }));
    });
    
    // Test DeepSeek API
    testDeepSeekAPI().then(response => {
      setApiResponses(prev => ({
        ...prev,
        deepseek: { 
          data: response.success ? response.data || null : null, 
          loading: false,
          error: response.success ? null : response.error || "Error testing DeepSeek API"
        }
      }));
    });
  };

  return (
    <div className="w-full flex flex-col items-center animate-fade-in">
      {!image ? (
        <div
          className={cn(
            "w-full max-w-md h-64 rounded-xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center cursor-pointer glass-card overflow-hidden",
            isDragging 
              ? "border-primary/70 bg-primary/5" 
              : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
          <div className="flex flex-col items-center gap-4 p-6">
            <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3">
              <Upload className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-lg font-medium">Upload an image</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                Drag and drop or click to select an image for recognition
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-md relative animate-scale-in">
          <div className="aspect-video w-full overflow-hidden rounded-xl relative">
            <img 
              src={image} 
              alt="Uploaded" 
              className="w-full h-full object-cover"
            />
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 rounded-full bg-black/60 text-white p-1 hover:bg-black/80 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          
          <div className="mt-6 flex justify-center">
            <Button 
              onClick={onProceed}
              className="rounded-full font-medium px-8 py-6 bg-black text-white hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
            >
              Proceed for Recognition
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="mt-8 w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Test API Connectivity</h3>
              <Button 
                onClick={testAPIs} 
                variant="outline"
                disabled={testingAPIs && (apiResponses.gemini.loading || apiResponses.deepseek.loading)}
              >
                {testingAPIs && (apiResponses.gemini.loading || apiResponses.deepseek.loading) 
                  ? "Testing..." 
                  : "Test APIs"}
              </Button>
            </div>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Question: What are the prominent species of pigeon in India?
            </p>
            
            <div className="space-y-4">
              <Card className="p-4">
                <h4 className="font-medium mb-2 flex items-center">
                  <span>Gemini API Response</span>
                  {apiResponses.gemini.loading && (
                    <div className="ml-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
                  )}
                </h4>
                {apiResponses.gemini.data ? (
                  <p className="text-sm whitespace-pre-line">{apiResponses.gemini.data}</p>
                ) : apiResponses.gemini.error ? (
                  <div className="text-sm text-red-500 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{apiResponses.gemini.error}</span>
                  </div>
                ) : testingAPIs ? (
                  <p className="text-sm text-gray-500">Waiting for response...</p>
                ) : (
                  <p className="text-sm text-gray-500">Click "Test APIs" to check Gemini connectivity</p>
                )}
              </Card>
              
              <Card className="p-4">
                <h4 className="font-medium mb-2 flex items-center">
                  <span>DeepSeek API Response</span>
                  {apiResponses.deepseek.loading && (
                    <div className="ml-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
                  )}
                </h4>
                {apiResponses.deepseek.data ? (
                  <p className="text-sm whitespace-pre-line">{apiResponses.deepseek.data}</p>
                ) : apiResponses.deepseek.error ? (
                  <div className="text-sm text-red-500 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{apiResponses.deepseek.error}</span>
                  </div>
                ) : testingAPIs ? (
                  <p className="text-sm text-gray-500">Waiting for response...</p>
                ) : (
                  <p className="text-sm text-gray-500">Click "Test APIs" to check DeepSeek connectivity</p>
                )}
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
