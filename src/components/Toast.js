import React from 'react';

export const Toast = ({ message, type }) => {
  return React.createElement('div', { className: `toast ${type}` }, message);
};