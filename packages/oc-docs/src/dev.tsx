/* eslint-disable react-refresh/only-export-components -- dev-only entry, not a component module */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import './styles/index.css';
// Import Prism (with our token customizations) to ensure it's bundled
import Prism from './utils/prism';
import OpenCollection from './components/OpenCollection/OpenCollection';
import { createOpenCollectionStore } from './store/store';
import { sampleCollectionYaml } from './sampleCollection';
import { foldersFixtureCollection } from './e2eFixtures/foldersCollection';
import { variablesFixtureCollection } from './e2eFixtures/variablesCollection';

// `?fixture=folders` mounts a nested-folder collection for routing e2e tests;
const fixture = new URLSearchParams(window.location.search).get('fixture');
const devCollection =
  fixture === 'folders'
    ? foldersFixtureCollection
    : fixture === 'vars'
      ? variablesFixtureCollection
      : sampleCollectionYaml;

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
          collection={devCollection}
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
