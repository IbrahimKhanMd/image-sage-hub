
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Developers', path: '/developers' },
    { name: 'Working', path: '/working' },
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 md:px-8 py-4",
        scrolled 
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm" 
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-bold text-xl tracking-tight">
            ImageRecognition
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                location.pathname === item.path
                  ? "text-black dark:text-white bg-gray-100/80 dark:bg-gray-800/80"
                  : "text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-gray-800/80"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        
        <div className="md:hidden">
          {/* Mobile navigation can be implemented here if needed */}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
