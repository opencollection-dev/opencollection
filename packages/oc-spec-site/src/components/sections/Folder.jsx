import React from 'react'
import PropertyTable from '../PropertyTable'
import { useTheme } from '../../theme/ThemeProvider'

function Folder({ schema }) {
  const theme = useTheme();
  const { typography, spacing } = theme;
  const folder = schema.$defs.Folder;

  return (
    <section>
      <h2 className={typography.heading.h2}>Folder</h2>
      <p className={`${typography.body.default} ${spacing.element}`}>{folder.description}</p>
      
      <h3 className={`${typography.heading.h3} ${spacing.paragraph}`}>Properties</h3>
      <PropertyTable 
        properties={folder.properties}
        order={['info', 'items', 'request', 'docs']}
        required={folder.required}
      />
      
      <p className={`${typography.body.default} ${spacing.element}`}>Folders can contain any type of item, including other folders, allowing for nested organization of your collection.</p>
    </section>
  )
}

export default Folder