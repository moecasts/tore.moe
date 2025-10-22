# 🎨 Astro Theme Tore

<div align="center">

![Astro](https://img.shields.io/badge/Astro-5.x-FF5D01?style=for-the-badge&logo=astro&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

A modern, feature-rich Astro blog and portfolio theme with internationalization support.

[Live Demo](https://astro-theme-tore.vercel.app) · [中文](./README.zh-CN.md) · [Report Issue](https://github.com/moecasts/astro-theme-tore/issues) · [Feature Request](https://github.com/moecasts/astro-theme-tore/issues)

</div>

---

## ✨ Features

### 📝 Content Management

- 📄 **MDX Support**: Use React components in Markdown
- ✨ **Enhanced Markdown**: Supports media embedding, math formulas, mermaid, etc.
- 🏷️ **Type-safe Collections**: Content collections with Zod schemas
- 📂 **Categories & Tags**: Effectively organize content
- 🔍 **Full-text Search**: Powered by Pagefind
- 📊 **Reading Time**: Automatically calculates reading time
- 📅 **RSS Feed**: Automatically generates RSS feed

### 🌍 Internationalization

- 🗣️ **Multi-language Support**: Built-in `astro-react-i18next` internationalization
- 🌐 **Auto Language Detection**: Detects user's preferred language
- 📝 **Easy Translation**: JSON-based translation files
- 🔄 **Language Switching**: Seamless language switching

### 🛠️ Developer Experience

- 💪 **TypeScript**: Full TypeScript support
- 🔧 **ESLint & Prettier**: Code quality and formatting
- 🧪 **Type Safety**: Content validation with Zod schemas
- 📦 **Component Library**: Reusable UI components
- 🔥 **Hot Reload**: Fast development with HMR support

---

## 🚀 Quick Start

### Prerequisites

- Node.js 22+
- pnpm

### Installation

```bash
# Clone repository
git clone https://github.com/moecasts/astro-theme-tore.git
cd astro-theme-tore

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Visit `http://localhost:4321` to see your website!

### Build for Production

```bash
pnpm build
```

### Preview Production Build

```bash
pnpm preview
```

---

## 📖 Documentation

### Configuration

Edit `src/config/index.ts` to customize your website:

```typescript
defineConfig({
  site: {
    title: 'Your Website Title',
    description: 'Your Website Description',
    author: 'Your Name',
    url: 'https://your-site.com',
  },
  
  profile: {
    name: 'Your Name',
    avatar: '/images/avatar.jpg',
    bio: 'Your Bio',
    email: 'your@email.com',
  },
});
```

### Creating Content

#### Blog Posts

Create new files in `src/content/posts/`:

```markdown
---
title: Article Title
slug: article-slug
description: Article Description
date: 2025-01-20
categories:
  - Blog
tags:
  - Tutorial
---

Your content...
```

#### Portfolio Projects

Create new files in `src/content/portfolios/`:

```markdown
---
title: Project Name
slug: project-slug
description: Project Description
date: 2025-01-20
demo: https://demo.com
github: https://github.com/user/repo
tags:
  - React
featured: true
---

Project details...
```

---

## 📚 Detailed Guides

- 📖 [Quick Start Guide](./docs/QUICK_START.md)
- 🎨 [Customization Guide](./docs/CUSTOMIZATION.md)
- 🚀 [Deployment Guide](./docs/DEPLOYMENT.md)
- 🤝 [Contribution Guide](./CONTRIBUTING.md)

---

## 🚢 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/moecasts/astro-theme-tore)

### Other Platforms

- **Netlify**: Build command `pnpm build`, publish directory `dist`
- **GitHub Pages**: Includes automatic deployment workflow
- **Cloudflare Pages**: Auto-detects Astro projects
- **Docker**: Includes Dockerfile

---

## 🛠️ Tech Stack

- **Framework**: [Astro](https://astro.build) 5.x
- **UI Library**: [React](https://react.dev) 19
- **Styling**: [Tailwind CSS](https://tailwindcss.com) 4.x
- **Language**: [TypeScript](https://www.typescriptlang.org) 5.x
- **Components**: [shadcn/ui](https://ui.shadcn.com)
- **Icons**: [Iconify](https://iconify.design)
- **Internationalization**: [astro-react-i18next](https://github.com/yassinedoghri/astro-react-i18next)
- **Search**: [Pagefind](https://pagefind.app)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [Contribution Guide](CONTRIBUTING.md) for details

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

---

## 🙏 Acknowledgments

Built with these amazing projects:

- [Astro](https://astro.build) - Web framework for content-driven websites
- [React](https://react.dev) - JavaScript library for building user interfaces
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com) - Beautifully designed components
- [Iconify](https://iconify.design) - Universal icon framework

---

## 🌟 Support the Project

If this theme helps you, please give it a ⭐️ on [GitHub](https://github.com/moecasts/astro-theme-tore)!

---

<div align="center">

**[⬆ Back to top](#-astro-theme-tore)**

Made with ❤️ by [moecasts](https://github.com/moecasts)

</div>
