import React from 'react'
import PropertyTable from '../PropertyTable'
import CodeBlock from '../CodeBlock'
import { useTheme } from '../../theme/ThemeProvider'
import { convertToYaml } from '../../utils/yamlConverter'

function Variables({ schema }) {
  const theme = useTheme();
  const { typography, spacing } = theme;
  const variable = schema.$defs.Variable;
  
  const example = {
    name: "apiEndpoint",
    value: [
      {
        title: "Production",
        selected: true,
        value: {
          type: "string",
          data: "https://api.example.com"
        }
      },
      {
        title: "Development",
        selected: false,
        value: {
          type: "string",
          data: "https://api.dev.example.com"
        }
      }
    ],
    description: "API base endpoint URL",
    disabled: false
  };

  return (
    <section>
      <h2 className={typography.heading.h2}>Variables</h2>
      <p className={`${typography.body.default} ${spacing.element}`}>{variable.description}</p>
      
      <h3 className={`${typography.heading.h3} ${spacing.paragraph}`}>Properties</h3>
      <PropertyTable 
        properties={variable.properties}
        order={Object.keys(variable.properties)}
        required={variable.required}
      />
      
      <h3 className={`${typography.heading.h3} ${spacing.paragraph}`}>Variable Types</h3>
      <p className={`${typography.body.default} ${spacing.element}`}>Variables can have different value types and support variants for different contexts.</p>
      
      <h4 className="text-base font-semibold mb-2">Value Types</h4>
      <div className={`flex flex-wrap gap-2 ${spacing.element}`}>
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">string</span>
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">number</span>
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">boolean</span>
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">null</span>
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">object</span>
      </div>
      
      <h3 className={`${typography.heading.h3} ${spacing.paragraph}`}>Example</h3>
      <CodeBlock code={convertToYaml(example)} language="yaml" />
    </section>
  )
}

export default Variables