
import { motion } from 'framer-motion';

const Working = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const steps = [
    {
      title: "Image Upload",
      description: "Users can upload an image through drag-and-drop or file selection. The application accepts common image formats like JPEG, PNG, and GIF.",
      icon: "📤"
    },
    {
      title: "Pre-processing",
      description: "Before sending to the models, images are processed to ensure they meet the required format and dimensions for optimal recognition.",
      icon: "⚙️"
    },
    {
      title: "Model Processing",
      description: "The image is simultaneously sent to three different open-source LLM models specialized in image recognition and analysis.",
      icon: "🧠"
    },
    {
      title: "Result Display",
      description: "Each model's interpretation is displayed side-by-side for easy comparison, highlighting different approaches to image understanding.",
      icon: "🖥️"
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <div className="inline-block mb-3 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium text-gray-800 dark:text-gray-200">
            Process
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            How It Works
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Understanding the technology behind our multi-model image recognition
          </p>
        </motion.div>
        
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
          className="mb-16"
        >
          <motion.div 
            className="glass-card rounded-xl p-8 mb-10"
            variants={fadeIn}
          >
            <h2 className="text-2xl font-bold mb-6">The Process</h2>
            
            <div className="space-y-12">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 text-xl">
                      {step.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      {index + 1}. {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
        >
          <motion.div 
            className="glass-card rounded-xl p-8"
            variants={fadeIn}
          >
            <h2 className="text-2xl font-bold mb-4">Models Used</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Our platform currently implements these open-source models:
            </p>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-black dark:text-white">•</span>
                <span><strong>Model A:</strong> Specialized in detailed scene description and context understanding</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black dark:text-white">•</span>
                <span><strong>Model B:</strong> Focused on object detection and classification with confidence scoring</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black dark:text-white">•</span>
                <span><strong>Model C:</strong> Enhanced for scene context and relationship recognition between objects</span>
              </li>
            </ul>
          </motion.div>
          
          <motion.div 
            className="glass-card rounded-xl p-8"
            variants={fadeIn}
          >
            <h2 className="text-2xl font-bold mb-4">Technical Details</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Key technical aspects of our implementation:
            </p>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-black dark:text-white">•</span>
                <span>Images are processed client-side for privacy protection</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black dark:text-white">•</span>
                <span>API calls to models use secure authentication</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black dark:text-white">•</span>
                <span>Responses are cached to improve performance for similar images</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black dark:text-white">•</span>
                <span>Built using React and modern web technologies</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Working;
