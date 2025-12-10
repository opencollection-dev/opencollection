import React, { useState, useCallback, useEffect } from 'react';
import { ChevronRight, ChevronDown, Hash, Type, Layers, FileText, AlertCircle, Brackets, Braces, ToggleLeft, Package } from 'lucide-react';
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

const SchemaNode = ({ name, schema, level = 0, onSelect, selected, searchTerm = '' }) => {
  const [expanded, setExpanded] = useState(level === 0);
  const type = getSchemaType(schema);
  const hasChildren = schema.properties || schema.items || schema.oneOf || schema.anyOf || schema.allOf || schema.definitions;
  
  const isMatch = searchTerm && name.toLowerCase().includes(searchTerm.toLowerCase());
  
  // Auto-expand when searching and there's a match in children
  useEffect(() => {
    if (searchTerm && hasChildren) {
      const hasMatchingChild = () => {
        if (schema.properties) {
          return Object.keys(schema.properties).some(key => 
            key.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        return false;
      };
      
      if (hasMatchingChild()) {
        setExpanded(true);
      }
    } else if (!searchTerm && level > 0) {
      setExpanded(false);
    }
  }, [searchTerm, hasChildren, schema.properties, level]);
  
  const handleClick = useCallback((e) => {
    e.stopPropagation();
    if (hasChildren) {
      setExpanded(!expanded);
    }
    onSelect({ name, schema, path: schema.path });
  }, [expanded, hasChildren, name, schema, onSelect]);

  const renderChildren = () => {
    const children = [];
    
    // For root level, only show properties (not definitions, etc.)
    if (level === 0 && schema.properties) {
      Object.entries(schema.properties).forEach(([key, value]) => {
        const isRequired = schema.required && schema.required.includes(key);
        children.push(
          <SchemaNode
            key={`prop-${key}`}
            name={key}
            schema={{ ...value, _isRequired: isRequired }}
            level={level + 1}
            onSelect={onSelect}
            selected={selected}
            searchTerm={searchTerm}
          />
        );
      });
      return children;
    }
    
    // For non-root levels, show all relevant children
    if (schema.properties) {
      Object.entries(schema.properties).forEach(([key, value]) => {
        const isRequired = schema.required && schema.required.includes(key);
        children.push(
          <SchemaNode
            key={`prop-${key}`}
            name={key}
            schema={{ ...value, _isRequired: isRequired }}
            level={level + 1}
            onSelect={onSelect}
            selected={selected}
            searchTerm={searchTerm}
          />
        );
      });
    }
    
    if (schema.items) {
      if (Array.isArray(schema.items)) {
        schema.items.forEach((item, index) => {
          children.push(
            <SchemaNode
              key={`item-${index}`}
              name={`[${index}]`}
              schema={item}
              level={level + 1}
              onSelect={onSelect}
              selected={selected}
              searchTerm={searchTerm}
            />
          );
        });
      } else {
        children.push(
          <SchemaNode
            key="items"
            name="[items]"
            schema={schema.items}
            level={level + 1}
            onSelect={onSelect}
            selected={selected}
            searchTerm={searchTerm}
          />
        );
      }
    }
    
    if (schema.oneOf) {
      schema.oneOf.forEach((item, index) => {
        children.push(
          <SchemaNode
            key={`oneOf-${index}`}
            name={`oneOf[${index}]`}
            schema={item}
            level={level + 1}
            onSelect={onSelect}
            selected={selected}
            searchTerm={searchTerm}
          />
        );
      });
    }
    
    if (schema.anyOf) {
      schema.anyOf.forEach((item, index) => {
        children.push(
          <SchemaNode
            key={`anyOf-${index}`}
            name={`anyOf[${index}]`}
            schema={item}
            level={level + 1}
            onSelect={onSelect}
            selected={selected}
            searchTerm={searchTerm}
          />
        );
      });
    }
    
    if (schema.allOf) {
      schema.allOf.forEach((item, index) => {
        children.push(
          <SchemaNode
            key={`allOf-${index}`}
            name={`allOf[${index}]`}
            schema={item}
            level={level + 1}
            onSelect={onSelect}
            selected={selected}
            searchTerm={searchTerm}
          />
        );
      });
    }
    
    return children;
  };

  const isSelected = selected?.path?.join('.') === schema.path?.join('.');

  return (
    <div className="select-none">
      <div>
        <div
          className={`
            flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded
            ${isSelected ? 'bg-blue-50 dark:bg-gray-600' : ''}
            ${isMatch ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''}
          `}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
          onClick={handleClick}
        >
          {hasChildren && (
            <span className="text-gray-500">
              {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </span>
          )}
          {!hasChildren && <span className="w-4" />}
          
          {level === 0 && name === 'root' ? <Package className="w-4 h-4 text-indigo-500" /> : (typeIcons[type] || typeIcons.any)}
          
          <span className={`font-mono text-sm ${isMatch ? 'font-semibold text-yellow-600 dark:text-yellow-400' : ''}`}>
            {name}
          </span>
          
          {schema.type && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {schema.type}
            </span>
          )}
          
          {schema.$ref && (
            <span className="text-xs text-blue-500 dark:text-blue-400">
              {schema.$ref}
            </span>
          )}
          
          {schema._isRequired && (
            <span className="text-xs text-red-500">*</span>
          )}
        </div>
        
        {schema.enum && (
          <div 
            className="flex flex-wrap gap-1 mt-1 mb-1"
            style={{ paddingLeft: `${level * 20 + 8 + 20}px` }}
          >
            {schema.enum.map((value, index) => (
              <span 
                key={index} 
                className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded"
              >
                {JSON.stringify(value)}
              </span>
            ))}
          </div>
        )}
      </div>
      
      {expanded && hasChildren && (
        <div className="ml-2">
          {renderChildren()}
        </div>
      )}
    </div>
  );
};

const SchemaTree = ({ schema, onSelect, selected, searchTerm }) => {
  if (!schema) return null;
  
  return (
    <div className="font-mono text-sm overflow-auto">
      <SchemaNode
        name="root"
        schema={schema}
        onSelect={onSelect}
        selected={selected}
        searchTerm={searchTerm}
      />
    </div>
  );
};

export default SchemaTree;