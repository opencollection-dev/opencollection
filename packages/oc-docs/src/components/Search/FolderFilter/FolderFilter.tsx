import React from 'react';
import { FolderIcon } from '../../../assets/icons';
import Dropdown from '../../../ui/Dropdown/Dropdown';
import type { FolderOption } from '../searchIndex';

interface FolderFilterProps {
  folders: FolderOption[];
  /** Slug of the selected folder, or null when no folder filter is active. */
  value: string | null;
  onChange: (slug: string | null) => void;
  testId?: string;
}

/** Single-select folder filter for the search palette, built on the shared
 * Dropdown. Renders nothing when the collection has no folders. */
export const FolderFilter: React.FC<FolderFilterProps> = ({
  folders,
  value,
  onChange,
  testId = 'search-folder-filter',
}) => {
  if (folders.length === 0) return null;

  const selected = folders.find((f) => f.slug === value) || null;

  return (
    <Dropdown label={selected ? selected.name : 'Folder'} active={!!selected} menuLabel="Filter by folder" testId={testId}>
      {({ close }) =>
        folders.map((folder) => (
          <li key={folder.slug} role="option" aria-selected={folder.slug === value}>
            <button
              type="button"
              className={`dropdown-option${folder.slug === value ? ' is-selected' : ''}`}
              onClick={() => {
                onChange(folder.slug === value ? null : folder.slug); // re-selecting clears
                close();
              }}
            >
              <FolderIcon />
              <span className="dropdown-label">{folder.name}</span>
            </button>
          </li>
        ))
      }
    </Dropdown>
  );
};

export default FolderFilter;
