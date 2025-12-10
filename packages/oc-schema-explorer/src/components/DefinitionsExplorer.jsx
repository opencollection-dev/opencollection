import React from 'react';
import { X, FileText, ArrowRight, Split } from 'lucide-react';
import { getSchemaType } from '../utils/schemaParser';

const DefinitionPane = ({ definition, onClose, onNavigate, depth, allDefinitions }) => {
  const { name, schema } = definition;
  const type = getSchemaType(schema);

  const renderPropertyRow = (key, value, path) => {
    const propType = getSchemaType(value);
    const isRef = value.$ref;
    const isRequired = schema.required && schema.required.includes(key);
    
    // Check if this property is in the navigation path to the next definition
    const nextDef = allDefinitions && allDefinitions[depth + 1];
    const isInPath = nextDef && nextDef.path && nextDef.path[depth] === key;

    return (
      <div
        key={key}
        className={`px-3 py-2 border-b border-gray-100 dark:border-gray-700 ${isRef ? 'cursor-pointer' : ''} ${isInPath ? 'bg-blue-50 dark:bg-gray-600 hover:bg-blue-50 dark:hover:bg-gray-600' : isRef ? 'hover:bg-gray-50 dark:hover:bg-gray-700' : ''}`}
        onClick={() => isRef && onNavigate(value.$ref, [...path, key])}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm dark:text-gray-200">{key}</span>
            {isRequired && <span className="text-xs text-red-500">*</span>}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">{propType}</span>
            {isRef && (
              <>
                <span className="text-xs text-blue-500 dark:text-blue-400">{value.$ref.split('/').pop()}</span>
                <ArrowRight className="w-3 h-3 text-blue-500 dark:text-blue-400" />
              </>
            )}
          </div>
        </div>
        {value.enum && (
          <div className="flex flex-wrap gap-1 mt-1">
            {value.enum.map((enumValue, index) => (
              <span 
                key={index} 
                className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded"
              >
                {JSON.stringify(enumValue)}
              </span>
            ))}
          </div>
        )}
        {value.description && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{value.description}</p>
        )}
      </div>
    );
  };

  return (
    <div
      className="flex-shrink-0 w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col"
      style={{ marginLeft: depth > 0 ? '-1px' : '0' }}
    >
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <h3 className="font-semibold text-sm dark:text-gray-200">{name}</h3>
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded">{type}</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
        >
          <X className="w-4 h-4 text-gray-400 dark:text-gray-500" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {schema.title && (
          <div className="px-4 py-3 border-t border-b border-gray-200 dark:border-gray-600">
            <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Title</h4>
            <p className="text-sm dark:text-gray-200">{schema.title}</p>
          </div>
        )}

        {schema.description && (
          <div className={`px-4 py-3 border-b border-gray-100 dark:border-gray-700 ${!schema.title ? 'border-t border-gray-200 dark:border-gray-600' : ''}`}>
            <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Description</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">{schema.description}</p>
          </div>
        )}

        {schema.properties && Object.keys(schema.properties).length > 0 && (
          <div>
            <div className={`px-4 py-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 ${!schema.title && !schema.description ? 'border-t border-gray-200 dark:border-gray-600' : ''}`}>
              <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400">Properties</h4>
            </div>
            {Object.entries(schema.properties).map(([key, value]) => 
              renderPropertyRow(key, value, [name, 'properties'])
            )}
          </div>
        )}

        {schema.enum && (
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Enum Values</h4>
            <div className="space-y-1">
              {schema.enum.map((value, index) => (
                <div key={index} className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono dark:text-gray-200">
                  {JSON.stringify(value)}
                </div>
              ))}
            </div>
          </div>
        )}

        {schema.oneOf && (
          <div>
            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <Split className="w-3 h-3" />
                One Of
              </h4>
            </div>
            {schema.oneOf.map((item, index) => (
              <div
                key={index}
                className="px-3 py-2 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => item.$ref && onNavigate(item.$ref, [name, 'oneOf', index])}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm dark:text-gray-200">Option {index + 1}</span>
                  {item.$ref && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-blue-500 dark:text-blue-400">{item.$ref.split('/').pop()}</span>
                      <ArrowRight className="w-3 h-3 text-blue-500 dark:text-blue-400" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {schema.items && (
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Array Items</h4>
            {schema.items.$ref ? (
              <div
                className="flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded"
                onClick={() => onNavigate(schema.items.$ref, [name, 'items'])}
              >
                <span className="text-sm dark:text-gray-200">Item Type</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-blue-500 dark:text-blue-400">{schema.items.$ref.split('/').pop()}</span>
                  <ArrowRight className="w-3 h-3 text-blue-500 dark:text-blue-400" />
                </div>
              </div>
            ) : (
              <span className="text-sm text-gray-600 dark:text-gray-300">Type: {getSchemaType(schema.items)}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const DefinitionsExplorer = ({ definitions, rootSchema, onUpdate }) => {
  if (!definitions || definitions.length === 0) return null;

  const resolveRef = (ref) => {
    if (!ref || !ref.startsWith('#')) return null;
    
    const parts = ref.split('/').slice(1);
    let current = rootSchema;
    
    for (const part of parts) {
      if (current && typeof current === 'object') {
        current = current[part];
      } else {
        return null;
      }
    }
    
    return current;
  };

  const handleNavigate = (ref, path) => {
    const resolved = resolveRef(ref);
    if (resolved) {
      const defName = ref.split('/').pop();
      onUpdate([...definitions, { name: defName, schema: resolved, ref, path }]);
    }
  };

  const handleClose = (index) => {
    const newDefs = [...definitions];
    newDefs.splice(index, 1);
    onUpdate(newDefs);
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      {definitions.map((def, index) => (
        <DefinitionPane
          key={`${def.ref}-${index}`}
          definition={def}
          onClose={() => handleClose(index)}
          onNavigate={handleNavigate}
          depth={index}
          allDefinitions={definitions}
        />
      ))}
    </div>
  );
};

export default DefinitionsExplorer;