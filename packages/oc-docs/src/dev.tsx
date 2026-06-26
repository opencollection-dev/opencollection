/* eslint-disable react-refresh/only-export-components -- dev-only entry, not a component module */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import './styles/index.css';
// Import Prism and language components to ensure they're bundled
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-xml-doc';
import 'prismjs/components/prism-http';
import 'prismjs/components/prism-graphql';
import OpenCollection from './components/OpenCollection/OpenCollection';
import { createOpenCollectionStore } from './store/store';
import { sampleCollectionYaml } from './sampleCollection';

// Ensure Prism is available globally for any code that might access it
if (typeof window !== 'undefined') {
  (window as any).Prism = Prism;
}

// Development App component
const DevApp: React.FC = () => {
  const store = createOpenCollectionStore();

  return (
    <Provider store={store}>
      <div style={{ height: '100vh', width: '100vw' }}>
        <OpenCollection
          collection={sampleCollectionYaml}
          gitCollectionUrl="https://github.com/usebruno/bruno-testbench.git"
        />
      </div>
    </Provider>
  );
};

// Render the app
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<DevApp />);
} else {
  console.error('Root container not found');
}
