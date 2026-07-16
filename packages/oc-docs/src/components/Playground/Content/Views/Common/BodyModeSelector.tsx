import React from 'react';
import type { HttpRequest } from '@opencollection/types/requests/http';
import {
  IconCaretDown,
  IconForms,
  IconBraces,
  IconCode,
  IconFileText,
  IconDatabase,
  IconFile,
  IconX
} from '@tabler/icons';
import MenuDropdown from '../../../../../ui/MenuDropdown';
import type { MenuDropdownGroup } from '../../../../../ui/MenuDropdown';

interface BodyModeSelectorProps {
  body: any;
  onItemChange: (item: HttpRequest) => void;
  item: HttpRequest;
}

/**
 * Grouped body types, ported from bruno-app's RequestBodyMode (Form / Raw /
 * Other) with the same @tabler icons. `value`s keep oc-docs' hyphenated ids so
 * the existing body model + change handler are unchanged.
 */
const BODY_TYPE_GROUPS = [
  {
    name: 'Form',
    options: [
      { value: 'multipart-form', label: 'Multipart Form', icon: IconForms },
      { value: 'form-urlencoded', label: 'Form URL Encoded', icon: IconForms }
    ]
  },
  {
    name: 'Raw',
    options: [
      { value: 'json', label: 'JSON', icon: IconBraces },
      { value: 'xml', label: 'XML', icon: IconCode },
      { value: 'text', label: 'TEXT', icon: IconFileText },
      { value: 'sparql', label: 'SPARQL', icon: IconDatabase }
    ]
  },
  {
    name: 'Other',
    options: [
      { value: 'file', label: 'File / Binary', icon: IconFile },
      { value: 'none', label: 'No Body', icon: IconX }
    ]
  }
];

const ALL_BODY_TYPE_OPTIONS = BODY_TYPE_GROUPS.flatMap((group) => group.options);

/** Derives the current body-type id from the request body shape. */
export const getBodyType = (body: any): string =>
  !body ? 'none' : 'type' in body ? body.type : Array.isArray(body) ? 'form-urlencoded' : 'none';

/**
 * The request body format dropdown. Rendered on the right side of the request
 * pane tabs (only while the Body tab is active).
 */
export const BodyModeSelector: React.FC<BodyModeSelectorProps> = ({ body, onItemChange, item }) => {
  const currentBodyType = getBodyType(body);

  const handleBodyTypeChange = (bodyType: string) => {
    if (bodyType === 'none') {
      onItemChange({
        ...item,
        http: {
          ...item.http,
          body: undefined
        }
      });
    } else if (['json', 'text', 'xml', 'sparql'].includes(bodyType)) {
      onItemChange({
        ...item,
        http: {
          ...item.http,
          body: { type: bodyType as any, data: '' }
        }
      });
    } else if (bodyType === 'form-urlencoded') {
      onItemChange({
        ...item,
        http: {
          ...item.http,
          body: [] as any
        }
      });
    } else if (bodyType === 'multipart-form' || bodyType === 'file') {
      onItemChange({
        ...item,
        http: {
          ...item.http,
          body: { type: bodyType, data: [] } as any
        }
      });
    }
  };

  const currentBodyLabel = ALL_BODY_TYPE_OPTIONS.find((o) => o.value === currentBodyType)?.label ?? 'No Body';

  const bodyMenuItems: MenuDropdownGroup[] = BODY_TYPE_GROUPS.map((group) => ({
    name: group.name,
    options: group.options.map((o) => ({
      id: o.value,
      label: o.label,
      leftSection: o.icon,
      onClick: () => handleBodyTypeChange(o.value)
    }))
  }));

  return (
    <MenuDropdown
      selectedItemId={currentBodyType}
      placement="bottom-end"
      data-testid="body-type-select"
      items={bodyMenuItems}
      groupStyle="select"
      showGroupDividers={false}
    >
      {/* Borderless brand-colored trigger + caret, ported from bruno-app's
          RequestBodyMode (theme.primary.text label, muted caret). */}
      <button
        type="button"
        aria-label="Body Type"
        className="inline-flex items-center select-none text-sm"
        style={{
          background: 'transparent',
          border: 'none',
          padding: '0.25rem 0',
          fontFamily: 'inherit',
          fontWeight: 500,
          color: 'var(--oc-primary-text)',
          cursor: 'pointer'
        }}
      >
        {currentBodyLabel}
        <IconCaretDown
          size={14}
          strokeWidth={2}
          style={{ marginLeft: '0.25rem', color: 'var(--oc-colors-text-muted)' }}
        />
      </button>
    </MenuDropdown>
  );
};

export default BodyModeSelector;
