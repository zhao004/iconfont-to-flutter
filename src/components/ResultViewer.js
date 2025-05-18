import React from 'react';

const ResultViewer = ({ code }) => {
  return (
    <div className="result-viewer">
      <pre>{code}</pre>
    </div>
  );
};

export default ResultViewer;