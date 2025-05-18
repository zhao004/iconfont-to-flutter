// filepath: /py-to-js-converter/py-to-js-converter/src/services/fileService.js
import JSZip from 'jszip';

export const readFile = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            resolve(event.target.result);
        };
        reader.onerror = (error) => {
            reject(error);
        };
        reader.readAsText(file);
    });
};

export const unzipFiles = async (files) => {
  if (!files || files.length === 0) return [];
  const zip = new JSZip();
  const content = await files[0].arrayBuffer();
  const result = await zip.loadAsync(content);
  return Object.values(result.files);
};

export const processFiles = async (files) => {
  let css = '';
  // 查找所有 CSS 文件
  for (const file of files) {
    if (file.name.toLowerCase().includes('iconfont') && file.name.endsWith('.css')) {
      css = await file.async('text');
      break;
    }
  }

  if (!css) {
    // 如果没找到带 iconfont 的 css 文件，尝试找第一个 css 文件
    for (const file of files) {
      if (file.name.endsWith('.css')) {
        css = await file.async('text');
        break;
      }
    }
  }

  if (!css) {
    throw new Error('未找到有效的 CSS 文件');
  }

  // 清理 CSS 内容
  const cleanCss = css.replace(/\\e/g, 'e').replace(/\s+/g, ' ').trim();

  // 支持更多 iconfont 格式的正则表达式
  const patterns = [
    /\.icon(?:font)?[-_]?([\w-]+)(?::\s*before)?\s*{[^}]*?content:\s*["'](?:\\)?([0-9a-fA-F]+)["'][^}]*}/g,
    /\.icon(?:font)?[-_]?([\w-]+)(?::\s*before)?\s*{[^}]*?content:\s*["']\\?e([\w\d]+)["'][^}]*}/g,
    /\[class[^\]]*?icon[-_]([\w-]+)[^\]]*?\][^{]*?{[^}]*?content:\s*["'](?:\\)?([0-9a-fA-F]+)["'][^}]*}/g
  ];

  const iconList = [];
  // 使用多个正则表达式匹配
  try {
    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(cleanCss)) !== null) {
        const [, name, value] = match;
        if (name && value) {
          const normalizedName = name.replace(/-/g, '_').toLowerCase();
          if (!iconList.some(([existingName]) => existingName === normalizedName)) {
            iconList.push([normalizedName, value]);
          }
        }
      }
    }
  } catch (error) {
    console.error('解析 CSS 内容时出错:', error);
    throw new Error('解析图标定义失败: ' + error.message);
  }

  if (iconList.length === 0) {
    throw new Error('未在 CSS 文件中找到任何图标定义');
  }

  console.log(`找到 ${iconList.length} 个图标定义`);

  // 生成 Dart 代码
  const dartTemplate = `///yaml文件加入
fonts:
    - family: IconFont
        fonts:
        - asset: fonts/iconfont.ttf

        
///自定义组件    
import 'package:flutter/widgets.dart';
// 代码由程序自动生成。请不要对此文件做任何修改。
class IconFont {
  IconFont._();
  static const fontName = 'IconFont';

{icon_codes}
}`.trim();

  // 生成单个图标的代码
  const generateIconCode = ([name, value]) => 
    `  static const IconData ${name} = const IconData(0x${value}, fontFamily: fontName);`;

  // 替换模板中的占位符
  const dartCode = dartTemplate.replace('{icon_codes}', 
    iconList.map(generateIconCode).join('\n')
  );

  return dartCode;
};