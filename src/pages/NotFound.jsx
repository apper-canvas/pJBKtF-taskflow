import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home as HomeIcon } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative mb-8">
          <div className="text-9xl font-bold text-primary/10 dark:text-primary/20">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-3xl font-bold text-primary">Page Not Found</h1>
          </div>
        </div>
        
        <p className="text-surface-600 dark:text-surface-400 max-w-md mx-auto mb-8">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track.
        </p>
        
        <Link 
          to="/"
          className="btn-primary inline-flex items-center gap-2 neu-light"
        >
          <HomeIcon size={18} />
          <span>Back to Home</span>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;