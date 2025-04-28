import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Filter } from "lucide-react";
import MainFeature from "../components/MainFeature";

const Home = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);
  
  const addTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };
  
  const toggleTaskStatus = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
    ));
  };
  
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };
  
  const filteredTasks = tasks.filter(task => {
    if (filter === "all") return true;
    if (filter === "active") return !task.isCompleted;
    if (filter === "completed") return task.isCompleted;
    return true;
  });
  
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (sortBy === "priority") {
      const priorityValues = { high: 3, medium: 2, low: 1 };
      return priorityValues[b.priority] - priorityValues[a.priority];
    }
    return 0;
  });
  
  const getTaskCountByStatus = () => {
    const active = tasks.filter(task => !task.isCompleted).length;
    const completed = tasks.filter(task => task.isCompleted).length;
    return { active, completed, total: tasks.length };
  };
  
  const taskCounts = getTaskCountByStatus();
  
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-2"
        >
          Welcome to TaskFlow
        </motion.h1>
        <p className="text-surface-600 dark:text-surface-400">
          Organize your tasks efficiently and boost your productivity
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-5"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Clock size={20} />
            </div>
            <h3 className="font-semibold">Task Summary</h3>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="text-center p-3 rounded-lg bg-surface-100 dark:bg-surface-700">
              <p className="text-2xl font-bold">{taskCounts.active}</p>
              <p className="text-xs text-surface-500">Active</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-surface-100 dark:bg-surface-700">
              <p className="text-2xl font-bold">{taskCounts.completed}</p>
              <p className="text-xs text-surface-500">Done</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-surface-100 dark:bg-surface-700">
              <p className="text-2xl font-bold">{taskCounts.total}</p>
              <p className="text-xs text-surface-500">Total</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-5 md:col-span-2"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-secondary/10 text-secondary">
              <Calendar size={20} />
            </div>
            <h3 className="font-semibold">Today's Focus</h3>
          </div>
          <div className="mt-4">
            {tasks.filter(task => !task.isCompleted).slice(0, 3).map((task, index) => (
              <div 
                key={task.id} 
                className={`flex items-center gap-3 p-3 rounded-lg mb-2 ${
                  task.priority === "high" 
                    ? "bg-accent/10" 
                    : task.priority === "medium" 
                      ? "bg-primary/10" 
                      : "bg-secondary/10"
                }`}
              >
                <div 
                  className={`w-3 h-3 rounded-full ${
                    task.priority === "high" 
                      ? "bg-accent" 
                      : task.priority === "medium" 
                        ? "bg-primary" 
                        : "bg-secondary"
                  }`}
                />
                <p className="text-sm font-medium flex-grow truncate">{task.title}</p>
              </div>
            ))}
            {tasks.filter(task => !task.isCompleted).length === 0 && (
              <p className="text-center text-surface-500 dark:text-surface-400 py-3">
                No active tasks. Add some tasks to get started!
              </p>
            )}
          </div>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <MainFeature onAddTask={addTask} />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3"
        >
          <div className="card">
            <div className="p-4 border-b border-surface-200 dark:border-surface-700 flex justify-between items-center">
              <h3 className="font-semibold">Task List</h3>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <select 
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="appearance-none pl-8 pr-4 py-1 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-sm"
                  >
                    <option value="all">All Tasks</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                  <Filter size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-surface-500" />
                </div>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none px-3 py-1 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-sm"
                >
                  <option value="date">Sort by Date</option>
                  <option value="priority">Sort by Priority</option>
                </select>
              </div>
            </div>
            
            <div className="p-4 max-h-[400px] overflow-y-auto scrollbar-hide">
              <AnimatePresence>
                {sortedTasks.length > 0 ? (
                  sortedTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`task-item mb-3 ${
                        task.priority === "high" 
                          ? "task-priority-high" 
                          : task.priority === "medium" 
                            ? "task-priority-medium" 
                            : "task-priority-low"
                      }`}
                    >
                      <div className="flex-shrink-0 pt-1">
                        <input 
                          type="checkbox" 
                          checked={task.isCompleted}
                          onChange={() => toggleTaskStatus(task.id)}
                          className="w-5 h-5 rounded-full border-2 border-primary text-primary focus:ring-primary"
                        />
                      </div>
                      <div className="flex-grow">
                        <h4 className={`font-medium ${task.isCompleted ? 'line-through text-surface-400' : ''}`}>
                          {task.title}
                        </h4>
                        <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
                          {task.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs px-2 py-1 rounded-full bg-surface-100 dark:bg-surface-700">
                            Due: {task.dueDate}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            task.priority === "high" 
                              ? "bg-accent/10 text-accent" 
                              : task.priority === "medium" 
                                ? "bg-primary/10 text-primary" 
                                : "bg-secondary/10 text-secondary"
                          }`}>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => deleteTask(task.id)}
                        className="text-surface-400 hover:text-accent"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18"></path>
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        </svg>
                      </button>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 text-surface-500 dark:text-surface-400">
                    <p>No tasks found. Add some tasks to get started!</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;