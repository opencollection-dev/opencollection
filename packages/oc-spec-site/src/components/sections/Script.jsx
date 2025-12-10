import React from 'react'
import PropertyTable from '../PropertyTable'
import CodeBlock from '../CodeBlock'
import { useTheme } from '../../theme/ThemeProvider'
import { convertToYaml } from '../../utils/yamlConverter'

function Script({ schema }) {
  const theme = useTheme();
  const { typography, spacing } = theme;
  const scriptFile = schema.$defs.ScriptFile;
  
  const example = {
    type: "script",
    script: "// Shared utility functions\nexport function generateTimestamp() {\n    return new Date().toISOString();\n}"
  };

  return (
    <section>
      <h2 className={typography.heading.h2}>Script File</h2>
      <p className={`${typography.body.default} ${spacing.element}`}>{scriptFile.description}</p>
      
      <h3 className={`${typography.heading.h3} ${spacing.paragraph}`}>Properties</h3>
      <PropertyTable 
        properties={scriptFile.properties}
        order={Object.keys(scriptFile.properties)}
        required={scriptFile.required}
      />
      
      <h3 className={`${typography.heading.h3} ${spacing.paragraph}`}>Example</h3>
      <CodeBlock code={convertToYaml(example)} language="yaml" />
    </section>
  )
}

export default Script