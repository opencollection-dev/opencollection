import React from 'react'
import PropertyTable from '../PropertyTable'
import CodeBlock from '../CodeBlock'
import { formatBodyTypeName, getBodySchemaName } from '../../utils/schemaHelpers'
import { useTheme } from '../../theme/ThemeProvider'
import { convertToYaml } from '../../utils/yamlConverter'

function BodyType({ bodyType, schema }) {
  const theme = useTheme();
  const { typography, spacing } = theme;
  const schemaName = getBodySchemaName(bodyType);
  const body = schema.$defs[schemaName];
  
  const getBodyExample = (type) => {
    const examples = {
      'raw-body': {
        type: "json",
        data: '{\n  "name": "John Doe",\n  "email": "john@example.com"\n}'
      },
      'form-urlencoded': {
        type: "form-urlencoded",
        data: [
          { name: "username", value: "john_doe", disabled: false },
          { name: "password", value: "secret123", disabled: false }
        ]
      },
      'multipart-form': {
        type: "multipart-form",
        data: [
          { name: "file", type: "file", value: "/path/to/file.pdf", disabled: false },
          { name: "description", type: "text", value: "File description", disabled: false }
        ]
      },
      'file-body': {
        type: "file",
        data: [
          { filePath: "/path/to/upload.jpg", contentType: "image/jpeg", selected: true }
        ]
      }
    };
    
    return examples[type];
  };

  const renderSchema = () => {
    if (bodyType === 'raw-body') {
      return (
        <PropertyTable 
          properties={body.properties}
          order={Object.keys(body.properties)}
          required={body.required}
        />
      );
    }
    
    // For form-urlencoded, multipart-form, and file-body, show the main properties
    // and then the nested data structure
    if (body.properties && body.properties.data) {
      const dataProperty = body.properties.data;
      return (
        <>
          <PropertyTable 
            properties={body.properties}
            order={Object.keys(body.properties)}
            required={body.required}
          />
          {dataProperty.items && (
            <>
              <h4 className={`text-sm font-semibold mt-4 mb-2`}>Data Item Structure</h4>
              <PropertyTable 
                properties={dataProperty.items.properties}
                order={Object.keys(dataProperty.items.properties)}
                required={dataProperty.items.required}
              />
            </>
          )}
        </>
      );
    }
    
    return (
      <PropertyTable 
        properties={body.properties}
        order={Object.keys(body.properties)}
        required={body.required}
      />
    );
  };

  const example = getBodyExample(bodyType);

  return (
    <section>
      <h2 className={typography.heading.h2}>{formatBodyTypeName(bodyType)}</h2>
      <p className={`${typography.body.default} ${spacing.element}`}>{body.description}</p>
      
      <h3 className={`${typography.heading.h3} ${spacing.paragraph}`}>Schema</h3>
      {renderSchema()}
      
      {example && (
        <>
          <h3 className={`${typography.heading.h3} ${spacing.paragraph}`}>Example</h3>
          <CodeBlock code={convertToYaml(example)} language="yaml" />
        </>
      )}
    </section>
  )
}

export default BodyType