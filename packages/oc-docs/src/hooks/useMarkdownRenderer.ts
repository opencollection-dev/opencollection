import { useMemo } from 'react';
import MarkdownIt from 'markdown-it';
import Prism from 'prismjs';

let cachedRenderer: MarkdownIt | null = null;

const createRenderer = (): MarkdownIt => {
  const markdownIt = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true,
    highlight: (str, lang) => {
      if (lang && Prism.languages[lang]) {
        try {
          return Prism.highlight(str, Prism.languages[lang], lang);
        } catch (error) {
          // Ignore highlighting errors and fall back to default behaviour
        }
      }
      return '';
    },
  });

  const defaultRender =
    markdownIt.renderer.rules.heading_open ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

  markdownIt.renderer.rules.heading_open = function (
    tokens,
    idx,
    options,
    env,
    self
  ) {
    const token = tokens[idx];
    const level = token.tag.substr(1);

    if (level === '1') {
      token.attrJoin('class', 'text-2xl font-bold mt-6 mb-3 heading-1');
    } else if (level === '2') {
      token.attrJoin('class', 'text-xl font-semibold mt-5 mb-2 heading-2');
    } else if (level === '3') {
      token.attrJoin('class', 'text-lg font-semibold mt-4 mb-2 heading-3');
    } else {
      token.attrJoin('class', 'font-semibold mt-3 mb-1 heading-4');
    }

    return defaultRender(tokens, idx, options, env, self);
  };

  markdownIt.renderer.rules.table_open = () => '<div class="md-table-scroll"><table>';
  markdownIt.renderer.rules.table_close = () => '</table></div>';

  return markdownIt;
};

export const useMarkdownRenderer = () => {
  const renderer = useMemo(() => {
    if (!cachedRenderer) {
      cachedRenderer = createRenderer();
    }

    return cachedRenderer;
  }, []);

  return renderer;
};
