
import { cn } from '@/lib/utils';

interface LoadingEffectProps {
  className?: string;
}

const LoadingEffect = ({ className }: LoadingEffectProps) => {
  return (
    <div className={cn("flex items-center justify-center w-full h-full py-8", className)}>
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-t-2 border-b-2 border-gray-900 dark:border-gray-100 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-10 w-10 rounded-full border-t-2 border-b-2 border-gray-400 animate-spin [animation-direction:reverse]"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse-slow"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingEffect;
