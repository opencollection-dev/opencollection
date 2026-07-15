import { describe, it, expect } from 'vitest';
import { classifyVariableToken } from './variableHighlight';

const noneFound = () => false;
const foundNames = (names: string[]) => (name: string) => names.includes(name);

describe('classifyVariableToken', () => {
  it('marks an undefined variable invalid (e.g. {{randomUUID}} without a $)', () => {
    expect(classifyVariableToken('randomUUID', noneFound)).toBe('variable-invalid');
  });

  it('marks a $-prefixed mock/dynamic function valid', () => {
    expect(classifyVariableToken('$randomUUID', noneFound)).toBe('variable-valid');
  });

  it('marks a $-prefixed name that is not a mock function invalid', () => {
    expect(classifyVariableToken('$notAFunction', noneFound)).toBe('variable-invalid');
  });

  it('marks a name present in the variables map valid', () => {
    expect(classifyVariableToken('baseUrl', foundNames(['baseUrl']))).toBe('variable-valid');
  });

  it('supports dotted names looked up as a literal key', () => {
    expect(classifyVariableToken('process.env.HOST', foundNames(['process.env.HOST']))).toBe('variable-valid');
  });

  it('does NOT trim — a spaced name is invalid even when the trimmed name exists (Bruno parity)', () => {
    expect(classifyVariableToken(' baseUrl ', foundNames(['baseUrl']))).toBe('variable-invalid');
  });

  it('treats {{?name}} as a prompt variable', () => {
    expect(classifyVariableToken('?token', noneFound)).toBe('variable-prompt');
  });

  it('does not treat a lone ? or a spaced ?-name as a prompt', () => {
    expect(classifyVariableToken('?', noneFound)).toBe('variable-invalid');
    expect(classifyVariableToken('? name', noneFound)).toBe('variable-invalid');
  });
});
