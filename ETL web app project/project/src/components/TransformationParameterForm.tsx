import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import { TransformationConfig, ParameterSchema } from '../types/transformations';

interface TransformationParameterFormProps {
  transformation?: TransformationConfig;
  currentParams: Record<string, any>;
  onParamsChange: (params: Record<string, any>) => void;
}

const TransformationParameterForm: React.FC<TransformationParameterFormProps> = ({
  transformation,
  currentParams,
  onParamsChange
}) => {
  if (!transformation) return null;

  const handleParamChange = (paramName: string, value: any) => {
    onParamsChange({
      ...currentParams,
      [paramName]: value
    });
  };

  const handleMappingChange = (paramName: string, mappings: Record<string, string>) => {
    onParamsChange({
      ...currentParams,
      [paramName]: mappings
    });
  };

  const renderParameter = (param: ParameterSchema) => {
    const value = currentParams[param.name];

    switch (param.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handleParamChange(param.name, e.target.value)}
            placeholder={param.placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required={param.required}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value || ''}
            onChange={(e) => handleParamChange(param.name, parseFloat(e.target.value))}
            placeholder={param.placeholder}
            min={param.min}
            max={param.max}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required={param.required}
          />
        );

      case 'boolean':
        return (
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => handleParamChange(param.name, e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Enable</span>
          </label>
        );

      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => handleParamChange(param.name, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required={param.required}
          >
            <option value="">Select an option</option>
            {param.options?.map((option) => (
              <option 
                key={typeof option === 'string' ? option : option.value} 
                value={typeof option === 'string' ? option : option.value}
              >
                {typeof option === 'string' ? option : option.label}
              </option>
            ))}
          </select>
        );

      case 'multiselect':
        return (
          <div className="space-y-2">
            {param.options?.map((option) => {
              const optionValue = typeof option === 'string' ? option : option.value;
              const optionLabel = typeof option === 'string' ? option : option.label;
              const isSelected = (value || []).includes(optionValue);
              
              return (
                <label key={optionValue} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      const currentValues = value || [];
                      const newValues = e.target.checked
                        ? [...currentValues, optionValue]
                        : currentValues.filter((v: string) => v !== optionValue);
                      handleParamChange(param.name, newValues);
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{optionLabel}</span>
                </label>
              );
            })}
          </div>
        );

      case 'mapping':
        const mappings = value || {};
        return (
          <div className="space-y-3">
            {Object.entries(mappings).map(([key, val], index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={key}
                  onChange={(e) => {
                    const newMappings = { ...mappings };
                    delete newMappings[key];
                    newMappings[e.target.value] = val;
                    handleMappingChange(param.name, newMappings);
                  }}
                  placeholder="From"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="text-gray-500">→</span>
                <input
                  type="text"
                  value={val as string}
                  onChange={(e) => {
                    const newMappings = { ...mappings };
                    newMappings[key] = e.target.value;
                    handleMappingChange(param.name, newMappings);
                  }}
                  placeholder="To"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() => {
                    const newMappings = { ...mappings };
                    delete newMappings[key];
                    handleMappingChange(param.name, newMappings);
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
            <button
              onClick={() => {
                const newMappings = { ...mappings, '': '' };
                handleMappingChange(param.name, newMappings);
              }}
              className="flex items-center space-x-2 px-3 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors duration-200"
            >
              <Plus className="h-4 w-4" />
              <span>Add Mapping</span>
            </button>
          </div>
        );

      case 'condition':
        return (
          <div className="space-y-2">
            <textarea
              value={value || ''}
              onChange={(e) => handleParamChange(param.name, e.target.value)}
              placeholder={param.placeholder}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required={param.required}
            />
            <p className="text-xs text-gray-500">
              Use column names and operators like: age &gt; 30 AND city = "Delhi"
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <h6 className="font-medium text-gray-900">Configure Parameters</h6>
      
      {transformation.parameterSchema.map((param) => (
        <div key={param.name} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {param.label}
            {param.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {renderParameter(param)}
        </div>
      ))}
    </div>
  );
};

export default TransformationParameterForm;