import React, { useState, useEffect } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import Content from './components/Content'
import schemaData from './schema.json'
import { ThemeProvider } from './theme/ThemeProvider'

function App() {
  const [activeSection, setActiveSection] = useState('introduction')

  useEffect(() => {
    const hash = window.location.hash.substring(1) || 'introduction'
    setActiveSection(hash)
  }, [])

  const handleNavigation = (section) => {
    setActiveSection(section)
    window.history.pushState(null, null, `#${section}`)
    
    // Scroll to the section after a short delay to allow rendering
    setTimeout(() => {
      const element = document.getElementById(section)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else {
        // Scroll to top if no specific element found
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }, 50)
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50/50">
        <Sidebar 
          activeSection={activeSection} 
          onNavigate={handleNavigation} 
        />
        <Content 
          section={activeSection} 
          schema={schemaData} 
        />
      </div>
    </ThemeProvider>
  )
}

export default App
