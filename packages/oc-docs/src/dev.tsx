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
import Topbar from './components/Topbar/Topbar';
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

/**
 * Dev-only Topbar harness (gated behind `?view=topbar-harness`). Mounts the
 * Topbar with both slots filled so the e2e suite can exercise the search-expand
 * and overflow popover, which need the search / env-switcher slot nodes that
 * downstream tickets supply. Not part of the shipped standalone build.
 */
const SearchSlot: React.FC = () => (
  <input
    data-testid="search-slot-input"
    placeholder="Search endpoints…"
    style={{
      width: '100%',
      height: '28px',
      boxSizing: 'border-box',
      padding: '5px 8px',
      border: '1px solid var(--oc-border-border1)',
      borderRadius: 'var(--oc-border-radius-base)',
      background: 'var(--oc-background-base)',
      color: 'var(--oc-text)',
      fontFamily: 'var(--font-sans)',
    }}
  />
);

const EnvSwitcherSlot: React.FC = () => (
  <div data-testid="env-switcher-slot" style={{ display: 'flex', gap: '8px' }}>
    <span>Show vars</span>
    <span>Development</span>
  </div>
);

const TopbarHarness: React.FC = () => (
  <div style={{ minHeight: '200vh' }}>
    <Topbar
      collectionName="Hotel Booking API"
      version="v1.0.0"
      searchSlot={<SearchSlot />}
      envSwitcherSlot={<EnvSwitcherSlot />}
      openInBrunoHref="bruno://app/collection/import/git?url=https%3A%2F%2Fexample.com%2Frepo.git"
      onToggleSidebar={() => {
        (window as unknown as { __toggleSidebarCalls?: number }).__toggleSidebarCalls =
          ((window as unknown as { __toggleSidebarCalls?: number }).__toggleSidebarCalls ?? 0) + 1;
      }}
    />
    <div style={{ padding: '24px' }}>Scroll content to verify the bar stays pinned.</div>
  </div>
);

const view =
  typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('view') : null;

// Render the app
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(view === 'topbar-harness' ? <TopbarHarness /> : <DevApp />);
} else {
  console.error('Root container not found');
}
