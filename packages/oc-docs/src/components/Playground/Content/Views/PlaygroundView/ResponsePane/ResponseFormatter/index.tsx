import type { FC } from 'react';
import MenuDropdown, { type MenuDropdownItem, type MenuDropdownItems } from '../../../../../../../ui/MenuDropdown';
import { ResponseBodyFormat } from '../../../../../../../utils/response';

interface ResponseFormatSelectorProps {
  handleSelection?: (value: ResponseBodyFormat) => void;
  selectedFormat?: ResponseBodyFormat;
  /** Whether the response is shown as a rendered preview vs the raw editor. */
  showPreview?: boolean;
  /** Called when the preview toggle is flipped. */
  onPreviewToggle?: (next: boolean) => void;
}

/** "Preview" label + switch rendered as the dropdown header (above the formats). */
const PreviewToggleHeader: FC<{ checked: boolean; onChange: (next: boolean) => void }> = ({
  checked,
  onChange
}) => (
  <div className="flex items-center justify-between" style={{ padding: '4px 4px', gap: 24, minWidth: 190 }}>
    <span style={{ fontSize: 13, color: 'var(--oc-text)' }}>Preview</span>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label="Toggle preview"
      onClick={() => onChange(!checked)}
      style={{
        position: 'relative',
        width: 34,
        height: 18,
        flexShrink: 0,
        padding: 0,
        border: 'none',
        borderRadius: 9,
        cursor: 'pointer',
        background: checked ? 'var(--oc-accents-primary)' : 'var(--oc-background-surface2)',
        transition: 'background 0.15s ease'
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 2,
          left: checked ? 18 : 2,
          width: 14,
          height: 14,
          borderRadius: '50%',
          background: 'var(--oc-background-base)',
          transition: 'left 0.15s ease'
        }}
      />
    </button>
  </div>
);

const FORMAT_GROUPS: Array<{options: Array<{id: ResponseBodyFormat, value: ResponseBodyFormat, text: string}>}> = [
  {
    options: [
      { id: 'json', value: 'json', text: 'JSON' },
      { id: 'html', value: 'html', text: 'HTML' },
      { id: 'xml', value: 'xml', text: 'XML' },
      { id: 'javascript', value: 'javascript', text: 'Javascript' }
    ]
  },
  {
    options: [
      { id: 'raw', value: 'raw', text: 'Raw' },
      { id: 'hex', value: 'hex', text: 'Hex' },
      { id: 'base64', value: 'base64', text: 'Base64' }
    ]
  }
];

const ResponseFormatSelector: FC<ResponseFormatSelectorProps> = ({
  handleSelection,
  selectedFormat,
  showPreview = false,
  onPreviewToggle
}) => {
  const items: MenuDropdownItems = FORMAT_GROUPS.map((group) => ({
    options: group.options.map(({ id, value, text }) => ({
      id,
      label: text,
      onClick: () => handleSelection?.(value)
    }))
  }));

  return (
    <MenuDropdown
      items={items}
      selectedItemId={selectedFormat}
      itemToText={(item: MenuDropdownItem) => item.label}
      placement="bottom-start"
      header={<PreviewToggleHeader checked={showPreview} onChange={(next) => onPreviewToggle?.(next)} />}
      testId="response-format-selector"
    />
  );
};

export default ResponseFormatSelector;
