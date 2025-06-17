import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  ArrowRight, 
  ArrowLeft, 
  AlertCircle,
  CheckCircle,
  Zap
} from 'lucide-react';
import { DataSession } from '../App';
import { TransformationStep } from '../types/transformations';
import TransformationBuilder from './TransformationBuilder';
import DataPreview from './DataPreview';

interface DataTransformerProps {
  dataSession: DataSession;
  onDataTransformed: (session: DataSession) => void;
  onNext: () => void;
  onBack: () => void;
}

const DataTransformer: React.FC<DataTransformerProps> = ({
  dataSession,
  onDataTransformed,
  onNext,
  onBack
}) => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<DataSession | null>(null);

  const handlePreview = (steps: TransformationStep[]) => {
    console.log('Previewing transformations:', steps);
    setError(null);
    setSuccess(`Preview generated with ${steps.length} transformations`);
    
    // Clear success message after 3 seconds
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleDataTransformed = (session: DataSession) => {
    onDataTransformed(session);
    setPreviewData(session);
    setError(null);
    setSuccess(`Successfully applied ${session.transformations?.length || 0} transformations!`);
    
    // Clear success message after 3 seconds
    setTimeout(() => setSuccess(null), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-block p-4 bg-purple-100 rounded-full mb-4"
          >
            <Settings className="h-12 w-12 text-purple-600" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Transform Your Data</h2>
          <p className="text-gray-600">Build a custom transformation pipeline with modular components</p>
        </div>

        {/* Status Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3"
          >
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-700 font-medium">Error</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3"
          >
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-green-700 font-medium">Success!</p>
              <p className="text-green-600 text-sm mt-1">{success}</p>
            </div>
          </motion.div>
        )}

        {/* Data Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-blue-50 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {dataSession.totalRows.toLocaleString()}
            </div>
            <div className="text-blue-800 font-medium">Total Rows</div>
          </div>

          <div className="bg-purple-50 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {dataSession.columns.length}
            </div>
            <div className="text-purple-800 font-medium">Data Columns</div>
          </div>

          <div className="bg-green-50 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {dataSession.transformations?.length || 0}
            </div>
            <div className="text-green-800 font-medium">Applied Transformations</div>
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBack}
            className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Extract</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNext}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <span>Continue to Load</span>
            <ArrowRight className="h-5 w-5" />
          </motion.button>
        </div>
      </div>

      {/* Transformation Builder */}
      <TransformationBuilder
        dataSession={dataSession}
        onDataTransformed={handleDataTransformed}
        onPreview={handlePreview}
      />

      {/* Data Preview */}
      {(previewData || dataSession.transformations?.length) && (
        <DataPreview 
          dataSession={previewData || dataSession} 
          title="Transformed Data Preview" 
        />
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Zap className="h-6 w-6 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Quick Tips</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">🔧 Building Your Pipeline</h4>
            <ul className="space-y-1">
              <li>• Start with basic transformations like cleaning and renaming</li>
              <li>• Use preview to test transformations on sample data</li>
              <li>• Save your pipeline for reuse on similar datasets</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">⚡ Performance Tips</h4>
            <ul className="space-y-1">
              <li>• Filter rows early to reduce processing time</li>
              <li>• Drop unnecessary columns before complex operations</li>
              <li>• Use preview mode for large datasets</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DataTransformer;