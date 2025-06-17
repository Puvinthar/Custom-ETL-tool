import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  TrendingUp,
  Database
} from 'lucide-react';
import { DataQualityReport } from '../utils/transformationEngine';

interface DataQualityReportProps {
  report: DataQualityReport;
  totalRows: number;
}

const DataQualityReportComponent: React.FC<DataQualityReportProps> = ({ 
  report, 
  totalRows 
}) => {
  const getQualityScore = (): number => {
    const columns = Object.keys(report.nullCounts);
    if (columns.length === 0) return 100;

    let score = 100;
    
    // Deduct points for null values
    const totalNulls = Object.values(report.nullCounts).reduce((a, b) => a + b, 0);
    const nullPercentage = (totalNulls / (totalRows * columns.length)) * 100;
    score -= nullPercentage * 0.5;
    
    // Deduct points for duplicates
    const duplicatePercentage = (report.duplicateRows / totalRows) * 100;
    score -= duplicatePercentage * 0.3;
    
    // Deduct points for outliers
    const totalOutliers = Object.values(report.outliers).reduce((a, b) => a + b, 0);
    const outlierPercentage = (totalOutliers / totalRows) * 100;
    score -= outlierPercentage * 0.2;
    
    return Math.max(0, Math.round(score));
  };

  const qualityScore = getQualityScore();
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'green';
    if (score >= 70) return 'yellow';
    return 'red';
  };

  const scoreColor = getScoreColor(qualityScore);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-xl p-8"
    >
      <div className="flex items-center space-x-3 mb-6">
        <BarChart3 className="h-6 w-6 text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-900">Data Quality Report</h3>
        <div className={`bg-${scoreColor}-100 text-${scoreColor}-800 px-3 py-1 rounded-full text-sm font-medium`}>
          Quality Score: {qualityScore}%
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Rows */}
        <div className="bg-blue-50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <Database className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-600">{totalRows.toLocaleString()}</span>
          </div>
          <h4 className="font-medium text-blue-900">Total Rows</h4>
        </div>

        {/* Duplicate Rows */}
        <div className="bg-yellow-50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
            <span className="text-2xl font-bold text-yellow-600">{report.duplicateRows}</span>
          </div>
          <h4 className="font-medium text-yellow-900">Duplicate Rows</h4>
          <p className="text-sm text-yellow-700">
            {((report.duplicateRows / totalRows) * 100).toFixed(1)}% of total
          </p>
        </div>

        {/* Data Types */}
        <div className="bg-purple-50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <Info className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold text-purple-600">
              {Object.keys(report.dataTypes).length}
            </span>
          </div>
          <h4 className="font-medium text-purple-900">Columns</h4>
          <div className="text-sm text-purple-700">
            {Object.entries(
              Object.values(report.dataTypes).reduce((acc, type) => {
                acc[type] = (acc[type] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            ).map(([type, count]) => (
              <div key={type}>{count} {type}</div>
            ))}
          </div>
        </div>

        {/* Quality Score */}
        <div className={`bg-${scoreColor}-50 rounded-xl p-6`}>
          <div className="flex items-center justify-between mb-2">
            {qualityScore >= 90 ? (
              <CheckCircle className={`h-8 w-8 text-${scoreColor}-600`} />
            ) : (
              <TrendingUp className={`h-8 w-8 text-${scoreColor}-600`} />
            )}
            <span className={`text-2xl font-bold text-${scoreColor}-600`}>{qualityScore}%</span>
          </div>
          <h4 className={`font-medium text-${scoreColor}-900`}>Quality Score</h4>
          <p className={`text-sm text-${scoreColor}-700`}>
            {qualityScore >= 90 ? 'Excellent' : qualityScore >= 70 ? 'Good' : 'Needs Improvement'}
          </p>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="space-y-6">
        {/* Null Values */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Missing Values by Column</h4>
          <div className="space-y-2">
            {Object.entries(report.nullCounts).map(([column, count]) => {
              const percentage = (count / totalRows) * 100;
              return (
                <div key={column} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{column}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          percentage > 20 ? 'bg-red-500' : percentage > 10 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-16 text-right">
                      {count} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Outliers */}
        {Object.keys(report.outliers).length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Outliers by Column</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(report.outliers).map(([column, count]) => (
                <div key={column} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">{column}</span>
                    <span className="text-lg font-bold text-orange-600">{count}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {((count / totalRows) * 100).toFixed(1)}% outliers
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Unique Values */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Unique Values by Column</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(report.uniqueValues).map(([column, count]) => {
              const uniqueness = (count / totalRows) * 100;
              return (
                <div key={column} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">{column}</span>
                    <span className="text-lg font-bold text-blue-600">{count}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {uniqueness.toFixed(1)}% unique
                  </p>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div
                        className="h-1 rounded-full bg-blue-500"
                        style={{ width: `${Math.min(uniqueness, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DataQualityReportComponent;