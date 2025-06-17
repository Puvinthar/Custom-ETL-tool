import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  ArrowLeft, 
  RotateCcw,
  FileText,
  Database,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { DataSession } from '../App';
import { DataProcessor } from '../utils/dataProcessor';
import DataPreview from './DataPreview';

interface DataLoaderProps {
  dataSession: DataSession;
  onBack: () => void;
  onReset: () => void;
}

const DataLoader: React.FC<DataLoaderProps> = ({
  dataSession,
  onBack,
  onReset
}) => {
  const [loading, setLoading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const dataProcessor = DataProcessor.getInstance();

  const downloadData = async (format: 'json' | 'csv') => {
    setLoading(true);
    setDownloadStatus(null);

    try {
      dataProcessor.downloadData(dataSession.sessionId, format);
      setDownloadStatus({
        success: true,
        message: `Successfully downloaded ${format.toUpperCase()} file!`
      });
    } catch (error: any) {
      setDownloadStatus({
        success: false,
        message: error.message || 'Failed to download file. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const exportOptions = [
    {
      id: 'json',
      name: 'Download as JSON',
      description: 'Export your processed data as a JSON file',
      icon: FileText,
      color: 'blue'
    },
    {
      id: 'csv',
      name: 'Download as CSV',
      description: 'Export your processed data as a CSV file',
      icon: Database,
      color: 'green'
    }
  ];

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
            className="inline-block p-4 bg-green-100 rounded-full mb-4"
          >
            <Download className="h-12 w-12 text-green-600" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Load Your Data</h2>
          <p className="text-gray-600">Export your processed data in your preferred format</p>
        </div>

        {/* Processing Summary */}
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
            <div className="text-blue-800 font-medium">Processed Rows</div>
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
            <div className="text-green-800 font-medium">Transformations Applied</div>
          </div>
        </motion.div>

        {/* Export Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {exportOptions.map((option, index) => {
            const Icon = option.icon;
            
            return (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="p-6 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-all duration-300"
              >
                <Icon className={`h-10 w-10 text-${option.color}-600 mb-4`} />
                <h3 className="font-semibold text-gray-900 mb-2">{option.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{option.description}</p>
                
                <button
                  onClick={() => downloadData(option.id as 'json' | 'csv')}
                  disabled={loading}
                  className={`w-full py-3 px-4 bg-${option.color}-600 text-white rounded-lg hover:bg-${option.color}-700 disabled:opacity-50 transition-all duration-200 flex items-center justify-center space-x-2`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      <span>Download {option.id.toUpperCase()}</span>
                    </>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Status Message */}
        {downloadStatus && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg border mb-6 ${
              downloadStatus.success
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              {downloadStatus.success ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <span>{downloadStatus.message}</span>
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBack}
            className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Transform</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onReset}
            className="flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            <RotateCcw className="h-5 w-5" />
            <span>Start New Pipeline</span>
          </motion.button>
        </div>
      </div>

      {/* Final Data Preview */}
      <DataPreview dataSession={dataSession} title="Final Processed Data" />
    </motion.div>
  );
};

export default DataLoader;