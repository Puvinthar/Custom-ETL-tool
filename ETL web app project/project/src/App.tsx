import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Navigation from './components/Navigation';
import DataExtractor from './components/DataExtractor';
import DataTransformer from './components/DataTransformer';
import DataLoader from './components/DataLoader';
import PipelineVisualizer from './components/PipelineVisualizer';
import DataViewer from './components/DataViewer';
import Footer from './components/Footer';

export interface DataSession {
  sessionId: string;
  preview: any[];
  totalRows: number;
  columns: string[];
  transformations?: string[];
}

type PageType = 'home' | 'upload' | 'transform' | 'load' | 'view';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [dataSession, setDataSession] = useState<DataSession | null>(null);

  const steps = [
    { id: 1, name: 'Extract', description: 'Import your data' },
    { id: 2, name: 'Transform', description: 'Clean and process' },
    { id: 3, name: 'Load', description: 'Export or save' }
  ];

  const getCurrentStep = () => {
    if (currentPage === 'upload') return 1;
    if (currentPage === 'transform') return 2;
    if (currentPage === 'load') return 3;
    return 1;
  };

  const handleDataExtracted = (session: DataSession) => {
    setDataSession(session);
    setCurrentPage('transform');
  };

  const handleDataTransformed = (session: DataSession) => {
    setDataSession(session);
  };

  const handleClearData = () => {
    setDataSession(null);
    setCurrentPage('home');
    localStorage.clear();
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div className="min-h-screen relative">
            {/* Hero Section with Background */}
            <div 
              className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 min-h-screen flex items-center justify-center"
              style={{
                backgroundImage: `linear-gradient(rgba(30, 58, 138, 0.8), rgba(67, 56, 202, 0.8)), url('https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-purple-900/80 to-indigo-900/80"></div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 text-center px-4 max-w-4xl mx-auto"
              >
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
                >
                  Transform Your Data
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                    With Confidence
                  </span>
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed"
                >
                  Professional-grade ETL pipeline tool with visual transformations, 
                  real-time preview, and enterprise-ready performance.
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                  <button
                    onClick={() => setCurrentPage('upload')}
                    className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
                  >
                    Start Your Pipeline
                  </button>
                  
                  {dataSession && (
                    <button
                      onClick={() => setCurrentPage('view')}
                      className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transform hover:scale-105 transition-all duration-300"
                    >
                      View Your Data
                    </button>
                  )}
                </motion.div>
              </motion.div>
            </div>

            {/* Features Section */}
            <div className="bg-white py-20">
              <div className="container mx-auto px-4">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="text-center mb-16"
                >
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                    Why Choose Our ETL Tool?
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Built for data professionals who demand reliability, performance, and ease of use.
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    {
                      title: "Visual Pipeline Builder",
                      description: "Drag-and-drop interface with real-time preview and modular transformations.",
                      icon: "🔧",
                      color: "blue"
                    },
                    {
                      title: "Enterprise Performance",
                      description: "Handle large datasets with optimized processing and quality reporting.",
                      icon: "⚡",
                      color: "purple"
                    },
                    {
                      title: "Production Ready",
                      description: "Export pipelines, save configurations, and deploy with confidence.",
                      icon: "🚀",
                      color: "green"
                    }
                  ].map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2, duration: 0.8 }}
                      viewport={{ once: true }}
                      className={`bg-gradient-to-br from-${feature.color}-50 to-${feature.color}-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2`}
                    >
                      <div className="text-4xl mb-4">{feature.icon}</div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                      <p className="text-gray-700 leading-relaxed">{feature.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'upload':
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
            <div className="container mx-auto px-4">
              <PipelineVisualizer 
                steps={steps} 
                currentStep={getCurrentStep()}
                dataSession={dataSession}
              />
              <DataExtractor onDataExtracted={handleDataExtracted} />
            </div>
          </div>
        );

      case 'transform':
        return dataSession ? (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
            <div className="container mx-auto px-4">
              <PipelineVisualizer 
                steps={steps} 
                currentStep={getCurrentStep()}
                dataSession={dataSession}
              />
              <DataTransformer 
                dataSession={dataSession}
                onDataTransformed={handleDataTransformed}
                onNext={() => setCurrentPage('load')}
                onBack={() => setCurrentPage('upload')}
              />
            </div>
          </div>
        ) : (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No Data Session Found</h2>
              <p className="text-gray-600 mb-6">Please upload data first to start transforming.</p>
              <button
                onClick={() => setCurrentPage('upload')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Upload Data
              </button>
            </div>
          </div>
        );

      case 'load':
        return dataSession ? (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
            <div className="container mx-auto px-4">
              <PipelineVisualizer 
                steps={steps} 
                currentStep={getCurrentStep()}
                dataSession={dataSession}
              />
              <DataLoader 
                dataSession={dataSession}
                onBack={() => setCurrentPage('transform')}
                onReset={() => {
                  setCurrentPage('home');
                  setDataSession(null);
                }}
              />
            </div>
          </div>
        ) : (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No Data Session Found</h2>
              <p className="text-gray-600 mb-6">Please upload and transform data first.</p>
              <button
                onClick={() => setCurrentPage('upload')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Start Pipeline
              </button>
            </div>
          </div>
        );

      case 'view':
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
            <div className="container mx-auto px-4">
              <DataViewer dataSession={dataSession} />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      <Navigation 
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        hasData={!!dataSession}
        onClearData={handleClearData}
      />
      
      <main className="pt-32">
        {renderContent()}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;