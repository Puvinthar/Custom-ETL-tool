import { TransformationCategory } from '../types/transformations';

export const transformationCategories: TransformationCategory[] = [
  {
    id: 'basic',
    name: 'Basic Transformations',
    description: 'Essential data cleaning and preparation operations',
    icon: 'Settings',
    color: 'blue',
    transformations: [
      {
        id: 'rename_columns',
        name: 'Rename Columns',
        description: 'Change column names to more meaningful ones',
        step: 'rename_columns',
        icon: 'Edit3',
        parameterSchema: [
          {
            name: 'mapping',
            type: 'mapping',
            label: 'Column Name Mapping',
            required: true,
            placeholder: 'old_name → new_name'
          }
        ],
        defaultParams: { mapping: {} }
      },
      {
        id: 'drop_columns',
        name: 'Drop Columns',
        description: 'Remove unnecessary columns from your dataset',
        step: 'drop_columns',
        icon: 'Trash2',
        parameterSchema: [
          {
            name: 'columns',
            type: 'multiselect',
            label: 'Columns to Drop',
            required: true,
            options: []
          }
        ],
        defaultParams: { columns: [] }
      },
      {
        id: 'change_data_types',
        name: 'Change Data Types',
        description: 'Convert columns to appropriate data types',
        step: 'change_data_types',
        icon: 'Type',
        parameterSchema: [
          {
            name: 'column',
            type: 'select',
            label: 'Column',
            required: true,
            options: []
          },
          {
            name: 'target_type',
            type: 'select',
            label: 'Target Type',
            required: true,
            options: [
              { value: 'string', label: 'Text (String)' },
              { value: 'number', label: 'Number' },
              { value: 'boolean', label: 'Boolean' },
              { value: 'date', label: 'Date' }
            ]
          }
        ],
        defaultParams: { column: '', target_type: 'string' }
      },
      {
        id: 'trim_whitespace',
        name: 'Trim Whitespace',
        description: 'Remove leading and trailing spaces from text columns',
        step: 'trim_whitespace',
        icon: 'Scissors',
        parameterSchema: [
          {
            name: 'columns',
            type: 'multiselect',
            label: 'Columns to Trim',
            required: false,
            options: []
          }
        ],
        defaultParams: { columns: [] }
      },
      {
        id: 'handle_nulls',
        name: 'Handle Missing Values',
        description: 'Deal with null or missing values in your data',
        step: 'handle_nulls',
        icon: 'AlertCircle',
        parameterSchema: [
          {
            name: 'column',
            type: 'select',
            label: 'Column',
            required: true,
            options: []
          },
          {
            name: 'method',
            type: 'select',
            label: 'Method',
            required: true,
            options: [
              { value: 'drop', label: 'Drop Rows' },
              { value: 'fill_value', label: 'Fill with Value' },
              { value: 'fill_mean', label: 'Fill with Mean' },
              { value: 'fill_median', label: 'Fill with Median' },
              { value: 'fill_mode', label: 'Fill with Mode' }
            ]
          },
          {
            name: 'fill_value',
            type: 'text',
            label: 'Fill Value',
            required: false,
            placeholder: 'Enter value to fill with'
          }
        ],
        defaultParams: { column: '', method: 'drop', fill_value: '' }
      }
    ]
  },
  {
    id: 'intermediate',
    name: 'Intermediate Transformations',
    description: 'Advanced data manipulation and feature engineering',
    icon: 'Zap',
    color: 'purple',
    transformations: [
      {
        id: 'filter_rows',
        name: 'Filter Rows',
        description: 'Filter data based on conditions',
        step: 'filter_rows',
        icon: 'Filter',
        parameterSchema: [
          {
            name: 'condition',
            type: 'condition',
            label: 'Filter Condition',
            required: true,
            placeholder: 'e.g., age > 30 AND city = "Delhi"'
          }
        ],
        defaultParams: { condition: '' }
      },
      {
        id: 'value_mapping',
        name: 'Value Mapping',
        description: 'Replace values with new ones using mapping rules',
        step: 'value_mapping',
        icon: 'ArrowRightLeft',
        parameterSchema: [
          {
            name: 'column',
            type: 'select',
            label: 'Column',
            required: true,
            options: []
          },
          {
            name: 'mapping',
            type: 'mapping',
            label: 'Value Mapping',
            required: true,
            placeholder: 'old_value → new_value'
          }
        ],
        defaultParams: { column: '', mapping: {} }
      },
      {
        id: 'feature_engineering',
        name: 'Feature Engineering',
        description: 'Create new columns based on calculations',
        step: 'feature_engineering',
        icon: 'Calculator',
        parameterSchema: [
          {
            name: 'new_column',
            type: 'text',
            label: 'New Column Name',
            required: true,
            placeholder: 'Enter new column name'
          },
          {
            name: 'formula',
            type: 'text',
            label: 'Formula',
            required: true,
            placeholder: 'e.g., column1 + column2 * 0.1'
          }
        ],
        defaultParams: { new_column: '', formula: '' }
      },
      {
        id: 'one_hot_encoding',
        name: 'One-Hot Encoding',
        description: 'Convert categorical variables to binary columns',
        step: 'one_hot_encoding',
        icon: 'Binary',
        parameterSchema: [
          {
            name: 'columns',
            type: 'multiselect',
            label: 'Categorical Columns',
            required: true,
            options: []
          }
        ],
        defaultParams: { columns: [] }
      }
    ]
  },
  {
    id: 'advanced',
    name: 'Advanced Transformations',
    description: 'Complex data operations and statistical transformations',
    icon: 'Cpu',
    color: 'green',
    transformations: [
      {
        id: 'group_by_aggregation',
        name: 'Group By & Aggregation',
        description: 'Group data and apply aggregation functions',
        step: 'group_by_aggregation',
        icon: 'BarChart3',
        parameterSchema: [
          {
            name: 'group_by_columns',
            type: 'multiselect',
            label: 'Group By Columns',
            required: true,
            options: []
          },
          {
            name: 'agg_column',
            type: 'select',
            label: 'Aggregation Column',
            required: true,
            options: []
          },
          {
            name: 'agg_function',
            type: 'select',
            label: 'Aggregation Function',
            required: true,
            options: [
              { value: 'sum', label: 'Sum' },
              { value: 'mean', label: 'Mean' },
              { value: 'median', label: 'Median' },
              { value: 'count', label: 'Count' },
              { value: 'min', label: 'Minimum' },
              { value: 'max', label: 'Maximum' }
            ]
          }
        ],
        defaultParams: { group_by_columns: [], agg_column: '', agg_function: 'sum' }
      },
      {
        id: 'pivot_table',
        name: 'Pivot Table',
        description: 'Reshape data from long to wide format',
        step: 'pivot_table',
        icon: 'RotateCw',
        parameterSchema: [
          {
            name: 'index_column',
            type: 'select',
            label: 'Index Column',
            required: true,
            options: []
          },
          {
            name: 'columns_column',
            type: 'select',
            label: 'Columns Column',
            required: true,
            options: []
          },
          {
            name: 'values_column',
            type: 'select',
            label: 'Values Column',
            required: true,
            options: []
          }
        ],
        defaultParams: { index_column: '', columns_column: '', values_column: '' }
      },
      {
        id: 'normalize_scale',
        name: 'Normalize/Scale',
        description: 'Scale numerical columns to a standard range',
        step: 'normalize_scale',
        icon: 'TrendingUp',
        parameterSchema: [
          {
            name: 'columns',
            type: 'multiselect',
            label: 'Columns to Scale',
            required: true,
            options: []
          },
          {
            name: 'method',
            type: 'select',
            label: 'Scaling Method',
            required: true,
            options: [
              { value: 'minmax', label: 'Min-Max (0-1)' },
              { value: 'standard', label: 'Standard (Z-score)' },
              { value: 'robust', label: 'Robust Scaling' }
            ]
          }
        ],
        defaultParams: { columns: [], method: 'minmax' }
      },
      {
        id: 'regex_replace',
        name: 'Regex Replace',
        description: 'Replace text patterns using regular expressions',
        step: 'regex_replace',
        icon: 'Search',
        parameterSchema: [
          {
            name: 'column',
            type: 'select',
            label: 'Column',
            required: true,
            options: []
          },
          {
            name: 'pattern',
            type: 'text',
            label: 'Regex Pattern',
            required: true,
            placeholder: 'e.g., \\d{3}-\\d{3}-\\d{4}'
          },
          {
            name: 'replacement',
            type: 'text',
            label: 'Replacement',
            required: true,
            placeholder: 'Text to replace with'
          }
        ],
        defaultParams: { column: '', pattern: '', replacement: '' }
      }
    ]
  }
];