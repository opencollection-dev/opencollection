import React from 'react';
import { Info, AlertCircle, FileText, Hash, Type, List, Package, Layers, ExternalLink } from 'lucide-react';
import { getSchemaType } from '../utils/schemaParser';

const PropertyDetails = ({ selected, onOpenDefinition }) => {
  if (!selected || !selected.schema) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        <p>Select a property to view details</p>
      </div>
    );
  }

  const { name, schema } = selected;
  const type = getSchemaType(schema);

  const renderValue = (value) => {
    if (value === undefined || value === null) return 'null';
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
  };

  const renderConstraints = () => {
    const constraints = [];
    
    if (schema.minimum !== undefined) constraints.push(`min: ${schema.minimum}`);
    if (schema.maximum !== undefined) constraints.push(`max: ${schema.maximum}`);
    if (schema.minLength !== undefined) constraints.push(`minLength: ${schema.minLength}`);
    if (schema.maxLength !== undefined) constraints.push(`maxLength: ${schema.maxLength}`);
    if (schema.minItems !== undefined) constraints.push(`minItems: ${schema.minItems}`);
    if (schema.maxItems !== undefined) constraints.push(`maxItems: ${schema.maxItems}`);
    if (schema.minProperties !== undefined) constraints.push(`minProperties: ${schema.minProperties}`);
    if (schema.maxProperties !== undefined) constraints.push(`maxProperties: ${schema.maxProperties}`);
    if (schema.uniqueItems) constraints.push('uniqueItems');
    if (schema.pattern) constraints.push(`pattern: ${schema.pattern}`);
    if (schema.format) constraints.push(`format: ${schema.format}`);
    
    return constraints;
  };

  return (
    <div className="p-4 space-y-4 overflow-auto bg-white dark:bg-gray-800 h-full">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold flex items-center gap-2 dark:text-gray-200">
          <FileText className="w-5 h-5" />
          {name}
        </h2>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Type:</span>
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-gray-600 text-blue-800 dark:text-blue-200 rounded text-sm">
            {type}
          </span>
        </div>
      </div>

      {schema.title && (
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">Title</h3>
          <p className="text-sm dark:text-gray-200">{schema.title}</p>
        </div>
      )}

      {schema.description && (
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1">
            <Info className="w-4 h-4" />
            Description
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">{schema.description}</p>
        </div>
      )}

      {schema.$ref && (
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">Reference</h3>
          <button
            onClick={() => onOpenDefinition && onOpenDefinition(schema.$ref, name)}
            className="inline-flex items-center gap-2 text-sm bg-blue-50 dark:bg-gray-600 hover:bg-blue-100 dark:hover:bg-gray-500 text-blue-700 dark:text-blue-200 px-3 py-1.5 rounded transition-colors"
          >
            <code>{schema.$ref}</code>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      )}

      {schema.enum && (
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">Enum Values</h3>
          <div className="space-y-1">
            {schema.enum.map((value, index) => (
              <div key={index} className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono dark:text-gray-200">
                {renderValue(value)}
              </div>
            ))}
          </div>
        </div>
      )}

      {schema.const !== undefined && (
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">Constant Value</h3>
          <div className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono dark:text-gray-200">
            {renderValue(schema.const)}
          </div>
        </div>
      )}

      {schema.default !== undefined && (
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">Default Value</h3>
          <div className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono dark:text-gray-200">
            {renderValue(schema.default)}
          </div>
        </div>
      )}

      {renderConstraints().length > 0 && (
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            Constraints
          </h3>
          <div className="flex flex-wrap gap-2">
            {renderConstraints().map((constraint, index) => (
              <span key={index} className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                {constraint}
              </span>
            ))}
          </div>
        </div>
      )}

      {schema.required && schema.required.length > 0 && (
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">Required Properties</h3>
          <div className="flex flex-wrap gap-2">
            {schema.required.map((prop, index) => (
              <span key={index} className="text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded">
                {prop}
              </span>
            ))}
          </div>
        </div>
      )}



      {schema.examples && schema.examples.length > 0 && (
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">Examples</h3>
          <div className="space-y-2">
            {schema.examples.map((ex, index) => (
              <pre key={index} className="text-sm bg-gray-100 dark:bg-gray-700 p-2 rounded overflow-auto dark:text-gray-200">
                {typeof ex === 'object' ? JSON.stringify(ex, null, 2) : renderValue(ex)}
              </pre>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;