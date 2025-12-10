import React from 'react'
import PropertyTable from '../PropertyTable'
import CodeBlock from '../CodeBlock'
import { useTheme } from '../../theme/ThemeProvider'
import { convertToYaml } from '../../utils/yamlConverter'

function Assertions({ schema }) {
  const theme = useTheme();
  const { typography, spacing } = theme;
  const assertion = schema.$defs.Assertion;
  
  const example = [
    {
      expression: "response.status",
      operator: "equals",
      value: "200",
      disabled: false,
      description: "Response status should be 200"
    },
    {
      expression: "response.body.users.length",
      operator: "greaterThan",
      value: "0",
      disabled: false,
      description: "Should return at least one user"
    }
  ];

  return (
    <section>
      <h2 className={typography.heading.h2}>Assertions</h2>
      <p className={`${typography.body.default} ${spacing.element}`}>{assertion.description}</p>
      
      <h3 className={`${typography.heading.h3} ${spacing.paragraph}`}>Properties</h3>
      <PropertyTable 
        properties={assertion.properties}
        order={Object.keys(assertion.properties)}
        required={assertion.required}
      />
      
      <h3 className={`${typography.heading.h3} ${spacing.paragraph}`}>Common Operators</h3>
      <ul className={`list-disc list-inside space-y-2 ${spacing.element} ${typography.body.default}`}>
        <li><code>equals</code> - Exact match</li>
        <li><code>notEquals</code> - Not equal</li>
        <li><code>contains</code> - String contains</li>
        <li><code>notContains</code> - String does not contain</li>
        <li><code>greaterThan</code> - Numeric greater than</li>
        <li><code>lessThan</code> - Numeric less than</li>
        <li><code>isNull</code> - Value is null</li>
        <li><code>isNotNull</code> - Value is not null</li>
      </ul>
      
      <h3 className={`${typography.heading.h3} ${spacing.paragraph}`}>Example</h3>
      <CodeBlock code={convertToYaml(example)} language="yaml" />
    </section>
  )
}

export default Assertions