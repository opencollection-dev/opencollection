import React from 'react'
import PropertyTable from '../PropertyTable'
import CodeBlock from '../CodeBlock'
import { useTheme } from '../../theme/ThemeProvider'
import { convertToYaml } from '../../utils/yamlConverter'

function Environments({ schema }) {
  const theme = useTheme();
  const { typography, spacing } = theme;
  const environment = schema.$defs.Environment;

  const example = {
    name: "Production",
    description: "Production environment configuration",
    variables: [
      { name: "baseUrl", value: "https://api.production.com" },
      { name: "apiKey", value: "prod-key-123", transient: true }
    ]
  };

  return (
    <section>
      <h2 className={typography.heading.h2}>Environments</h2>
      <p className={`${typography.body.default} ${spacing.element}`}>Environments allow you to define different sets of variables for different contexts (development, staging, production, etc.).</p>

      <h3 className={`${typography.heading.h3} ${spacing.paragraph}`}>Environment Properties</h3>
      <PropertyTable
        properties={environment.properties}
        order={Object.keys(environment.properties)}
        required={environment.required}
      />

      <h3 className={`${typography.heading.h3} ${spacing.paragraph}`}>Example</h3>
      <CodeBlock code={convertToYaml(example)} language="yaml" />
    </section>
  )
}

export default Environments