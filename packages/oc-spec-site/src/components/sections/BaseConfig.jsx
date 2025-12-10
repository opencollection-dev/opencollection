import React from 'react'
import PropertyTable from '../PropertyTable'
import { useTheme } from '../../theme/ThemeProvider'

function BaseConfig({ schema }) {
  const theme = useTheme();
  const { typography, spacing } = theme;
  const requestDefaults = schema.$defs.RequestDefaults;

  return (
    <section>
      <h2 className={typography.heading.h2}>Request Defaults</h2>
      <p className={`${typography.body.default} ${spacing.element}`}>{requestDefaults.description}</p>
      <p className={`${typography.body.default} ${spacing.element}`}>Default request configuration applies to all items in the collection and can be overridden at the folder or request level.</p>
      
      <h3 className={`${typography.heading.h3} ${spacing.paragraph}`}>Properties</h3>
      <PropertyTable 
        properties={requestDefaults.properties}
        order={Object.keys(requestDefaults.properties)}
      />
    </section>
  )
}

export default BaseConfig