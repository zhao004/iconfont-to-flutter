import React, { useState } from 'react';
import { Toast } from './components/Toast.js';
import { unzipFiles, processFiles } from './services/fileService.js';

const App = () => {
  const [convertedCode, setConvertedCode] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = async (event) => {
    event.preventDefault();
    setIsDragging(false);
    const files = event.dataTransfer.files;
    handleFiles(files);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    handleFiles(files);
  };

  const handleFiles = async (files) => {
    try {
      if (!files || files.length === 0) {
        setToastMessage('请选择文件');
        setToastType('error');
        return;
      }
      const unzippedFiles = await unzipFiles(files);
      const dartCode = await processFiles(unzippedFiles);
      setConvertedCode(dartCode);
      setToastMessage('转换成功');
      setToastType('success');
    } catch (error) {
      setToastMessage('处理文件时出错：' + error.message);
      setToastType('error');
    } finally {
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(convertedCode);
      setToastMessage('复制成功');
      setToastType('success');
    } catch (error) {
      setToastMessage('复制失败：' + error.message);
      setToastType('error');
    } finally {
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  return React.createElement('div', { className: 'app-container' },
    React.createElement('a', {
      href: 'https://github.com/zhao004/iconfont-to-flutter',
      className: 'github-link',
      target: '_blank',
      rel: 'noopener noreferrer'
    },
    React.createElement('svg', { height: '32', viewBox: '0 0 16 16', width: '32' },
      React.createElement('path', {
        fillRule: 'evenodd',
        d: 'M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z',
        fill: '#000'
      })
    )),
    React.createElement('div', {
      className: `drop-zone ${isDragging ? 'dragging' : ''}`,
      onDrop: handleDrop,
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onClick: () => document.getElementById('fileInput').click()
    },
    React.createElement('input', {
      type: 'file',
      id: 'fileInput',
      style: { display: 'none' },
      accept: '.zip',
      onChange: handleFileUpload
    }),
    React.createElement('p', null, '将阿里巴巴图标库的 zip 文件拖放到此处'),
    React.createElement('p', { className: 'sub-text' }, '或者点击此处选择文件')
    ),
    convertedCode && React.createElement('div', { className: 'result-container' },
      React.createElement('pre', { className: 'code-block' },
        React.createElement('code', null,
          convertedCode.split('\n').map((line, index) => {
            let highlightedLine = line;
            if (!line.includes('///') && !line.includes('fonts:')) {
              highlightedLine = line
                .replace(/\b(import|class|static|const)\b/g, '<span class="dart-keyword">$1</span>')
                .replace(/\b(IconFont|IconData)\b/g, '<span class="dart-class">$1</span>')
                .replace(/\b(0x[a-fA-F0-9]+)\b/g, '<span class="dart-number">$1</span>')
                .replace(/\b(fontFamily|fontName)\b/g, '<span class="dart-property">$1</span>')
                .replace(/'([^']+)'/g, '<span class="dart-string">\'$1\'</span>')
                .replace(/\/\/.*/g, '<span class="dart-comment">$&</span>');
            }
            return React.createElement('div', {
              key: index,
              dangerouslySetInnerHTML: { __html: highlightedLine }
            });
          })
        )
      ),
      React.createElement('button', {
        className: 'copy-button',
        onClick: handleCopy
      }, '复制代码')
    ),
    toastMessage && React.createElement(Toast, { message: toastMessage, type: toastType })
  );
};

export default App;
