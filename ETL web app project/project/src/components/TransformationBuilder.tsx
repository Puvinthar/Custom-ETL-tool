import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Play, 
  Save,
  Eye,
  Settings,
  Zap,
  Cpu,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3
} from 'lucide-react';
import { DataSession } from '../App';
import { TransformationStep, TransformationCategory } from '../types/transformations';
import { transformationCategories } from '../config/transformationCategories';
import { TransformationEngine, TransformationResult } from '../utils/transformationEngine';
import { DataProcessor } from '../utils/dataProcessor';
import TransformationParameterForm from './TransformationParameterForm';
import DataQualityReport from './DataQualityReport';

interface TransformationBuilderProps {
  dataSession: DataSession;
  onDataTransformed: (session: DataSession) => void;
  onPreview: (steps: TransformationStep[]) => void;
}

const TransformationBuilder: React.FC<TransformationBuilderProps> = ({
  dataSession,
  onDataTransformed,
  onPreview
}) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['basic']);
  const [selectedSteps, setSelectedSteps] = useState<TransformationStep[]>([]);
  const [editingStep, setEditingStep] = useState<string | null>(null);
  const [pipelineName, setPipelineName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewResult, setPreviewResult] = useState<TransformationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showQualityReport, setShowQualityReport] = useState(false);

  const transformationEngine = TransformationEngine.getInstance();
  const dataProcessor = DataProcessor.getInstance();

  // Update transformation options with available columns
  const [categoriesWithColumns, setCategoriesWithColumns] = useState<TransformationCategory[]>([]);

  useEffect(() => {
    const updatedCategories = transformationCategories.map(category => ({
      ...category,
      transformations: category.transformations.map(transformation => ({
        ...transformation,
        parameterSchema: transformation.parameterSchema.map(param => {
          if (param.type === 'select' || param.type === 'multiselect') {
            return {
              ...param,
              options: dataSession.columns.map(col => ({ value: col, label: col }))
            };
          }
          return param;
        })
      }))
    }));
    setCategoriesWithColumns(updatedCategories);
  }, [dataSession.columns]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const addTransformationStep = (categoryId: string, transformationId: string) => {
    const category = categoriesWithColumns.find(c => c.id === categoryId);
    const transformation = category?.transformations.find(t => t.id === transformationId);
    
    if (transformation) {
      const newStep: TransformationStep = {
        id: `${transformationId}_${Date.now()}`,
        step: transformation.step,
        category: categoryId,
        name: transformation.name,
        description: transformation.description,
        params: { ...transformation.defaultParams },
        enabled: true
      };
      
      setSelectedSteps(prev => [...prev, newStep]);
      setEditingStep(newStep.id);
    }
  };

  const removeStep = (stepId: string) => {
    setSelectedSteps(prev => prev.filter(step => step.id !== stepId));
    if (editingStep === stepId) {
      setEditingStep(null);
    }
  };

  const updateStepParams = (stepId: string, params: Record<string, any>) => {
    setSelectedSteps(prev => 
      prev.map(step => 
        step.id === stepId ? { ...step, params } : step
      )
    );
  };

  const toggleStepEnabled = (stepId: string) => {
    setSelectedSteps(prev => 
      prev.map(step => 
        step.id === stepId ? { ...step, enabled: !step.enabled } : step
      )
    );
  };

  const previewTransformations = async () => {
    const enabledSteps = selectedSteps.filter(step => step.enabled);
    if (enabledSteps.length === 0) {
      setError('No transformations selected');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const session = dataProcessor.getSession(dataSession.sessionId);
      if (!session) {
        throw new Error('Data session not found');
      }

      const result = await transformationEngine.executeTransformations(
        session.data, 
        enabledSteps, 
        true // Preview mode
      );

      setPreviewResult(result);
      onPreview(enabledSteps);
    } catch (err: any) {
      setError(err.message || 'Failed to preview transformations');
    } finally {
      setIsProcessing(false);
    }
  };

  const applyTransformations = async () => {
    const enabledSteps = selectedSteps.filter(step => step.enabled);
    if (enabledSteps.length === 0) {
      setError('No transformations selected');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const session = dataProcessor.getSession(dataSession.sessionId);
      if (!session) {
        throw new Error('Data session not found');
      }

      const result = await transformationEngine.executeTransformations(
        session.data, 
        enabledSteps, 
        false // Full processing
      );

      // Update the data session
      const updatedSession: DataSession = {
        ...dataSession,
        preview: result.preview,
        totalRows: result.totalRows,
        columns: result.columns,
        transformations: result.appliedTransformations
      };

      // Update the session in DataProcessor
      const updatedProcessedData = {
        ...session,
        data: result.data,
        preview: result.preview,
        totalRows: result.totalRows,
        columns: result.columns,
        transformations: result.appliedTransformations
      };

      dataProcessor['sessions'].set(dataSession.sessionId, updatedProcessedData);
      
      onDataTransformed(updatedSession);
      setPreviewResult(result);
    } catch (err: any) {
      setError(err.message || 'Failed to apply transformations');
    } finally {
      setIsProcessing(false);
    }
  };

  const savePipeline = () => {
    if (!pipelineName.trim()) {
      setError('Please enter a pipeline name');
      return;
    }
    
    const pipeline = {
      id: `pipeline_${Date.now()}`,
      name: pipelineName,
      description: `Pipeline with ${selectedSteps.length} transformations`,
      steps: selectedSteps,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Save to localStorage
    const savedPipelines = JSON.parse(localStorage.getItem('transformation_pipelines') || '[]');
    savedPipelines.push(pipeline);
    localStorage.setItem('transformation_pipelines', JSON.stringify(savedPipelines));
    
    setError(null);
    setPipelineName('');
    
    // Show success message
    setTimeout(() => setError(null), 3000);
  };

  const getCategoryIcon = (iconName: string) => {
    const icons: Record<string, React.ComponentType<any>> = {
      Settings,
      Zap,
      Cpu
    };
    return icons[iconName] || Settings;
  };

  return (
    <div className="space-y-8">
      {/* Error/Success Messages */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3"
        >
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-700 font-medium">Error</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Transformation Categories */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Available Transformations</h3>
            
            <div className="space-y-4">
              {categoriesWithColumns.map((category) => {
                const IconComponent = getCategoryIcon(category.icon);
                const isExpanded = expandedCategories.includes(category.id);
                
                return (
                  <div key={category.id} className="border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className={`w-full p-4 flex items-center justify-between bg-${category.color}-50 hover:bg-${category.color}-100 transition-colors duration-200`}
                    >
                      <div className="flex items-center space-x-3">
                        <IconComponent className={`h-6 w-6 text-${category.color}-600`} />
                        <div className="text-left">
                          <h4 className="font-semibold text-gray-900">{category.name}</h4>
                          <p className="text-sm text-gray-600">{category.description}</p>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                    
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="bg-white"
                        >
                          <div className="p-4 space-y-3">
                            {category.transformations.map((transformation) => (
                              <div
                                key={transformation.id}
                                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                              >
                                <div className="flex-1">
                                  <h5 className="font-medium text-gray-900">{transformation.name}</h5>
                                  <p className="text-sm text-gray-600">{transformation.description}</p>
                                </div>
                                <button
                                  onClick={() => addTransformationStep(category.id, transformation.id)}
                                  className={`ml-4 p-2 bg-${category.color}-600 text-white rounded-lg hover:bg-${category.color}-700 transition-colors duration-200`}
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Transformations Pipeline */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Transformation Pipeline</h3>
            
            {selectedSteps.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Settings className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No transformations selected</p>
                <p className="text-sm">Choose transformations from the left panel</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedSteps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                      step.enabled 
                        ? 'border-blue-200 bg-blue-50' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full">
                          {index + 1}
                        </span>
                        <div>
                          <h5 className="font-medium text-gray-900">{step.name}</h5>
                          <p className="text-xs text-gray-600">{step.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={step.enabled}
                          onChange={() => toggleStepEnabled(step.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => setEditingStep(editingStep === step.id ? null : step.id)}
                          className="p-1 text-gray-500 hover:text-blue-600 transition-colors duration-200"
                        >
                          <Settings className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => removeStep(step.id)}
                          className="p-1 text-gray-500 hover:text-red-600 transition-colors duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {editingStep === step.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-3 pt-3 border-t border-gray-200"
                        >
                          <TransformationParameterForm
                            transformation={categoriesWithColumns
                              .find(c => c.id === step.category)
                              ?.transformations.find(t => t.step === step.step)}
                            currentParams={step.params}
                            onParamsChange={(params) => updateStepParams(step.id, params)}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            )}
            
            {selectedSteps.length > 0 && (
              <div className="mt-6 space-y-3">
                <div className="flex space-x-2">
                  <button
                    onClick={previewTransformations}
                    disabled={isProcessing}
                    className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4" />
                        <span>Preview</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={applyTransformations}
                    disabled={isProcessing}
                    className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors duration-200"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Applying...</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        <span>Apply</span>
                      </>
                    )}
                  </button>
                </div>
                
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={pipelineName}
                    onChange={(e) => setPipelineName(e.target.value)}
                    placeholder="Pipeline name..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={savePipeline}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                  >
                    <Save className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Preview Results */}
          {previewResult && (
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">Preview Results</h4>
                <button
                  onClick={() => setShowQualityReport(!showQualityReport)}
                  className="flex items-center space-x-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Quality Report</span>
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Rows Processed</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{previewResult.totalRows.toLocaleString()}</p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-900">Execution Time</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">{previewResult.executionTime}ms</p>
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                <p><strong>Applied Transformations:</strong></p>
                <ul className="list-disc list-inside mt-1">
                  {previewResult.appliedTransformations.map((transformation, index) => (
                    <li key={index}>{transformation}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Data Quality Report */}
      {showQualityReport && previewResult?.qualityReport && (
        <DataQualityReport 
          report={previewResult.qualityReport} 
          totalRows={previewResult.totalRows}
        />
      )}
    </div>
  );
};

export default TransformationBuilder;