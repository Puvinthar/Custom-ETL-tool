import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Upload, 
  Eye, 
  Settings, 
  Download,
  Trash2,
  Menu,
  X
} from 'lucide-react';

type PageType = 'home' | 'upload' | 'transform' | 'load' | 'view';

interface NavigationProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
  hasData: boolean;
  onClearData: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  currentPage,
  onPageChange,
  hasData,
  onClearData
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home, color: 'blue' },
    { id: 'upload', label: 'Upload Data', icon: Upload, color: 'green' },
    { id: 'transform', label: 'Transform', icon: Settings, color: 'purple', disabled: !hasData },
    { id: 'load', label: 'Export', icon: Download, color: 'orange', disabled: !hasData },
    { id: 'view', label: 'View Data', icon: Eye, color: 'indigo', disabled: !hasData }
  ];

  const handlePageChange = (pageId: string) => {
    onPageChange(pageId as PageType);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-20 left-0 right-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-lg"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                const isDisabled = item.disabled;
                
                return (
                  <motion.button
                    key={item.id}
                    whileHover={!isDisabled ? { scale: 1.05 } : {}}
                    whileTap={!isDisabled ? { scale: 0.95 } : {}}
                    onClick={() => !isDisabled && handlePageChange(item.id)}
                    disabled={isDisabled}
                    className={`relative flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                      isActive
                        ? `bg-${item.color}-100 text-${item.color}-700 shadow-md`
                        : isDisabled
                        ? 'text-gray-400 cursor-not-allowed'
                        : `text-gray-600 hover:bg-${item.color}-50 hover:text-${item.color}-600`
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="hidden lg:block">{item.label}</span>
                    
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className={`absolute inset-0 bg-${item.color}-100 rounded-xl -z-10`}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Clear Data Button */}
            {hasData && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClearData}
                className="hidden md:flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-all duration-300 font-medium"
              >
                <Trash2 className="h-4 w-4" />
                <span>Clear Data</span>
              </motion.button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-600" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-36 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-xl"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  const isDisabled = item.disabled;
                  
                  return (
                    <motion.button
                      key={item.id}
                      whileTap={!isDisabled ? { scale: 0.95 } : {}}
                      onClick={() => !isDisabled && handlePageChange(item.id)}
                      disabled={isDisabled}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                        isActive
                          ? `bg-${item.color}-100 text-${item.color}-700`
                          : isDisabled
                          ? 'text-gray-400 cursor-not-allowed'
                          : `text-gray-600 hover:bg-${item.color}-50 hover:text-${item.color}-600`
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </motion.button>
                  );
                })}
                
                {hasData && (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      onClearData();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-all duration-300 font-medium"
                  >
                    <Trash2 className="h-5 w-5" />
                    <span>Clear Data</span>
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;