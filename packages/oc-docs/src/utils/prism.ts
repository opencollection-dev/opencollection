import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-xml-doc';
import 'prismjs/components/prism-http';
import 'prismjs/components/prism-graphql';


Prism.languages.insertBefore('javascript', 'keyword', {
  'variable-declaration': {
    pattern: /\b(?:const|let|var)\s+[A-Za-z_$][\w$]*/,
    inside: {
      keyword: /^(?:const|let|var)/,
      'var-name': /[A-Za-z_$][\w$]*$/
    }
  }
});
Prism.languages.insertBefore('javascript', 'punctuation', {
  property: {
    pattern: /(\.\s*)[A-Za-z_$][\w$]*(?!\s*\()/,
    lookbehind: true
  },
  variable: /\b[A-Za-z_$][\w$]*\b/
});

export default Prism;