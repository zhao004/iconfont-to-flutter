// filepath: /py-to-js-converter/py-to-js-converter/src/utils/parser.js

export function parsePythonFileContent(content) {
    // 解析Python文件内容并返回一个对象
    const lines = content.split('\n');
    const parsedContent = {
        functions: [],
        classes: [],
        variables: []
    };

    lines.forEach(line => {
        line = line.trim();
        if (line.startsWith('def ')) {
            parsedContent.functions.push(line);
        } else if (line.startsWith('class ')) {
            parsedContent.classes.push(line);
        } else if (line.includes('=')) {
            parsedContent.variables.push(line);
        }
    });

    return parsedContent;
}

export function extractFileName(filePath) {
    // 从文件路径中提取文件名
    return filePath.split('/').pop().split('.')[0];
}