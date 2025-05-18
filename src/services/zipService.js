// filepath: /py-to-js-converter/src/services/zipService.js

import JSZip from 'jszip';

export const unzipFiles = async (files) => {
    try {
        const file = files[0]; // 只处理第一个文件
        if (!file || !file.name.endsWith('.zip')) {
            throw new Error('请上传 zip 格式的图标库文件');
        }

        const zipContent = await file.arrayBuffer();
        const loadedZip = await JSZip.loadAsync(zipContent);
        
        // 递归搜索所有文件
        const findCssFile = (zip) => {
            let cssFile = null;
            
            // 按照优先级搜索可能的文件名
            const possibleNames = ['iconfont.css', 'icon.css', 'font.css'];
            
            zip.forEach((relativePath, entry) => {
                if (entry.dir) return;
                
                // 检查所有可能的文件名
                for (const name of possibleNames) {
                    if (relativePath.toLowerCase().endsWith(name)) {
                        console.log('找到目标文件:', relativePath);
                        cssFile = entry;
                        break;
                    }
                }
            });

            return cssFile;
        };

        // 搜索 CSS 文件
        const cssFile = findCssFile(loadedZip);
        
        if (!cssFile) {
            // 输出所有文件列表以便调试
            console.log('ZIP 文件中的所有文件:');
            loadedZip.forEach((path, entry) => {
                if (!entry.dir) console.log(path);
            });
            throw new Error('在 zip 文件中未找到图标字体 CSS 文件');
        }

        console.log('找到 CSS 文件:', cssFile.name);
        const cssContent = await cssFile.async('string');
        
        return { css: cssContent };
        
    } catch (error) {
        console.error('处理 zip 文件时出错:', error);
        throw error;
    }
};