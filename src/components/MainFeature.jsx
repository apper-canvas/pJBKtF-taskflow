import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Calendar, AlertCircle, CheckCircle, XCircle } from "lucide-react";

const MainFeature = ({ onAddTask }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
  });
  
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    } else {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.dueDate = "Due date cannot be in the past";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const newTask = {
        id: Date.now().toString(),
        ...formData,
        isCompleted: false,
        createdAt: new Date().toISOString(),
      };
      
      onAddTask(newTask);
      
      // Show success message
      setShowSuccess(true);
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        dueDate: "",
        priority: "medium",
      });
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }
  };
  
  return (
    <div className="card overflow-visible">
      <div className="p-4 border-b border-surface-200 dark:border-surface-700">
        <h3 className="font-semibold flex items-center gap-2">
          <PlusCircle size={18} className="text-primary" />
          Add New Task
        </h3>
      </div>
      
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Task Title <span className="text-accent">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`input ${errors.title ? 'border-accent' : ''}`}
            placeholder="What needs to be done?"
          />
          <AnimatePresence>
            {errors.title && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-accent text-xs mt-1 flex items-center gap-1"
              >
                <AlertCircle size={12} />
                {errors.title}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="input resize-none"
            placeholder="Add details about your task..."
          ></textarea>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
              Due Date <span className="text-accent">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className={`input pl-10 ${errors.dueDate ? 'border-accent' : ''}`}
              />
              <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-500" />
            </div>
            <AnimatePresence>
              {errors.dueDate && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-accent text-xs mt-1 flex items-center gap-1"
                >
                  <AlertCircle size={12} />
                  {errors.dueDate}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          
          <div>
            <label htmlFor="priority" className="block text-sm font-medium mb-1">
              Priority
            </label>
            <div className="flex gap-2">
              <label 
                className={`flex-1 flex items-center justify-center gap-1 p-2 rounded-lg border cursor-pointer transition-all ${
                  formData.priority === "low" 
                    ? "border-secondary bg-secondary/10 text-secondary" 
                    : "border-surface-300 dark:border-surface-600 hover:bg-surface-100 dark:hover:bg-surface-700"
                }`}
              >
                <input 
                  type="radio" 
                  name="priority" 
                  value="low" 
                  checked={formData.priority === "low"}
                  onChange={handleChange}
                  className="sr-only"
                />
                <span className="text-sm">Low</span>
              </label>
              
              <label 
                className={`flex-1 flex items-center justify-center gap-1 p-2 rounded-lg border cursor-pointer transition-all ${
                  formData.priority === "medium" 
                    ? "border-primary bg-primary/10 text-primary" 
                    : "border-surface-300 dark:border-surface-600 hover:bg-surface-100 dark:hover:bg-surface-700"
                }`}
              >
                <input 
                  type="radio" 
                  name="priority" 
                  value="medium" 
                  checked={formData.priority === "medium"}
                  onChange={handleChange}
                  className="sr-only"
                />
                <span className="text-sm">Medium</span>
              </label>
              
              <label 
                className={`flex-1 flex items-center justify-center gap-1 p-2 rounded-lg border cursor-pointer transition-all ${
                  formData.priority === "high" 
                    ? "border-accent bg-accent/10 text-accent" 
                    : "border-surface-300 dark:border-surface-600 hover:bg-surface-100 dark:hover:bg-surface-700"
                }`}
              >
                <input 
                  type="radio" 
                  name="priority" 
                  value="high" 
                  checked={formData.priority === "high"}
                  onChange={handleChange}
                  className="sr-only"
                />
                <span className="text-sm">High</span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="pt-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full btn-primary py-3 neu-light"
          >
            Add Task
          </motion.button>
        </div>
        
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 p-3 rounded-lg bg-secondary/10 text-secondary mt-4"
            >
              <CheckCircle size={18} />
              <span>Task added successfully!</span>
              <button 
                onClick={() => setShowSuccess(false)}
                className="ml-auto"
              >
                <XCircle size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};

export default MainFeature;