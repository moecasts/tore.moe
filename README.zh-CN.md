# 🎨 Astro Theme Tore

<div align="center">

![Astro](https://img.shields.io/badge/Astro-5.x-FF5D01?style=for-the-badge&logo=astro&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

一个现代化、功能丰富的 Astro 博客和作品集主题，支持国际化。

[在线演示](https://astro-theme-tore.vercel.app) · [English](./README.md) · [报告问题](https://github.com/moecasts/astro-theme-tore/issues) · [功能建议](https://github.com/moecasts/astro-theme-tore/issues)

</div>

---

## ✨ 特性

### 📝 内容管理

- 📄 **MDX 支持**：在 Markdown 中使用 React 组件
- ✨ **Markdown 增强**：支持媒体嵌入、数学公式、mermaid 等
- 🏷️ **类型安全集合**：使用 Zod 模式的内容集合
- 📂 **分类和标签**：有效组织内容
- 🔍 **全文搜索**：由 Pagefind 驱动
- 📊 **阅读时间**：自动计算阅读时间
- 📅 **RSS 订阅**：自动生成 RSS 源

### 🌍 国际化

- 🗣️ **多语言支持**：内置 `astro-react-i18next` 国际化
- 🌐 **自动语言检测**：检测用户首选语言
- 📝 **简易翻译**：基于 JSON 的翻译文件
- 🔄 **语言切换**：无缝切换语言

### 🛠️ 开发体验

- 💪 **TypeScript**：完整的 TypeScript 支持
- 🔧 **ESLint & Prettier**：代码质量和格式化
- 🧪 **类型安全**：使用 Zod 模式验证内容
- 📦 **组件库**：可复用的 UI 组件
- 🔥 **热重载**：快速开发，支持 HMR

---

## 🚀 快速开始

### 前置要求

- Node.js 22+
- pnpm

### 安装

```bash
# 克隆仓库
git clone https://github.com/moecasts/astro-theme-tore.git
cd astro-theme-tore

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

访问 `http://localhost:4321` 查看你的网站！

### 构建生产版本

```bash
pnpm build
```

### 预览生产构建

```bash
pnpm preview
```

---

## 📖 文档

### 配置

编辑 `src/config/index.ts` 自定义你的网站：

```typescript
defineConfig({
  site: {
    title: '你的网站标题',
    description: '你的网站描述',
    author: '你的名字',
    url: 'https://your-site.com',
  },
  
  profile: {
    name: '你的名字',
    avatar: '/images/avatar.jpg',
    bio: '你的简介',
    email: 'your@email.com',
  },
});
```

### 创建内容

#### 博客文章

在 `src/content/posts/` 创建新文件：

```markdown
---
title: 文章标题
slug: article-slug
description: 文章描述
date: 2025-01-20
categories:
  - Blog
tags:
  - Tutorial
---

你的内容...
```

#### 作品集项目

在 `src/content/portfolios/` 创建新文件：

```markdown
---
title: 项目名称
slug: project-slug
description: 项目描述
date: 2025-01-20
demo: https://demo.com
github: https://github.com/user/repo
tags:
  - React
featured: true
---

项目详情...
```

---

## 📚 详细指南

- 📖 [快速开始指南](./docs/QUICK_START.md)
- 🎨 [自定义指南](./docs/CUSTOMIZATION.md)
- 🚀 [部署指南](./docs/DEPLOYMENT.md)
- 🤝 [贡献指南](./CONTRIBUTING.md)

---

## 🚢 部署

### Vercel（推荐）

[![使用 Vercel 部署](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/moecasts/astro-theme-tore)

### 其他平台

- **Netlify**：构建命令 `pnpm build`，发布目录 `dist`
- **GitHub Pages**：包含自动部署工作流
- **Cloudflare Pages**：自动检测 Astro 项目
- **Docker**：包含 Dockerfile

---

## 🛠️ 技术栈

- **框架**：[Astro](https://astro.build) 5.x
- **UI 库**：[React](https://react.dev) 19
- **样式**：[Tailwind CSS](https://tailwindcss.com) 4.x
- **语言**：[TypeScript](https://www.typescriptlang.org) 5.x
- **组件**：[shadcn/ui](https://ui.shadcn.com)
- **图标**：[Iconify](https://iconify.design)
- **国际化**：[astro-react-i18next](https://github.com/yassinedoghri/astro-react-i18next)
- **搜索**：[Pagefind](https://pagefind.app)

---

## 🤝 贡献

欢迎贡献！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支（`git checkout -b feature/amazing-feature`）
3. 提交更改（`git commit -m 'Add amazing feature'`）
4. 推送到分支（`git push origin feature/amazing-feature`）
5. 开启 Pull Request

详见 [贡献指南](CONTRIBUTING.md)

---

## 📝 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

---

## 🙏 致谢

使用以下优秀项目构建：

- [Astro](https://astro.build) - 内容驱动网站的 Web 框架
- [React](https://react.dev) - 用于构建用户界面的 JavaScript 库
- [Tailwind CSS](https://tailwindcss.com) - 实用优先的 CSS 框架
- [shadcn/ui](https://ui.shadcn.com) - 精美设计的组件
- [Iconify](https://iconify.design) - 通用图标框架

---

## 🌟 支持项目

如果这个主题对你有帮助，请在 [GitHub](https://github.com/moecasts/astro-theme-tore) 上给个 ⭐️！

---

<div align="center">

**[⬆ 返回顶部](#-astro-theme-tore)**

用 ❤️ 制作，作者 [moecasts](https://github.com/moecasts)

</div>
