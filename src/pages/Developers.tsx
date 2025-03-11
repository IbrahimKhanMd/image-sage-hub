
import { motion } from 'framer-motion';

const Developers = () => {
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

  const developers = [
    {
      name: "Alex Chen",
      role: "AI Engineer",
      description: "Specializes in computer vision and open-source LLM implementation",
      image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300&q=80"
    },
    {
      name: "Maya Johnson",
      role: "Frontend Developer",
      description: "Expert in creating intuitive user interfaces and smooth animations",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300&q=80"
    },
    {
      name: "Daniel Park",
      role: "Backend Engineer",
      description: "Passionate about scalable architectures and API integrations",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300&q=80"
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <div className="inline-block mb-3 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium text-gray-800 dark:text-gray-200">
            Team
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Meet the Developers
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            The talented individuals behind this image recognition project
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
        >
          {developers.map((developer, index) => (
            <motion.div 
              key={index} 
              className="glass-card rounded-xl overflow-hidden"
              variants={fadeIn}
            >
              <div className="aspect-square w-full overflow-hidden">
                <img 
                  src={developer.image} 
                  alt={developer.name} 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">{developer.name}</h3>
                <p className="text-sm text-primary mb-3">{developer.role}</p>
                <p className="text-gray-600 dark:text-gray-400">{developer.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="glass-card rounded-xl p-8 mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Want to Contribute?</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            We welcome contributions from developers, AI researchers, and designers. Join our open-source community and help improve image recognition technology.
          </p>
          <div className="flex justify-center">
            <button className="glass-button px-6 py-3 rounded-md font-medium">
              Join Our Team
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Developers;
