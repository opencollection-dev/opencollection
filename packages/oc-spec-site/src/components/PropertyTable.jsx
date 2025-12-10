import React from 'react'
import { getPropertyType } from '../utils/schemaHelpers'
import { useTheme } from '../theme/ThemeProvider'
import { cn } from '../theme'

function PropertyTable({ properties, order, required = [] }) {
  if (!properties) return null;
  
  const theme = useTheme();
  const { table, badge, property } = theme.components;

  return (
    <div className={table.wrapper}>
      <table className={table.base}>
        <thead className={table.header}>
          <tr>
            <th className={table.headerCell}>Property</th>
            <th className={table.headerCell}>Type</th>
            <th className={table.headerCell}>Required</th>
            <th className={table.headerCell}>Description</th>
          </tr>
        </thead>
        <tbody className={table.body}>
          {order.map(key => {
            const prop = properties[key];
            if (!prop) return null;
            
            const isRequired = required.includes(key);
            const type = getPropertyType(prop);
            const description = prop.description || '';
            
            return (
              <tr key={key} className={table.row}>
                <td className={cn(table.cell, property.name)}>{key}</td>
                <td className={cn(table.cell, property.type)}>{type}</td>
                <td className={table.cell}>
                  {isRequired ? (
                    <span className={cn(badge.base, badge.required)}>
                      Required
                    </span>
                  ) : (
                    <span className={cn(badge.base, badge.optional)}>
                      Optional
                    </span>
                  )}
                </td>
                <td className={cn(table.cell, 'description-text')}>{description}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default PropertyTable