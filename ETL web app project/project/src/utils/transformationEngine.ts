import { TransformationStep } from '../types/transformations';
import { ProcessedData } from './dataProcessor';

export interface TransformationResult {
  data: any[];
  preview: any[];
  totalRows: number;
  columns: string[];
  appliedTransformations: string[];
  executionTime: number;
  qualityReport?: DataQualityReport;
}

export interface DataQualityReport {
  nullCounts: Record<string, number>;
  duplicateRows: number;
  dataTypes: Record<string, string>;
  outliers: Record<string, number>;
  uniqueValues: Record<string, number>;
}

export class TransformationEngine {
  private static instance: TransformationEngine;

  static getInstance(): TransformationEngine {
    if (!TransformationEngine.instance) {
      TransformationEngine.instance = new TransformationEngine();
    }
    return TransformationEngine.instance;
  }

  async executeTransformations(
    data: any[], 
    steps: TransformationStep[], 
    previewOnly: boolean = false
  ): Promise<TransformationResult> {
    const startTime = Date.now();
    let transformedData = [...data];
    const appliedTransformations: string[] = [];

    // If preview only, work with first 1000 rows
    if (previewOnly) {
      transformedData = transformedData.slice(0, 1000);
    }

    for (const step of steps.filter(s => s.enabled)) {
      try {
        transformedData = await this.applyTransformation(transformedData, step);
        appliedTransformations.push(step.name);
      } catch (error) {
        console.error(`Error applying transformation ${step.name}:`, error);
        throw new Error(`Failed to apply ${step.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    const executionTime = Date.now() - startTime;
    const columns = transformedData.length > 0 ? Object.keys(transformedData[0]) : [];

    return {
      data: transformedData,
      preview: transformedData.slice(0, 10),
      totalRows: transformedData.length,
      columns,
      appliedTransformations,
      executionTime,
      qualityReport: this.generateQualityReport(transformedData)
    };
  }

  private async applyTransformation(data: any[], step: TransformationStep): Promise<any[]> {
    switch (step.step) {
      case 'rename_columns':
        return this.renameColumns(data, step.params.mapping);
      
      case 'drop_columns':
        return this.dropColumns(data, step.params.columns);
      
      case 'change_data_types':
        return this.changeDataTypes(data, step.params.column, step.params.target_type);
      
      case 'trim_whitespace':
        return this.trimWhitespace(data, step.params.columns);
      
      case 'handle_nulls':
        return this.handleNulls(data, step.params.column, step.params.method, step.params.fill_value);
      
      case 'filter_rows':
        return this.filterRows(data, step.params.condition);
      
      case 'value_mapping':
        return this.valueMapping(data, step.params.column, step.params.mapping);
      
      case 'feature_engineering':
        return this.featureEngineering(data, step.params.new_column, step.params.formula);
      
      case 'one_hot_encoding':
        return this.oneHotEncoding(data, step.params.columns);
      
      case 'group_by_aggregation':
        return this.groupByAggregation(
          data, 
          step.params.group_by_columns, 
          step.params.agg_column, 
          step.params.agg_function
        );
      
      case 'pivot_table':
        return this.pivotTable(
          data, 
          step.params.index_column, 
          step.params.columns_column, 
          step.params.values_column
        );
      
      case 'normalize_scale':
        return this.normalizeScale(data, step.params.columns, step.params.method);
      
      case 'regex_replace':
        return this.regexReplace(data, step.params.column, step.params.pattern, step.params.replacement);
      
      default:
        throw new Error(`Unknown transformation: ${step.step}`);
    }
  }

  private renameColumns(data: any[], mapping: Record<string, string>): any[] {
    return data.map(row => {
      const newRow: any = {};
      Object.keys(row).forEach(key => {
        const newKey = mapping[key] || key;
        newRow[newKey] = row[key];
      });
      return newRow;
    });
  }

  private dropColumns(data: any[], columns: string[]): any[] {
    return data.map(row => {
      const newRow: any = {};
      Object.keys(row).forEach(key => {
        if (!columns.includes(key)) {
          newRow[key] = row[key];
        }
      });
      return newRow;
    });
  }

  private changeDataTypes(data: any[], column: string, targetType: string): any[] {
    return data.map(row => {
      const newRow = { ...row };
      const value = row[column];
      
      if (value === null || value === undefined) {
        return newRow;
      }

      try {
        switch (targetType) {
          case 'number':
            newRow[column] = parseFloat(value);
            break;
          case 'string':
            newRow[column] = String(value);
            break;
          case 'boolean':
            newRow[column] = Boolean(value);
            break;
          case 'date':
            newRow[column] = new Date(value).toISOString();
            break;
        }
      } catch (error) {
        // Keep original value if conversion fails
      }
      
      return newRow;
    });
  }

  private trimWhitespace(data: any[], columns: string[]): any[] {
    return data.map(row => {
      const newRow = { ...row };
      const columnsToTrim = columns.length > 0 ? columns : Object.keys(row);
      
      columnsToTrim.forEach(col => {
        if (typeof newRow[col] === 'string') {
          newRow[col] = newRow[col].trim();
        }
      });
      
      return newRow;
    });
  }

  private handleNulls(data: any[], column: string, method: string, fillValue?: any): any[] {
    if (method === 'drop') {
      return data.filter(row => row[column] !== null && row[column] !== undefined && row[column] !== '');
    }

    let computedFillValue = fillValue;
    
    if (method === 'fill_mean') {
      const values = data.map(row => parseFloat(row[column])).filter(v => !isNaN(v));
      computedFillValue = values.reduce((a, b) => a + b, 0) / values.length;
    } else if (method === 'fill_median') {
      const values = data.map(row => parseFloat(row[column])).filter(v => !isNaN(v)).sort((a, b) => a - b);
      computedFillValue = values[Math.floor(values.length / 2)];
    } else if (method === 'fill_mode') {
      const counts: Record<string, number> = {};
      data.forEach(row => {
        const val = row[column];
        if (val !== null && val !== undefined && val !== '') {
          counts[val] = (counts[val] || 0) + 1;
        }
      });
      computedFillValue = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    }

    return data.map(row => {
      const newRow = { ...row };
      if (newRow[column] === null || newRow[column] === undefined || newRow[column] === '') {
        newRow[column] = computedFillValue;
      }
      return newRow;
    });
  }

  private filterRows(data: any[], condition: string): any[] {
    try {
      // Simple condition parser - in production, use a proper expression parser
      return data.filter(row => {
        // Replace column names with actual values
        let evalCondition = condition;
        Object.keys(row).forEach(key => {
          const value = typeof row[key] === 'string' ? `"${row[key]}"` : row[key];
          evalCondition = evalCondition.replace(new RegExp(`\\b${key}\\b`, 'g'), value);
        });
        
        // Basic safety check - only allow simple operators
        if (!/^[0-9\s"'<>=!&|().\-+*/]+$/.test(evalCondition.replace(/AND|OR/g, ''))) {
          throw new Error('Invalid condition');
        }
        
        evalCondition = evalCondition.replace(/AND/g, '&&').replace(/OR/g, '||');
        
        try {
          return Function(`"use strict"; return (${evalCondition})`)();
        } catch {
          return false;
        }
      });
    } catch (error) {
      throw new Error('Invalid filter condition');
    }
  }

  private valueMapping(data: any[], column: string, mapping: Record<string, string>): any[] {
    return data.map(row => {
      const newRow = { ...row };
      if (mapping[row[column]]) {
        newRow[column] = mapping[row[column]];
      }
      return newRow;
    });
  }

  private featureEngineering(data: any[], newColumn: string, formula: string): any[] {
    return data.map(row => {
      const newRow = { ...row };
      try {
        // Simple formula parser - replace column names with values
        let evalFormula = formula;
        Object.keys(row).forEach(key => {
          const value = isNaN(parseFloat(row[key])) ? 0 : parseFloat(row[key]);
          evalFormula = evalFormula.replace(new RegExp(`\\b${key}\\b`, 'g'), value.toString());
        });
        
        // Basic safety check
        if (!/^[0-9\s+\-*/.()]+$/.test(evalFormula)) {
          throw new Error('Invalid formula');
        }
        
        newRow[newColumn] = Function(`"use strict"; return (${evalFormula})`)();
      } catch (error) {
        newRow[newColumn] = null;
      }
      return newRow;
    });
  }

  private oneHotEncoding(data: any[], columns: string[]): any[] {
    const uniqueValues: Record<string, Set<string>> = {};
    
    // Find unique values for each column
    columns.forEach(col => {
      uniqueValues[col] = new Set();
      data.forEach(row => {
        if (row[col] !== null && row[col] !== undefined) {
          uniqueValues[col].add(String(row[col]));
        }
      });
    });

    return data.map(row => {
      const newRow = { ...row };
      
      columns.forEach(col => {
        uniqueValues[col].forEach(value => {
          const newColName = `${col}_${value}`;
          newRow[newColName] = row[col] === value ? 1 : 0;
        });
        
        // Remove original column
        delete newRow[col];
      });
      
      return newRow;
    });
  }

  private groupByAggregation(
    data: any[], 
    groupByColumns: string[], 
    aggColumn: string, 
    aggFunction: string
  ): any[] {
    const groups: Record<string, any[]> = {};
    
    // Group data
    data.forEach(row => {
      const key = groupByColumns.map(col => row[col]).join('|');
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(row);
    });

    // Apply aggregation
    return Object.keys(groups).map(key => {
      const group = groups[key];
      const result: any = {};
      
      // Add group by columns
      groupByColumns.forEach((col, index) => {
        result[col] = key.split('|')[index];
      });
      
      // Apply aggregation function
      const values = group.map(row => parseFloat(row[aggColumn])).filter(v => !isNaN(v));
      
      switch (aggFunction) {
        case 'sum':
          result[`${aggColumn}_sum`] = values.reduce((a, b) => a + b, 0);
          break;
        case 'mean':
          result[`${aggColumn}_mean`] = values.reduce((a, b) => a + b, 0) / values.length;
          break;
        case 'median':
          const sorted = values.sort((a, b) => a - b);
          result[`${aggColumn}_median`] = sorted[Math.floor(sorted.length / 2)];
          break;
        case 'count':
          result[`${aggColumn}_count`] = group.length;
          break;
        case 'min':
          result[`${aggColumn}_min`] = Math.min(...values);
          break;
        case 'max':
          result[`${aggColumn}_max`] = Math.max(...values);
          break;
      }
      
      return result;
    });
  }

  private pivotTable(data: any[], indexColumn: string, columnsColumn: string, valuesColumn: string): any[] {
    const pivoted: Record<string, any> = {};
    
    data.forEach(row => {
      const indexValue = row[indexColumn];
      const columnValue = row[columnsColumn];
      const value = row[valuesColumn];
      
      if (!pivoted[indexValue]) {
        pivoted[indexValue] = { [indexColumn]: indexValue };
      }
      
      pivoted[indexValue][columnValue] = value;
    });
    
    return Object.values(pivoted);
  }

  private normalizeScale(data: any[], columns: string[], method: string): any[] {
    const stats: Record<string, { min: number; max: number; mean: number; std: number }> = {};
    
    // Calculate statistics
    columns.forEach(col => {
      const values = data.map(row => parseFloat(row[col])).filter(v => !isNaN(v));
      const min = Math.min(...values);
      const max = Math.max(...values);
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const std = Math.sqrt(values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length);
      
      stats[col] = { min, max, mean, std };
    });

    return data.map(row => {
      const newRow = { ...row };
      
      columns.forEach(col => {
        const value = parseFloat(row[col]);
        if (!isNaN(value)) {
          switch (method) {
            case 'minmax':
              newRow[col] = (value - stats[col].min) / (stats[col].max - stats[col].min);
              break;
            case 'standard':
              newRow[col] = (value - stats[col].mean) / stats[col].std;
              break;
            case 'robust':
              // Simplified robust scaling
              newRow[col] = (value - stats[col].mean) / (stats[col].max - stats[col].min);
              break;
          }
        }
      });
      
      return newRow;
    });
  }

  private regexReplace(data: any[], column: string, pattern: string, replacement: string): any[] {
    try {
      const regex = new RegExp(pattern, 'g');
      return data.map(row => {
        const newRow = { ...row };
        if (typeof row[column] === 'string') {
          newRow[column] = row[column].replace(regex, replacement);
        }
        return newRow;
      });
    } catch (error) {
      throw new Error('Invalid regex pattern');
    }
  }

  private generateQualityReport(data: any[]): DataQualityReport {
    if (data.length === 0) {
      return {
        nullCounts: {},
        duplicateRows: 0,
        dataTypes: {},
        outliers: {},
        uniqueValues: {}
      };
    }

    const columns = Object.keys(data[0]);
    const nullCounts: Record<string, number> = {};
    const dataTypes: Record<string, string> = {};
    const uniqueValues: Record<string, number> = {};
    const outliers: Record<string, number> = {};

    columns.forEach(col => {
      const values = data.map(row => row[col]);
      const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== '');
      
      nullCounts[col] = data.length - nonNullValues.length;
      uniqueValues[col] = new Set(nonNullValues).size;
      
      // Determine data type
      if (nonNullValues.length > 0) {
        const sample = nonNullValues[0];
        if (typeof sample === 'number') {
          dataTypes[col] = 'number';
        } else if (typeof sample === 'boolean') {
          dataTypes[col] = 'boolean';
        } else if (sample instanceof Date) {
          dataTypes[col] = 'date';
        } else {
          dataTypes[col] = 'string';
        }
      }
      
      // Simple outlier detection for numeric columns
      if (dataTypes[col] === 'number') {
        const numericValues = nonNullValues.map(v => parseFloat(v)).filter(v => !isNaN(v));
        if (numericValues.length > 0) {
          const sorted = numericValues.sort((a, b) => a - b);
          const q1 = sorted[Math.floor(sorted.length * 0.25)];
          const q3 = sorted[Math.floor(sorted.length * 0.75)];
          const iqr = q3 - q1;
          const lowerBound = q1 - 1.5 * iqr;
          const upperBound = q3 + 1.5 * iqr;
          
          outliers[col] = numericValues.filter(v => v < lowerBound || v > upperBound).length;
        }
      }
    });

    // Count duplicate rows
    const rowStrings = data.map(row => JSON.stringify(row));
    const uniqueRows = new Set(rowStrings);
    const duplicateRows = data.length - uniqueRows.size;

    return {
      nullCounts,
      duplicateRows,
      dataTypes,
      outliers,
      uniqueValues
    };
  }
}