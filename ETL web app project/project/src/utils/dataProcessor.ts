import Papa from 'papaparse';

export interface ProcessedData {
  sessionId: string;
  preview: any[];
  totalRows: number;
  columns: string[];
  transformations: string[];
  data: any[];
}

export class DataProcessor {
  private static instance: DataProcessor;
  private sessions: Map<string, ProcessedData> = new Map();

  static getInstance(): DataProcessor {
    if (!DataProcessor.instance) {
      DataProcessor.instance = new DataProcessor();
    }
    return DataProcessor.instance;
  }

  generateSessionId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  async processCSV(file: File): Promise<ProcessedData> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const sessionId = this.generateSessionId();
          const data = results.data as any[];
          
          const processedData: ProcessedData = {
            sessionId,
            preview: data.slice(0, 10),
            totalRows: data.length,
            columns: Object.keys(data[0] || {}),
            transformations: [],
            data
          };

          this.sessions.set(sessionId, processedData);
          resolve(processedData);
        },
        error: (error) => {
          reject(new Error(`CSV parsing failed: ${error.message}`));
        }
      });
    });
  }

  async processJSON(file: File): Promise<ProcessedData> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target?.result as string);
          const data = Array.isArray(jsonData) ? jsonData : [jsonData];
          const sessionId = this.generateSessionId();

          const processedData: ProcessedData = {
            sessionId,
            preview: data.slice(0, 10),
            totalRows: data.length,
            columns: Object.keys(data[0] || {}),
            transformations: [],
            data
          };

          this.sessions.set(sessionId, processedData);
          resolve(processedData);
        } catch (error) {
          reject(new Error('Invalid JSON format'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  async fetchFromAPI(url: string): Promise<ProcessedData> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const jsonData = await response.json();
      const data = Array.isArray(jsonData) ? jsonData : [jsonData];
      const sessionId = this.generateSessionId();

      const processedData: ProcessedData = {
        sessionId,
        preview: data.slice(0, 10),
        totalRows: data.length,
        columns: Object.keys(data[0] || {}),
        transformations: [],
        data
      };

      this.sessions.set(sessionId, processedData);
      return processedData;
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  getSession(sessionId: string): ProcessedData | null {
    return this.sessions.get(sessionId) || null;
  }

  applyTransformation(sessionId: string, transformation: string): ProcessedData {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    let transformedData = [...session.data];
    let transformationName = '';

    switch (transformation) {
      case 'clean_columns':
        transformedData = this.cleanColumnNames(transformedData);
        transformedData = this.removeDuplicates(transformedData);
        transformationName = 'Clean column names & remove duplicates';
        break;
      
      case 'handle_missing':
        transformedData = this.handleMissingData(transformedData);
        transformationName = 'Handle missing data';
        break;
      
      case 'convert_types':
        transformedData = this.convertDataTypes(transformedData);
        transformationName = 'Convert data types';
        break;
      
      default:
        throw new Error('Unknown transformation');
    }

    const updatedSession: ProcessedData = {
      ...session,
      data: transformedData,
      preview: transformedData.slice(0, 10),
      totalRows: transformedData.length,
      columns: Object.keys(transformedData[0] || {}),
      transformations: [...session.transformations, transformationName]
    };

    this.sessions.set(sessionId, updatedSession);
    return updatedSession;
  }

  private cleanColumnNames(data: any[]): any[] {
    if (!data || data.length === 0) return data;
    
    return data.map(row => {
      const cleanedRow: any = {};
      Object.keys(row).forEach(key => {
        const cleanKey = key.toLowerCase().trim().replace(/\s+/g, '_');
        cleanedRow[cleanKey] = row[key];
      });
      return cleanedRow;
    });
  }

  private removeDuplicates(data: any[]): any[] {
    const seen = new Set();
    return data.filter(row => {
      const key = JSON.stringify(row);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  private handleMissingData(data: any[]): any[] {
    return data.filter(row => {
      return Object.values(row).every(value => 
        value !== '' && value !== null && value !== undefined
      );
    });
  }

  private convertDataTypes(data: any[]): any[] {
    return data.map(row => {
      const converted: any = {};
      Object.entries(row).forEach(([key, value]) => {
        // Try to convert to number
        if (typeof value === 'string' && !isNaN(Number(value)) && !isNaN(parseFloat(value)) && value !== '') {
          converted[key] = parseFloat(value);
        } else {
          converted[key] = value;
        }
      });
      return converted;
    });
  }

  downloadData(sessionId: string, format: 'json' | 'csv'): void {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    let content: string;
    let mimeType: string;
    let filename: string;

    if (format === 'csv') {
      content = this.convertToCSV(session.data);
      mimeType = 'text/csv';
      filename = 'processed_data.csv';
    } else {
      content = JSON.stringify(session.data, null, 2);
      mimeType = 'application/json';
      filename = 'processed_data.json';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  private convertToCSV(data: any[]): string {
    if (!data || data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];
    
    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header];
        return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
      });
      csvRows.push(values.join(','));
    });
    
    return csvRows.join('\n');
  }
}