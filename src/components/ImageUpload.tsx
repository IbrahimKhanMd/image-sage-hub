
import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Upload, ArrowRight, Image as ImageIcon, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ImageUploadProps {
  onImageSelected: (imageData: string) => void;
  onProceed: () => void;
}

const ImageUpload = ({ onImageSelected, onProceed }: ImageUploadProps) => {
  const [image, setImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
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
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
