import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Globe, AlertCircle, CheckCircle } from 'lucide-react';
import { DataSession } from '../App';
import { DataProcessor } from '../utils/dataProcessor';

interface DataExtractorProps {
  onDataExtracted: (session: DataSession) => void;
}

const DataExtractor: React.FC<DataExtractorProps> = ({ onDataExtracted }) => {
  const [sourceType, setSourceType] = useState<'csv' | 'json' | 'api'>('csv');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [apiUrl, setApiUrl] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const dataProcessor = DataProcessor.getInstance();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await handleFileUpload(files[0]);
    }
  }, [sourceType]);

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let result;
      
      if (sourceType === 'csv') {
        if (!file.name.toLowerCase().endsWith('.csv')) {
          throw new Error('Please select a CSV file');
        }
        result = await dataProcessor.processCSV(file);
      } else {
        if (!file.name.toLowerCase().endsWith('.json')) {
          throw new Error('Please select a JSON file');
        }
        result = await dataProcessor.processJSON(file);
      }

      setSuccess(`Successfully loaded ${result.totalRows} rows with ${result.columns.length} columns`);
      onDataExtracted(result);
    } catch (err: any) {
      setError(err.message || 'Failed to process file');
    } finally {
      setLoading(false);
    }
  };

  const handleApiUpload = async () => {
    if (!apiUrl.trim()) {
      setError('Please enter a valid API URL');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await dataProcessor.fetchFromAPI(apiUrl);
      setSuccess(`Successfully fetched ${result.totalRows} rows with ${result.columns.length} columns`);
      onDataExtracted(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data from API');
    } finally {
      setLoading(false);
    }
  };

  const sourceOptions = [
    { id: 'csv', label: 'CSV File', icon: FileText, color: 'blue' },
    { id: 'json', label: 'JSON File', icon: FileText, color: 'green' },
    { id: 'api', label: 'API URL', icon: Globe, color: 'purple' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl shadow-xl p-8"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="inline-block p-4 bg-blue-100 rounded-full mb-4"
        >
          <Upload className="h-12 w-12 text-blue-600" />
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Extract Your Data</h2>
        <p className="text-gray-600">Choose your data source to begin the ETL process</p>
      </div>

      {/* Source Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {sourceOptions.map((option) => {
          const Icon = option.icon;
          return (
            <motion.button
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSourceType(option.id as any)}
              className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                sourceType === option.id
                  ? `border-${option.color}-500 bg-${option.color}-50`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Icon className={`h-8 w-8 mx-auto mb-3 ${
                sourceType === option.id 
                  ? `text-${option.color}-600` 
                  : 'text-gray-500'
              }`} />
              <h3 className="font-semibold text-gray-900">{option.label}</h3>
            </motion.button>
          );
        })}
      </div>

      {/* File Upload Area */}
      {(sourceType === 'csv' || sourceType === 'json') && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Drop your {sourceType.toUpperCase()} file here
          </h3>
          <p className="text-gray-500 mb-4">or click to browse</p>
          <input
            type="file"
            accept={sourceType === 'csv' ? '.csv' : '.json'}
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium cursor-pointer hover:bg-blue-700 transition-colors duration-200"
          >
            Choose File
          </label>
        </motion.div>
      )}

      {/* API URL Input */}
      {sourceType === 'api' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Endpoint URL
            </label>
            <input
              type="url"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="https://jsonplaceholder.typicode.com/posts"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <p className="text-sm text-gray-500 mt-1">
              Try: https://jsonplaceholder.typicode.com/posts for sample data
            </p>
          </div>
          <button
            onClick={handleApiUpload}
            disabled={loading || !apiUrl.trim()}
            className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? 'Fetching Data...' : 'Fetch Data'}
          </button>
        </motion.div>
      )}

      {/* Success Message */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3"
        >
          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-green-700 font-medium">Success!</p>
            <p className="text-green-600 text-sm mt-1">{success}</p>
          </div>
        </motion.div>
      )}

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3"
        >
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-700 font-medium">Error</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 text-center"
        >
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Processing your data...</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DataExtractor;