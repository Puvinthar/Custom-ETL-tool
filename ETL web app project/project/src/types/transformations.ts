export interface TransformationStep {
  id: string;
  step: string;
  category: string;
  name: string;
  description: string;
  params: Record<string, any>;
  enabled: boolean;
}

export interface TransformationCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  transformations: TransformationConfig[];
}

export interface TransformationConfig {
  id: string;
  name: string;
  description: string;
  step: string;
  icon: string;
  parameterSchema: ParameterSchema[];
  defaultParams: Record<string, any>;
}

export interface ParameterSchema {
  name: string;
  type: 'text' | 'select' | 'multiselect' | 'number' | 'boolean' | 'mapping' | 'condition';
  label: string;
  required: boolean;
  options?: string[] | { value: string; label: string }[];
  placeholder?: string;
  min?: number;
  max?: number;
}

export interface TransformationPipeline {
  id: string;
  name: string;
  description: string;
  steps: TransformationStep[];
  createdAt: Date;
  updatedAt: Date;
}