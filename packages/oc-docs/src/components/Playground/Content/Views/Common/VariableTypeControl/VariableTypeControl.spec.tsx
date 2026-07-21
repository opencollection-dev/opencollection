import { describe, it, expect } from 'vitest';
import { useRenderToDom } from '../../../../../../hooks/useRenderToDom';
import { query, queryByTestId } from '../../../../../../test-utils/dom';
import { VariableTypeControl } from './VariableTypeControl';

const noop = () => {};

describe('VariableTypeControl', () => {
  it('renders the selected data type with a testid derived from the row index', () => {
    const root = useRenderToDom(<VariableTypeControl dataType="number" value="42" index={2} onChange={noop} />);
    expect(query(root, '.var-type-label').text.trim()).toBe('number');
    expect(queryByTestId(root, 'variable-data-type-2')).toBeTruthy();
    expect(query(root, '.var-type-control').getAttribute('aria-label')).toBe('Variable data type');
  });

  it('shows a warning when the value cannot be coerced to the declared type', () => {
    const root = useRenderToDom(<VariableTypeControl dataType="number" value="abc" index={0} onChange={noop} />);
    expect(root.querySelector('.var-type-warning')).toBeTruthy();
  });

  it('shows no warning for a value that matches the declared type', () => {
    const root = useRenderToDom(<VariableTypeControl dataType="boolean" value="true" index={0} onChange={noop} />);
    expect(root.querySelector('.var-type-warning')).toBeNull();
  });

  it('never warns on the string type', () => {
    const root = useRenderToDom(<VariableTypeControl dataType="string" value="" index={0} onChange={noop} />);
    expect(root.querySelector('.var-type-warning')).toBeNull();
  });
});
