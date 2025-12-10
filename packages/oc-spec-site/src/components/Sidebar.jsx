import React from 'react'
import { useTheme } from '../theme/ThemeProvider'
import { cn } from '../theme'

const navItems = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'collection', label: 'Collection' },
  { 
    id: 'items', 
    label: 'Items',
    children: [
      { 
        id: 'http-request', 
        label: 'HTTP Request',
        children: [
          { id: 'http-request-info', label: 'Info' },
          { id: 'http-request-details', label: 'HTTP Details' },
          { id: 'http-request-runtime', label: 'Runtime' },
          { id: 'http-request-settings', label: 'Settings' },
        ]
      },
      { 
        id: 'graphql-request', 
        label: 'GraphQL Request',
        children: [
          { id: 'graphql-request-info', label: 'Info' },
          { id: 'graphql-request-details', label: 'GraphQL Details' },
          { id: 'graphql-request-runtime', label: 'Runtime' },
          { id: 'graphql-request-settings', label: 'Settings' },
        ]
      },
      { 
        id: 'grpc-request', 
        label: 'gRPC Request',
        children: [
          { id: 'grpc-request-info', label: 'Info' },
          { id: 'grpc-request-details', label: 'gRPC Details' },
          { id: 'grpc-request-runtime', label: 'Runtime' },
        ]
      },
      { 
        id: 'websocket-request', 
        label: 'WebSocket Request',
        children: [
          { id: 'websocket-request-info', label: 'Info' },
          { id: 'websocket-request-details', label: 'WebSocket Details' },
          { id: 'websocket-request-runtime', label: 'Runtime' },
        ]
      },
      { id: 'folder', label: 'Folder' },
      { id: 'script', label: 'Script' },
    ]
  },
  { id: 'base-config', label: 'Request Defaults' },
  { id: 'environments', label: 'Environments' },
  { 
    id: 'auth', 
    label: 'Authentication',
    children: [
      { id: 'auth-awsv4', label: 'AWS V4' },
      { id: 'auth-basic', label: 'Basic' },
      { id: 'auth-bearer', label: 'Bearer' },
      { id: 'auth-digest', label: 'Digest' },
      { id: 'auth-apikey', label: 'API Key' },
      { id: 'auth-ntlm', label: 'NTLM' },
      { id: 'auth-wsse', label: 'WSSE' },
      { 
        id: 'auth-oauth2', 
        label: 'OAuth 2.0',
        children: [
          { id: 'oauth2-client-credentials', label: 'Client Credentials' },
          { id: 'oauth2-resource-owner', label: 'Resource Owner Password' },
          { id: 'oauth2-authorization-code', label: 'Authorization Code' },
          { id: 'oauth2-implicit', label: 'Implicit' },
        ]
      },
    ]
  },
  { 
    id: 'request-body', 
    label: 'Request Body',
    children: [
      { id: 'raw-body', label: 'Raw Body' },
      { id: 'form-urlencoded', label: 'Form URL Encoded' },
      { id: 'multipart-form', label: 'Multipart Form' },
      { id: 'file-body', label: 'File Body' },
    ]
  },
  { id: 'variables', label: 'Variables' },
  { id: 'assertions', label: 'Assertions' },
  { id: 'scripts-lifecycle', label: 'Scripts & Lifecycle' },
]

function Sidebar({ activeSection, onNavigate }) {
  const theme = useTheme();
  const { colors, sidebar } = theme;
  
  const renderNavItem = (item, depth = 0, prefix = '') => {
    const isActive = activeSection === item.id
    const isChild = depth > 0
    const isGrandChild = depth > 1
    const isGreatGrandChild = depth > 2
    
    return (
      <li key={item.id}>
        <a 
          href={`#${item.id}`}
          className={cn(
            'block px-2 py-1 rounded transition-all duration-150',
            isGreatGrandChild ? 'text-2xs' : isGrandChild ? 'text-2xs' : isChild ? 'text-xs' : 'text-sm',
            isActive 
              ? `${colors.primary.light} ${colors.primary.text} font-semibold` 
              : `${colors.neutral.text} ${sidebar.hover} hover:text-gray-900`
          )}
          onClick={(e) => {
            e.preventDefault()
            onNavigate(item.id)
          }}
        >
          <span className="seq-number">{prefix}</span>
          {item.label}
        </a>
        {item.children && (
          <ul className="ml-3 mt-0.5 space-y-0">
            {item.children.map((child, idx) => renderNavItem(child, depth + 1, `${prefix}${idx + 1}.`))}
          </ul>
        )}
      </li>
    )
  }

  return (
    <aside className={cn(sidebar.width, sidebar.bg, sidebar.text, 'fixed left-0 top-0 h-screen overflow-y-auto border-r', colors.neutral.border)}>
      <div className="p-3">
        <div className={cn('mb-3 pb-2 border-b', colors.neutral.border)}>
          <img 
            src="/opencollection-logo.svg" 
            alt="OpenCollection" 
            className="h-8 w-auto"
          />
        </div>
        <nav>
          <ul className="space-y-0">
            {navItems.map((item, idx) => renderNavItem(item, 0, `${idx + 1}. `))}
          </ul>
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar
