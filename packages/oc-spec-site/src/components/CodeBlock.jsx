import React, { useEffect, useRef } from 'react'

function CodeBlock({ code, language = 'json' }) {
  const codeRef = useRef(null);

  useEffect(() => {
    if (codeRef.current && window.Prism) {
      window.Prism.highlightElement(codeRef.current);
    }
  }, [code]);

  return (
    <div className="my-3">
      <pre className={`language-${language}`}>
        <code ref={codeRef} className={`language-${language}`}>
          {code}
        </code>
      </pre>
    </div>
  );
}

export default CodeBlock