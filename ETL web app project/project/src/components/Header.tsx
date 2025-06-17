import React from 'react';
import { motion } from 'framer-motion';
import { Database, Zap, Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg shadow-lg border-b border-gray-200/50"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-75"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
                <Database className="h-8 w-8 text-white" />
                <Zap className="h-4 w-4 text-yellow-300 absolute -top-1 -right-1" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                ETL Pipeline Studio
              </h1>
              <p className="text-gray-600 text-sm hidden sm:block">
                Extract, Transform, Load - Made Simple
              </p>
            </div>
          </motion.div>
          
          <div className="hidden lg:flex items-center space-x-4">
            <motion.div 
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Sparkles className="h-4 w-4" />
              <span>Production Ready</span>
            </motion.div>
            
            <motion.div 
              className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg"
              whileHover={{ scale: 1.02 }}
            >
              v2.0.0
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;