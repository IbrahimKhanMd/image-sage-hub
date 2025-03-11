
import { motion } from 'framer-motion';

const About = () => {
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

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <div className="inline-block mb-3 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium text-gray-800 dark:text-gray-200">
            About
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            About This Project
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Exploring the capabilities of AI image recognition
          </p>
        </motion.div>
        
        <motion.div
          className="glass-card rounded-xl p-8 mb-10"
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
        >
          <motion.h2 
            className="text-2xl font-bold mb-4"
            variants={fadeIn}
          >
            Our Mission
          </motion.h2>
          
          <motion.p 
            className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed"
            variants={fadeIn}
          >
            This project aims to showcase and compare the capabilities of different open-source large language models in image recognition tasks. By providing a simple interface for users to upload images and view analysis results side by side, we hope to make AI image recognition more accessible and transparent.
          </motion.p>
          
          <motion.h2 
            className="text-2xl font-bold mb-4 mt-8"
            variants={fadeIn}
          >
            Why Multiple Models?
          </motion.h2>
          
          <motion.p 
            className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed"
            variants={fadeIn}
          >
            Different AI models have different strengths and biases. By comparing results across multiple models, users can get a more comprehensive and balanced understanding of the image content. This approach also highlights the current capabilities and limitations of AI in visual recognition tasks.
          </motion.p>
          
          <motion.h2 
            className="text-2xl font-bold mb-4 mt-8"
            variants={fadeIn}
          >
            Open Source Focus
          </motion.h2>
          
          <motion.p 
            className="text-gray-600 dark:text-gray-400 leading-relaxed"
            variants={fadeIn}
          >
            We prioritize open-source models to promote transparency, accessibility, and community participation in AI development. Our platform serves as a demonstration of the impressive capabilities now available through open-source AI technology, making advanced image recognition accessible to everyone.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
