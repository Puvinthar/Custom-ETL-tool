import React from 'react';
import { motion } from 'framer-motion';
import { Eye, BarChart3 } from 'lucide-react';
import { DataSession } from '../App';

interface DataPreviewProps {
  dataSession: DataSession;
  title?: string;
}

const DataPreview: React.FC<DataPreviewProps> = ({ 
  dataSession, 
  title = "Data Preview" 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-xl p-8"
    >
      <div className="flex items-center space-x-3 mb-6">
        <Eye className="h-6 w-6 text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          {dataSession.totalRows.toLocaleString()} rows
        </div>
      </div>

      {/* Column Headers */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-700 mb-2 flex items-center space-x-2">
          <BarChart3 className="h-4 w-4" />
          <span>Columns ({dataSession.columns.length})</span>
        </h4>
        <div className="flex flex-wrap gap-2">
          {dataSession.columns.map((column, index) => (
            <motion.span
              key={column}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium"
            >
              {column}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {dataSession.columns.map((column) => (
                <th
                  key={column}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dataSession.preview.map((row, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                {dataSession.columns.map((column) => (
                  <td
                    key={`${index}-${column}`}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {row[column] !== null && row[column] !== undefined 
                      ? String(row[column])
                      : <span className="text-gray-400 italic">null</span>
                    }
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {dataSession.preview.length < dataSession.totalRows && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Showing first {dataSession.preview.length} rows of {dataSession.totalRows.toLocaleString()} total rows
        </div>
      )}
    </motion.div>
  );
};

export default DataPreview;