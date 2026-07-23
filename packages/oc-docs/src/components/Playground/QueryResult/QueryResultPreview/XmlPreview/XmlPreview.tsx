import React, { useState, useMemo } from 'react';
import ErrorBanner from '../../../../../ui/ErrorBanner/ErrorBanner';
import { StyledWrapper } from './StyledWrapper';

/** Recursive shape produced by parsing an XML string into a JS object. */
export type XmlValue = string | number | null | XmlObject | XmlValue[];
export interface XmlObject {
  [key: string]: XmlValue;
}

export interface XmlPreviewProps {
  /** The XML content to preview. Must be an XML string. */
  data: unknown;
  defaultExpanded?: boolean;
}

// The expected "data" prop must be an XML string.
export default function XmlPreview({ data, defaultExpanded = true }: XmlPreviewProps) {
  const parsed = useMemo<{ value: XmlObject | null; error: string | null }>(() => {
    if (typeof data !== 'string') {
      return { value: null, error: 'Invalid input. Expected an XML string.' };
    }
    const result = parseXMLString(data);
    if (result === null) {
      return { value: null, error: 'Failed to parse XML string. Invalid XML format.' };
    }
    return { value: result, error: null };
  }, [data]);

  if (parsed.error) {
    return (
      <div className="px-2">
        <ErrorBanner title="Cannot preview as XML" message={parsed.error} />
      </div>
    );
  }

  const parsedData = parsed.value;

  if (parsedData === null) {
    return (
      <div className="px-2">
        <ErrorBanner
          title="Cannot preview as XML"
          message="Data cannot be rendered as a tree. Expected a valid XML string."
        />
      </div>
    );
  }

  // If root is an object with a single key, unwrap it to show the actual root element.
  let rootNode: XmlValue = parsedData;
  let rootNodeName = '';

  const keys = Object.keys(parsedData).filter((k) => k !== '$' && k !== '@_' && k !== '#text');
  if (keys.length === 1) {
    rootNodeName = keys[0];
    rootNode = parsedData[keys[0]];
  } else if (keys.length === 0) {
    return (
      <div className="px-2">
        <ErrorBanner title="Cannot preview as XML" message="Cannot render XML tree. Root object is empty." />
      </div>
    );
  }

  return (
    <StyledWrapper>
      <div className="xml-container">
        <XmlNode node={rootNode} nodeName={rootNodeName} defaultExpanded={defaultExpanded} />
      </div>
    </StyledWrapper>
  );
}

interface XmlArrayNodeProps {
  arrayKey: string;
  items: XmlValue[];
  depth: number;
  defaultExpanded?: boolean;
}

// Component for rendering array entries with expand/collapse functionality.
const XmlArrayNode: React.FC<XmlArrayNodeProps> = ({ arrayKey, items, depth, defaultExpanded = true }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded((v) => !v);
  };

  return (
    <div style={{ paddingLeft: `${(depth + 1) * 20}px` }}>
      <div className="flex items-center mb-1">
        <button onClick={toggle} className="xml-array-toggle-button" tabIndex={-1} aria-expanded={expanded}>
          {expanded ? '▼' : '▶'}
        </button>
        <span className="xml-node-name">{arrayKey}</span>
        <span className="xml-count">[{items.length}]</span>
      </div>
      {expanded && (
        <div className="array-content">
          {items.map((item, itemIdx) => (
            <XmlNode
              key={`${arrayKey}-${itemIdx}`}
              node={item}
              nodeName={`${itemIdx}`}
              defaultExpanded={false}
              depth={depth + 2}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface XmlNodeProps {
  node: XmlValue;
  nodeName?: string;
  defaultExpanded?: boolean;
  depth?: number;
}

const XmlNode: React.FC<XmlNodeProps> = ({ node, nodeName = '', defaultExpanded = true, depth = 0 }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  let displayNodeName = nodeName;

  if (Array.isArray(node)) {
    // For repeated XML elements with same name (e.g. <item>...</item><item>...</item>)
    return (
      <>
        {node.map((item, idx) => (
          <XmlNode key={idx} node={item} nodeName={displayNodeName} defaultExpanded={false} depth={depth} />
        ))}
      </>
    );
  }

  const childEntries = getChildrenEntries(node);
  const childCount = getChildCount(node);
  const isLeaf = isTextNode(node) || (typeof node === 'object' && childCount === 0);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded((v) => !v);
  };

  // For leaf nodes with text content.
  if (isLeaf && isTextNode(node)) {
    const value = String(node);
    return (
      <div className="flex items-start mb-1" style={{ paddingLeft: `${depth * 20}px` }}>
        {displayNodeName && (
          <>
            <span className="xml-node-name">{displayNodeName}</span>
            <span className="xml-separator">:</span>
          </>
        )}
        <span className="xml-value">{value}</span>
      </div>
    );
  }

  // For empty leaf nodes (attributes without values, etc).
  if (isLeaf && !isTextNode(node)) {
    // A node with both attributes and text falls through to expandable rendering.
    if (!(typeof node === 'object' && node !== null && '_text' in node)) {
      return (
        <div className="flex items-center mb-1" style={{ paddingLeft: `${depth * 20}px` }}>
          {displayNodeName && (
            <>
              <span className="xml-node-name">{displayNodeName}</span>
              <span className="xml-separator">:</span>
              <span className="xml-empty-value">{'{}'}</span>
            </>
          )}
        </div>
      );
    }
  }

  // For expandable nodes - show as tree structure.
  // If no node name at root level, render children directly.
  if (!displayNodeName && depth === 0) {
    if (childEntries.length > 0) {
      return (
        <div>
          {childEntries.map(([key, value], idx) => (
            <XmlNode key={key + idx} node={value} nodeName={key} defaultExpanded={defaultExpanded} depth={0} />
          ))}
        </div>
      );
    }
    return null;
  }

  // If no display name at non-root level, use a fallback.
  if (!displayNodeName) {
    displayNodeName = '(unnamed)';
  }

  return (
    <div style={{ paddingLeft: `${depth * 20}px` }}>
      <div className="flex items-center mb-1">
        <button onClick={toggle} className="xml-toggle-button" tabIndex={-1} aria-expanded={expanded}>
          {expanded ? '▼' : '▶'}
        </button>

        <span className="xml-node-name">{displayNodeName}</span>

        {childCount > 0 && <span className="xml-count">{`{${childCount}}`}</span>}
      </div>

      {expanded && childEntries.length > 0 && (
        <div>
          {childEntries.map(([key, value], idx) => {
            // Attributes are stored with an underscore prefix.
            const isAttribute = key.startsWith('_');

            if (isAttribute) {
              const displayValue = value === '' ? 'value' : String(value);
              return (
                <div
                  key={key + idx}
                  className="flex items-start mb-1"
                  style={{ paddingLeft: `${(depth + 1) * 20}px` }}
                >
                  <span className="xml-node-name">{key}</span>
                  <span className="xml-separator">:</span>
                  <span className={value === '' ? 'xml-empty-value' : 'xml-value'}>{displayValue}</span>
                </div>
              );
            }

            if (Array.isArray(value)) {
              return (
                <XmlArrayNode key={`${key}-${idx}`} arrayKey={key} items={value} depth={depth} defaultExpanded />
              );
            }

            return (
              <XmlNode key={key + idx} node={value} nodeName={key} defaultExpanded={false} depth={depth + 1} />
            );
          })}
        </div>
      )}
    </div>
  );
};

// Parse an XML string into a nested JS object.
function parseXMLString(xmlString: string): XmlObject | null {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

    // Check for parsing errors.
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      return null;
    }

    const rootElement = xmlDoc.documentElement;
    if (!rootElement) return null;

    const parsed = xmlToObject(rootElement);
    return parsed !== null && parsed !== '' ? { [rootElement.nodeName]: parsed } : null;
  } catch {
    return null;
  }
}

// Convert an XML DOM element into a nested JS object.
function xmlToObject(node: Element): XmlValue {
  const result: XmlObject = {};

  // Attributes are stored directly with an underscore prefix.
  if (node.attributes && node.attributes.length > 0) {
    for (let i = 0; i < node.attributes.length; i++) {
      const attr = node.attributes[i];
      result[`_${attr.name}`] = attr.value || '';
    }
  }

  const childNodes = Array.from(node.childNodes);
  const elementChildren = childNodes.filter((child): child is Element => child.nodeType === 1);
  const textChildren = childNodes.filter(
    (child) => child.nodeType === 3 && (child.textContent ?? '').trim() !== ''
  );

  // Only text children and no element children: return the text content.
  if (elementChildren.length === 0 && textChildren.length > 0) {
    const textContent = textChildren
      .map((t) => (t.textContent ?? '').trim())
      .join(' ')
      .trim();
    if (Object.keys(result).length > 0) {
      result['_text'] = textContent;
      return result;
    }
    return textContent || null;
  }

  // Process element children.
  if (elementChildren.length > 0) {
    const childMap: XmlObject = {};
    elementChildren.forEach((child) => {
      const childName = child.nodeName; // Preserve original casing
      const childValue = xmlToObject(child);

      const isRepeated =
        elementChildren.filter((c) => c.nodeName.toLowerCase() === childName.toLowerCase()).length > 1;

      if (childValue !== null || isRepeated) {
        const existing = childMap[childName];
        if (existing !== undefined) {
          // Multiple children with the same name - convert to array.
          if (Array.isArray(existing)) {
            existing.push(childValue);
          } else {
            childMap[childName] = [existing, childValue];
          }
        } else {
          childMap[childName] = childValue;
        }
      }
    });

    Object.assign(result, childMap);
  }

  return Object.keys(result).length > 0 ? result : null;
}

function isTextNode(node: XmlValue): node is string | number | null {
  return typeof node === 'string' || typeof node === 'number' || node === null;
}

function getChildrenEntries(node: XmlValue): Array<[string, XmlValue]> {
  // Given an XML-like JS object, return [key, value] for all properties
  // (attributes with `_` prefix and child elements).
  if (typeof node !== 'object' || node === null) return [];
  return Object.entries(node);
}

function getChildCount(node: XmlValue): number {
  if (Array.isArray(node)) {
    return node.length;
  }
  return getChildrenEntries(node).length;
}
