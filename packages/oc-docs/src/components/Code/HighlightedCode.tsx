import React, { useMemo } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-xml-doc';
import { isTemplateVariable, templateVariableSplitRegex } from '../../utils/common';
import { TEMPLATE_VARIABLE_SOURCE_PATTERN } from '../../constants';
import { VariableToken } from '../VariableText/VariableToken';

type PrismNode = string | Prism.Token;

const TEMPLATE_TOKEN_TYPE = 'oc-template-variable';
const templatePattern = new RegExp(TEMPLATE_VARIABLE_SOURCE_PATTERN);

const renderText = (text: string, key: string): React.ReactNode =>
  text
    .split(templateVariableSplitRegex())
    .filter((part) => part !== '')
    .map((part, index) =>
      isTemplateVariable(part) ? (
        <VariableToken key={`${key}.${index}`} token={part} highlighted={false} />
      ) : (
        <React.Fragment key={`${key}.${index}`}>{part}</React.Fragment>
      )
    );

const tokenClassName = (token: Prism.Token): string => {
  const alias = Array.isArray(token.alias) ? token.alias.join(' ') : token.alias;
  return ['token', token.type, alias].filter(Boolean).join(' ');
};

const renderNode = (node: PrismNode, key: string): React.ReactNode => {
  if (typeof node === 'string') return renderText(node, key);
  if (node.type === TEMPLATE_TOKEN_TYPE) return <VariableToken key={key} token={String(node.content)} highlighted={false} />;
  const { content } = node;
  const children = Array.isArray(content)
    ? content.map((child, index) => renderNode(child, `${key}.${index}`))
    : renderNode(content, `${key}.0`);
  return (
    <span key={key} className={tokenClassName(node)}>
      {children}
    </span>
  );
};

export const HighlightedCode: React.FC<{ code: string; language: string }> = ({ code, language }) => {
  const nodes = useMemo<React.ReactNode>(() => {
    const base = Prism.languages[language];
    if (!base) return renderText(code, 'plain');
    const grammar: Prism.Grammar = { [TEMPLATE_TOKEN_TYPE]: templatePattern, ...base };
    return (Prism.tokenize(code, grammar) as PrismNode[]).map((node, index) => renderNode(node, `n${index}`));
  }, [code, language]);

  return <>{nodes}</>;
};

export default HighlightedCode;
