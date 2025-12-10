export const theme = {
  colors: {
    primary: {
      text: 'text-blue-600',
      bg: 'bg-blue-600',
      hover: 'hover:bg-blue-700',
      light: 'bg-blue-50',
      lightText: 'text-blue-800'
    },
    secondary: {
      text: 'text-gray-600',
      bg: 'bg-gray-600',
      hover: 'hover:bg-gray-700',
      light: 'bg-gray-50',
      lightText: 'text-gray-800'
    },
    danger: {
      text: 'text-red-600',
      bg: 'bg-red-600',
      hover: 'hover:bg-red-700',
      light: 'bg-red-100',
      lightText: 'text-red-800'
    },
    success: {
      text: 'text-green-600',
      bg: 'bg-green-600',
      hover: 'hover:bg-green-700',
      light: 'bg-green-100',
      lightText: 'text-green-800'
    },
    neutral: {
      text: 'text-gray-600',
      textMuted: 'text-gray-500',
      bg: 'bg-white',
      bgAlt: 'bg-gray-50',
      border: 'border-gray-200',
      divider: 'divide-gray-200'
    }
  },
  typography: {
    heading: {
      h2: 'text-xl font-semibold mb-3',
      h3: 'text-base font-medium mb-2'
    },
    body: {
      default: 'text-gray-600 text-sm',
      small: 'text-xs text-gray-600',
      xsmall: 'text-2xs'
    },
    code: {
      inline: 'text-xs',
      block: 'text-xs font-mono'
    }
  },
  spacing: {
    section: 'mb-4',
    paragraph: 'mb-2',
    element: 'mb-3'
  },
  components: {
    table: {
      wrapper: 'table-wrapper',
      base: 'table-base',
      header: 'table-header',
      headerCell: 'table-header-cell',
      body: 'table-body',
      row: 'table-row',
      cell: 'table-cell'
    },
    badge: {
      base: 'badge-base',
      required: 'badge-required',
      optional: 'badge-optional'
    },
    property: {
      name: 'property-name',
      type: 'property-type'
    }
  },
  sidebar: {
    bg: 'bg-sidebar-bg',
    text: 'text-sidebar-text',
    hover: 'hover:bg-sidebar-hover',
    active: 'bg-sidebar-active',
    width: 'w-sidebar',
    margin: 'ml-sidebar'
  }
}

// Helper function to join classes
export const cn = (...classes) => classes.filter(Boolean).join(' ')