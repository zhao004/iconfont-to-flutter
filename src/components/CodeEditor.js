import React from 'react';

const CodeEditor = ({ code, onCopy }) => {
  return (
    <div className="code-editor">
      <pre>{code}</pre>
      <button onClick={onCopy}>复制代码</button>
    </div>
  );
};

export default CodeEditor;