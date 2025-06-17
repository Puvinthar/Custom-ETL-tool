import React from 'react';
import { motion } from 'framer-motion';
import { Eye, BarChart3, Download, FileText } from 'lucide-react';
import { DataSession } from '../App';
import DataPreview from './DataPreview';

interface DataViewerProps {
  dataSession: DataSession | null;
}

const DataViewer: React.FC<DataViewerProps> = ({ dataSession }) => {
  if (!dataSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white rounded-2xl shadow-xl p-12 max-w-md mx-auto"
        >
          <Eye className="h-16 w-16 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Data to View</h2>
          <p className="text-gray-600 mb-6">
            Upload and process some data first to view it here.
          </p>
          <div className="space-y-3">
            <div className="text-sm text-gray-500">
              • Upload CSV or JSON files
            </div>
            <div className="text-sm text-gray-500">
              • Apply transformations
            </div>
            <div className="text-sm text-gray-500">
              • View processed results
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
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
            className="inline-block p-4 bg-indigo-100 rounded-full mb-4"
          >
            <Eye className="h-12 w-12 text-indigo-600" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Data Viewer</h2>
          <p className="text-gray-600">Explore your processed dataset</p>
        </div>

        {/* Data Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-blue-50 rounded-xl p-6 text-center">
            <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {dataSession.totalRows.toLocaleString()}
            </div>
            <div className="text-blue-800 font-medium">Total Rows</div>
          </div>

          <div className="bg-purple-50 rounded-xl p-6 text-center">
            <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {dataSession.columns.length}
            </div>
            <div className="text-purple-800 font-medium">Columns</div>
          </div>

          <div className="bg-green-50 rounded-xl p-6 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="h-8 w-8 text-green-600 mx-auto mb-2"
            >
              ⚙️
            </motion.div>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {dataSession.transformations?.length || 0}
            </div>
            <div className="text-green-800 font-medium">Transformations</div>
          </div>

          <div className="bg-orange-50 rounded-xl p-6 text-center">
            <Download className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-3xl font-bold text-orange-600 mb-2">
              Ready
            </div>
            <div className="text-orange-800 font-medium">For Export</div>
          </div>
        </motion.div>

        {/* Applied Transformations */}
        {dataSession.transformations && dataSession.transformations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Applied Transformations</h3>
            <div className="flex flex-wrap gap-2">
              {dataSession.transformations.map((transformation, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium border border-blue-200"
                >
                  {transformation}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Data Preview */}
      <DataPreview dataSession={dataSession} title="Complete Dataset View" />
    </div>
  );
};

export default DataViewer;