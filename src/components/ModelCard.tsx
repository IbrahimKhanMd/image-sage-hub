
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import LoadingEffect from './LoadingEffect';

interface ModelCardProps {
  title: string;
  description: string;
  image: string | null;
  modelResponse: string | null;
  isLoading: boolean;
}

const ModelCard = ({
  title,
  description,
  image,
  modelResponse,
  isLoading
}: ModelCardProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // A slight delay for a staggered animation effect
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Format response for better readability
  const formatResponse = (response: string) => {
    return response.split('\n').map((line, index) => (
      <p key={index} className={index === 0 ? 'font-medium' : ''}>
        {line}
      </p>
    ));
  };

  // Map model titles to actual API sources
  const getApiSource = () => {
    switch(title) {
      case 'Model A':
        return 'Google Gemini';
      case 'Model B':
        return 'DeepSeek AI';
      case 'Model C':
        return 'Google Gemini (Alternative)';
      default:
        return '';
    }
  };

  return (
    <div 
      className={cn(
        "glass-card rounded-xl overflow-hidden transition-all duration-500 transform",
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-8"
      )}
    >
      <div className="p-5">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-lg font-semibold">{title}</h3>
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
            {getApiSource()}
          </span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{description}</p>
        
        {image && (
          <div className="aspect-video w-full overflow-hidden rounded-lg mb-4">
            <img 
              src={image} 
              alt={`${title} analysis`} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg min-h-[150px] p-4 overflow-auto max-h-[300px]">
          {isLoading ? (
            <LoadingEffect />
          ) : modelResponse ? (
            <div className="animate-fade-in text-sm space-y-2">
              {formatResponse(modelResponse)}
            </div>
          ) : (
            <div className="text-gray-400 dark:text-gray-500 text-sm flex items-center justify-center h-full">
              <p>Response will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModelCard;
