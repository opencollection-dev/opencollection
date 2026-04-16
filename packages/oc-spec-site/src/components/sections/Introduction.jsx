import React from 'react'
import { useTheme } from '../../theme/ThemeProvider'

function Introduction() {
  const theme = useTheme();
  const { typography, spacing } = theme;

  return (
    <section>
      <h2 className={typography.heading.h2}>Introduction</h2>
      <p className={`${typography.body.default} ${spacing.paragraph}`}>
        The OpenCollection Specification is a format for describing API collections, including requests, 
        authentication, variables, and scripts. This specification enables tools to understand and work 
        with API collections in a standardized way.
      </p>
      <div className="space-y-2">
        <p>Version: <code className={typography.code.inline}>v1.0.0</code></p>
        <p>Schema: <code className={`${typography.code.inline} break-all`}>https://schema.opencollection.com/opencollection/v1.0.0.json</code></p>
      </div>
    </section>
  )
}

export default Introduction