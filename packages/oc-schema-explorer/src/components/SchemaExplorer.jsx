import React from 'react';
import { X, FileText, ArrowRight, Hash, Type, Layers, AlertCircle, Brackets, Braces, ToggleLeft, Split, Package, Lock } from 'lucide-react';
import { getSchemaType } from '../utils/schemaParser';

const typeIcons = {
  string: <Type className="w-4 h-4 text-green-500" />,
  number: <Hash className="w-4 h-4 text-blue-500" />,
  integer: <Hash className="w-4 h-4 text-blue-500" />,
  boolean: <ToggleLeft className="w-4 h-4 text-purple-500" />,
  array: <Brackets className="w-4 h-4 text-orange-500" />,
  object: <Braces className="w-4 h-4 text-indigo-500" />,
  enum: <Layers className="w-4 h-4 text-pink-500" />,
  const: <FileText className="w-4 h-4 text-teal-500" />,
  reference: <AlertCircle className="w-4 h-4 text-yellow-500" />,
  any: <AlertCircle className="w-4 h-4 text-gray-500" />,
};

const SchemaPane = ({ pane, onClose, onNavigate, depth, rootSchema, allPanes }) => {
  const { name, schema, path } = pane;
  const type = getSchemaType(schema);

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

  const handlePropertyClick = (key, value, newPath) => {
    // Always resolve references first
    let schemaToNavigate = value;
    let navigationName = key;
    
    if (value.$ref) {
      const resolved = resolveRef(value.$ref);
      if (resolved) {
        schemaToNavigate = resolved;
        const refName = value.$ref.split('/').pop();
        navigationName = `${key} → ${refName}`;
      }
    }
    
    const propType = getSchemaType(schemaToNavigate);
    
    // Navigate if it's a complex type
    if (propType === 'object' || propType === 'array' || 
        schemaToNavigate.oneOf || schemaToNavigate.anyOf || schemaToNavigate.allOf) {
      onNavigate({ name: navigationName, schema: schemaToNavigate, path: newPath }, depth);
    }
  };

  const renderPropertyRow = (key, value, propertyPath) => {
    // Resolve reference if present
    let resolvedValue = value;
    let refName = null;
    if (value.$ref) {
      const resolved = resolveRef(value.$ref);
      if (resolved) {
        resolvedValue = { ...resolved, $ref: value.$ref };
        refName = value.$ref.split('/').pop();
      }
    }
    
    const propType = getSchemaType(resolvedValue);
    const isClickable = propType === 'object' || propType === 'array' || 
                       resolvedValue.$ref || resolvedValue.oneOf || resolvedValue.anyOf || resolvedValue.allOf ||
                       (resolvedValue.items && (resolvedValue.items.$ref || getSchemaType(resolvedValue.items) === 'object'));
    const isRequired = schema.required && schema.required.includes(key);
    
    // Check if this property is in the navigation path to the next pane
    const nextPane = allPanes && allPanes[depth + 1];
    // The propertyPath looks like [...path, 'properties', key], so we need to check if this matches
    const isInPath = nextPane && nextPane.path && 
                     propertyPath.every((segment, idx) => nextPane.path[idx] === segment);

    return (
      <div
        key={key}
        className={`px-3 py-2 border-b border-gray-100 dark:border-gray-700 ${isClickable ? 'cursor-pointer' : ''} ${isInPath ? 'bg-blue-50 dark:bg-gray-600 hover:bg-blue-50 dark:hover:bg-gray-600' : isClickable ? 'hover:bg-gray-50 dark:hover:bg-gray-800' : ''}`}
        onClick={() => isClickable && handlePropertyClick(key, value, propertyPath)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {typeIcons[propType] || typeIcons.any}
            <span className="font-mono text-base dark:text-gray-200">{key}</span>
            {isRequired && <span className="text-sm text-red-500">*</span>}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">{propType}</span>
            {resolvedValue.const !== undefined && (
              <span className="text-xs text-teal-600 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span className="font-mono">{JSON.stringify(resolvedValue.const)}</span>
              </span>
            )}
            {refName && (
              <span className="text-sm text-blue-500 dark:text-blue-400">{refName}</span>
            )}
            {isClickable && <ArrowRight className="w-3 h-3 text-gray-400 dark:text-gray-500" />}
          </div>
        </div>
            {resolvedValue.enum && (
          <div className="flex flex-wrap gap-1 mt-1 ml-6">
            {resolvedValue.enum.map((value, index) => (
              <span 
                key={index} 
                className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded"
              >
                {JSON.stringify(value)}
              </span>
            ))}
          </div>
        )}
        {resolvedValue.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 ml-6">{resolvedValue.description}</p>
        )}
      </div>
    );
  };

  const renderConstraints = () => {
    const constraints = [];
    
    if (schema.minimum !== undefined) constraints.push(`min: ${schema.minimum}`);
    if (schema.maximum !== undefined) constraints.push(`max: ${schema.maximum}`);
    if (schema.minLength !== undefined) constraints.push(`minLength: ${schema.minLength}`);
    if (schema.maxLength !== undefined) constraints.push(`maxLength: ${schema.maxLength}`);
    if (schema.minItems !== undefined) constraints.push(`minItems: ${schema.minItems}`);
    if (schema.maxItems !== undefined) constraints.push(`maxItems: ${schema.maxItems}`);
    if (schema.uniqueItems) constraints.push('uniqueItems');
    if (schema.pattern) constraints.push(`pattern: ${schema.pattern}`);
    if (schema.format) constraints.push(`format: ${schema.format}`);
    
    return constraints;
  };

  return (
    <div
      data-pane
      className="flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col"
      style={{ 
        width: '384px', // 24rem = 384px
        minWidth: '384px',
        marginLeft: depth > 0 ? '-1px' : '0' 
      }}
    >
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {depth === 0 ? <Package className="w-4 h-4 text-indigo-500" /> : (typeIcons[type] || typeIcons.any)}
          <h3 className="font-semibold text-base truncate dark:text-gray-200">{name}</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded flex-shrink-0">{type}</span>
        </div>
        {depth > 0 && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors ml-2"
          >
            <X className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {schema.title && (
          <div className="px-4 py-3 border-t border-b border-gray-200 dark:border-gray-600">
            <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Title</h4>
            <p className="text-base dark:text-gray-200">{schema.title}</p>
          </div>
        )}

        {schema.description && (
          <div className={`px-4 py-3 border-b border-gray-100 dark:border-gray-700 ${!schema.title ? 'border-t border-gray-200 dark:border-gray-600' : ''}`}>
            <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Description</h4>
            <p className="text-base text-gray-700 dark:text-gray-300">{schema.description}</p>
          </div>
        )}


        {type === 'object' && schema.properties && Object.keys(schema.properties).length > 0 && (
          <div>
            <div className={`px-4 py-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 ${!schema.title && !schema.description ? 'border-t border-gray-200 dark:border-gray-600' : ''}`}>
              <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400">Properties</h4>
            </div>
            {Object.entries(schema.properties).map(([key, value]) => 
              renderPropertyRow(key, value, [...path, 'properties', key])
            )}
          </div>
        )}

        {type === 'array' && schema.items && (
          <div className={`px-4 py-3 border-b border-gray-100 dark:border-gray-700 ${!schema.title && !schema.description ? 'border-t border-gray-200 dark:border-gray-600' : ''}`}>
            <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Array Items</h4>
            {(() => {
              const itemsType = getSchemaType(schema.items);
              const hasOneOf = schema.items.oneOf;
              const hasAnyOf = schema.items.anyOf;
              const hasAllOf = schema.items.allOf;
              const isClickable = schema.items.$ref || itemsType === 'object' || hasOneOf || hasAnyOf || hasAllOf;
              
              if (!isClickable) {
                return <span className="text-base text-gray-600 dark:text-gray-300">Type: {itemsType}</span>;
              }
              
              return (
                <div
                  className="flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded"
                  onClick={() => {
                    if (schema.items.$ref) {
                      const resolved = resolveRef(schema.items.$ref);
                      if (resolved) {
                        const refName = schema.items.$ref.split('/').pop();
                        onNavigate({ name: `[items] → ${refName}`, schema: resolved, path: [...path, 'items'], ref: schema.items.$ref }, depth);
                      }
                    } else {
                      onNavigate({ name: '[items]', schema: schema.items, path: [...path, 'items'] }, depth);
                    }
                  }}
                >
                  <span className="text-base dark:text-gray-200">
                    Item Type: {
                      schema.items.$ref ? schema.items.$ref.split('/').pop() :
                      hasOneOf ? 'oneOf' :
                      hasAnyOf ? 'anyOf' :
                      hasAllOf ? 'allOf' :
                      itemsType
                    }
                  </span>
                  <ArrowRight className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                </div>
              );
            })()}
          </div>
        )}

        {schema.enum && (
          <div className={`px-4 py-3 border-b border-gray-100 dark:border-gray-700 ${!schema.title && !schema.description && !(type === 'object' && schema.properties) && !(type === 'array' && schema.items) ? 'border-t border-gray-200 dark:border-gray-600' : ''}`}>
            <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Enum Values</h4>
            <div className="space-y-1">
              {schema.enum.map((value, index) => (
                <div key={index} className="text-base bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono dark:text-gray-200">
                  {JSON.stringify(value)}
                </div>
              ))}
            </div>
          </div>
        )}

        {schema.const !== undefined && (
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Constant Value</h4>
            <div className="text-base bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono dark:text-gray-200">
              {JSON.stringify(schema.const)}
            </div>
          </div>
        )}

        {schema.default !== undefined && (
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Default Value</h4>
            <div className="text-base bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono dark:text-gray-200">
              {JSON.stringify(schema.default)}
            </div>
          </div>
        )}

        {renderConstraints().length > 0 && (
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Constraints</h4>
            <div className="flex flex-wrap gap-2">
              {renderConstraints().map((constraint, index) => (
                <span key={index} className="text-sm bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                  {constraint}
                </span>
              ))}
            </div>
          </div>
        )}

        {schema.oneOf && (
          <div>
            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <Split className="w-4 h-4" />
                One Of
              </h4>
            </div>
            {schema.oneOf.map((item, index) => {
              const itemPath = [...path, 'oneOf', index];
              const nextPane = allPanes && allPanes[depth + 1];
              const isInPath = nextPane && nextPane.path && 
                               itemPath.every((segment, idx) => nextPane.path[idx] === segment);
              return (
              <div
                key={index}
                className={`px-3 py-2 border-b border-gray-100 dark:border-gray-700 cursor-pointer ${isInPath ? 'bg-blue-50 dark:bg-gray-600 hover:bg-blue-50 dark:hover:bg-gray-600' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                onClick={() => {
                  if (item.$ref) {
                    const resolved = resolveRef(item.$ref);
                    if (resolved) {
                      const refName = item.$ref.split('/').pop();
                      onNavigate({ name: `${name} → oneOf[${index}] → ${refName}`, schema: resolved, path: [...path, 'oneOf', index], ref: item.$ref }, depth);
                    }
                  } else {
                    onNavigate({ name: `${name} → oneOf[${index}]`, schema: item, path: [...path, 'oneOf', index] }, depth);
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {typeIcons[getSchemaType(item)] || typeIcons.any}
                    <span className="text-base dark:text-gray-200">
                      Option {index + 1}: {item.type || (item.$ref ? item.$ref.split('/').pop() : 'Schema')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.title && <span className="text-sm text-gray-500 dark:text-gray-400">{item.title}</span>}
                    <ArrowRight className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                  </div>
                </div>
                {item.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 ml-6">{item.description}</p>
                )}
              </div>
              );
            })}
          </div>
        )}

        {schema.anyOf && (
          <div>
            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <Split className="w-4 h-4" />
                Any Of
              </h4>
            </div>
            {schema.anyOf.map((item, index) => {
              const itemPath = [...path, 'anyOf', index];
              const nextPane = allPanes && allPanes[depth + 1];
              const isInPath = nextPane && nextPane.path && 
                               itemPath.every((segment, idx) => nextPane.path[idx] === segment);
              return (
              <div
                key={index}
                className={`px-3 py-2 border-b border-gray-100 dark:border-gray-700 cursor-pointer ${isInPath ? 'bg-blue-50 dark:bg-gray-600 hover:bg-blue-50 dark:hover:bg-gray-600' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                onClick={() => {
                  if (item.$ref) {
                    const resolved = resolveRef(item.$ref);
                    if (resolved) {
                      const refName = item.$ref.split('/').pop();
                      onNavigate({ name: `${name} → anyOf[${index}] → ${refName}`, schema: resolved, path: [...path, 'anyOf', index], ref: item.$ref }, depth);
                    }
                  } else {
                    onNavigate({ name: `${name} → anyOf[${index}]`, schema: item, path: [...path, 'anyOf', index] }, depth);
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {typeIcons[getSchemaType(item)] || typeIcons.any}
                    <span className="text-base dark:text-gray-200">
                      Option {index + 1}: {item.type || (item.$ref ? item.$ref.split('/').pop() : 'Schema')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.title && <span className="text-sm text-gray-500 dark:text-gray-400">{item.title}</span>}
                    <ArrowRight className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                  </div>
                </div>
                {item.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 ml-6">{item.description}</p>
                )}
              </div>
              );
            })}
          </div>
        )}

        {schema.allOf && (
          <div>
            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <Split className="w-4 h-4" />
                All Of
              </h4>
            </div>
            {schema.allOf.map((item, index) => {
              const itemPath = [...path, 'allOf', index];
              const nextPane = allPanes && allPanes[depth + 1];
              const isInPath = nextPane && nextPane.path && 
                               itemPath.every((segment, idx) => nextPane.path[idx] === segment);
              return (
              <div
                key={index}
                className={`px-3 py-2 border-b border-gray-100 dark:border-gray-700 cursor-pointer ${isInPath ? 'bg-blue-50 dark:bg-gray-600 hover:bg-blue-50 dark:hover:bg-gray-600' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                onClick={() => {
                  if (item.$ref) {
                    const resolved = resolveRef(item.$ref);
                    if (resolved) {
                      const refName = item.$ref.split('/').pop();
                      onNavigate({ name: `${name} → allOf[${index}] → ${refName}`, schema: resolved, path: [...path, 'allOf', index], ref: item.$ref }, depth);
                    }
                  } else {
                    onNavigate({ name: `${name} → allOf[${index}]`, schema: item, path: [...path, 'allOf', index] }, depth);
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {typeIcons[getSchemaType(item)] || typeIcons.any}
                    <span className="text-base dark:text-gray-200">
                      Schema {index + 1}: {item.type || (item.$ref ? item.$ref.split('/').pop() : 'Schema')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.title && <span className="text-sm text-gray-500 dark:text-gray-400">{item.title}</span>}
                    <ArrowRight className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                  </div>
                </div>
                {item.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 ml-6">{item.description}</p>
                )}
              </div>
              );
            })}
          </div>
        )}


      </div>
    </div>
  );
};

const SchemaExplorer = ({ schema, rootSchema }) => {
  const [panes, setPanes] = React.useState([
    { name: 'root', schema, path: [], depth: 0 }
  ]);
  const scrollContainerRef = React.useRef(null);
  const previousPaneCountRef = React.useRef(1);

  // Handle scrolling when panes change
  React.useEffect(() => {
    if (panes.length > previousPaneCountRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      
      // Scroll to show the new pane
      const scrollToEnd = () => {
        container.scrollTo({
          left: container.scrollWidth,
          behavior: 'smooth'
        });
      };

      // Try scrolling with a small delay to ensure DOM is updated
      setTimeout(scrollToEnd, 0);
    }
    
    previousPaneCountRef.current = panes.length;
  }, [panes.length]);

  const handleNavigate = (newPane, fromDepth) => {
    // Remove all panes after the current depth and add the new one
    setPanes(prev => {
      const newPanes = prev.slice(0, fromDepth + 1);
      return [...newPanes, { ...newPane, depth: fromDepth + 1 }];
    });
  };

  const handleClose = (index) => {
    if (index === 0) return; // Can't close root
    setPanes(prev => prev.slice(0, index));
  };

  const handleBreadcrumbClick = (index) => {
    setPanes(prev => prev.slice(0, index + 1));
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Breadcrumb Navigation */}
      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2 overflow-x-auto flex-shrink-0 whitespace-nowrap">
        {panes.map((pane, index) => (
          <React.Fragment key={index}>
            {index > 0 && <span className="text-gray-400 dark:text-gray-500 flex-shrink-0">/</span>}
            <button
              onClick={() => handleBreadcrumbClick(index)}
              className={`text-base hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex-shrink-0 ${
                index === panes.length - 1 ? 'text-gray-900 dark:text-gray-100 font-semibold' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {pane.name}
            </button>
          </React.Fragment>
        ))}
      </div>
      
      {/* Panes */}
      <div 
        ref={scrollContainerRef}
        className="flex flex-1 overflow-x-auto overflow-y-hidden min-w-0"
        style={{ maxWidth: '100%' }}
      >
        {panes.map((pane, index) => (
          <SchemaPane
            key={`${pane.path.join('.')}-${index}`}
            pane={pane}
            onClose={() => handleClose(index)}
            onNavigate={handleNavigate}
            depth={index}
            rootSchema={rootSchema || schema}
            allPanes={panes}
          />
        ))}
      </div>
    </div>
  );
};

export default SchemaExplorer;