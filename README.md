# IconFon to Flutter实体类

![示例图](/assets/images/example.png)

## 项目简介
该项目提供一个工具，可以将阿里巴巴图标库导出的 ZIP 文件转换为 Flutter IconFont 代码。用户可以通过拖放或点击上传 ZIP 文件，系统会自动解析其中的图标定义，并生成对应的 Dart 代码。

> 本项目完全由 GitHub Copilot AI 编写，展示了人工智能在实际开发中的应用。

## 功能
- 支持拖放或点击上传 ZIP 文件
- 自动解析 iconfont CSS 文件
- 生成 Flutter IconFont Dart 代码
- 代码高亮显示
- 一键复制功能
- 操作结果提示

## 使用说明
1. 从阿里巴巴图标库下载图标项目的 ZIP 文件
2. 将 ZIP 文件拖入网页中的拖放区域，或点击该区域选择文件
3. 等待系统自动生成 Dart 代码
4. 点击"复制代码"按钮复制生成的代码
5. 将代码粘贴到你的 Flutter 项目中使用

## 技术栈
- React
- Vite
- JSZip
- CSS3

## 安装与使用
1. 克隆项目到本地：
   ```bash
   git clone https://github.com/zhao004/iconfont-to-flutter.git
   ```
2. 进入项目目录：
   ```bash
   cd iconfont-to-flutter
   ```
3. 安装依赖：
   ```bash
   npm install
   ```
4. 启动开发服务器：
   ```bash
   npm run dev
   ```

## 编译部署
1. 构建生产版本：
   ```bash
   npm run build
   ```
   构建完成后，生成的文件将位于 `dist` 目录中。

2. 本地预览生产版本：
   ```bash
   npm run preview
   ```

3. 部署到服务器：
   - 将 `dist` 目录中的所有文件上传到你的 Web 服务器
   - 配置服务器将所有请求重定向到 index.html（对于 SPA 应用）

4. 部署到 GitHub Pages：
   - 在 GitHub 仓库设置中启用 GitHub Pages
   - 选择 gh-pages 分支作为部署源
   - 添加以下脚本到 package.json：
     ```json
     {
       "scripts": {
         "deploy": "gh-pages -d dist"
       }
     }
     ```
   - 运行部署命令：
     ```bash
     npm run deploy
     ```
   - **Vite 项目还需要修改 vite.config.js**
      ```js
      export default defineConfig({
         base:'/iconfont-to-flutter/',
         // 其他配置...
      })
      ```

## 贡献
欢迎任何形式的贡献！请提交问题或拉取请求。

## 许可证
该项目采用 MIT 许可证。