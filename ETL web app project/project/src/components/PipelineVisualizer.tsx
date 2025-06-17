import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { DataSession } from '../App';

interface Step {
  id: number;
  name: string;
  description: string;
}

interface PipelineVisualizerProps {
  steps: Step[];
  currentStep: number;
  dataSession: DataSession | null;
}

const PipelineVisualizer: React.FC<PipelineVisualizerProps> = ({
  steps,
  currentStep,
  dataSession
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-300 ${
                  step.id < currentStep
                    ? 'bg-green-500 text-white'
                    : step.id === currentStep
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step.id < currentStep ? (
                  <Check className="h-8 w-8" />
                ) : (
                  step.id
                )}
              </div>
              
              <div className="mt-4 text-center">
                <h3 className={`font-semibold ${
                  step.id <= currentStep ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {step.description}
                </p>
              </div>
            </motion.div>

            {index < steps.length - 1 && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: (index + 1) * 0.1, duration: 0.5 }}
                className="flex-1 mx-8"
              >
                <div className={`h-1 rounded-full transition-all duration-300 ${
                  step.id < currentStep ? 'bg-green-500' : 'bg-gray-200'
                }`}>
                  <ArrowRight className={`h-6 w-6 -mt-2.5 ml-auto mr-auto ${
                    step.id < currentStep ? 'text-green-500' : 'text-gray-400'
                  }`} />
                </div>
              </motion.div>
            )}
          </React.Fragment>
        ))}
      </div>

      {dataSession && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900">Total Rows</h4>
            <p className="text-2xl font-bold text-blue-600">
              {dataSession.totalRows.toLocaleString()}
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="font-semibold text-purple-900">Columns</h4>
            <p className="text-2xl font-bold text-purple-600">
              {dataSession.columns.length}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-semibold text-green-900">Transformations</h4>
            <p className="text-2xl font-bold text-green-600">
              {dataSession.transformations?.length || 0}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PipelineVisualizer;