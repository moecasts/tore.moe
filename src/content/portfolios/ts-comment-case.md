---
title: TS Comment Case
slug: ts-comment-case
description: 一个 TypeScript/JavaScript 注释格式转换工具，支持 JSDoc 和单行注释之间的转换。
date: 2024-05-25 14:53:01
thumbnail: /images/cover/ts-comment-case.png
github: https://github.com/moecasts/ts-comment-case
tags:
  - TypeScript
  - JavaScript
  - 代码注释
  - 开发工具
---

## 项目简介

**TS Comment Case** 是一个专为 TypeScript/JavaScript 项目设计的注释格式转换工具。它能够将注释在 JSDoc 格式（`/** */`）和单行注释格式（`//`）之间进行转换，并支持将尾随注释移动到行首。

## 核心特性

- **注释格式转换**：支持 JSDoc 和单行注释之间的相互转换
- **尾随注释移动**：自动将尾随注释移动到标识符前面
- **CLI 工具**：提供命令行接口，便于集成到开发流程
- **编程接口**：提供完整的 API 供其他工具集成使用
- **灵活配置**：支持多种转换动作和注释样式选择

## 功能特性

### 转换动作

- **transform**：转换注释格式
- **move**：移动尾随注释到行首
- **move_and_transform**：移动并转换注释格式

### 注释样式

- **jsdoc**：转换为 JSDoc 格式（`/** */`）
- **single**：转换为单行注释格式（`//`）

## 技术实现

- **TypeScript**: 使用 TypeScript 开发，确保类型安全
- **字符串处理**: 基于正则表达式的高效文本处理
- **Node.js**: 跨平台的命令行工具支持
- **模块化设计**: 提供完整的编程接口

## 使用场景

- **代码规范化**：统一项目中的注释格式
- **代码重构**：在重构过程中调整注释位置和格式
- **团队协作**：确保团队成员使用一致的注释风格
- **IDE 集成**：为编辑器插件提供注释转换功能

## 相关项目

- [nvim-ts-comment-case](https://github.com/moecasts/nvim-ts-comment-case)：Neovim 插件
- [vscode-ts-comment-case](https://github.com/moecasts/vscode-ts-comment-case)：VS Code 插件

## 开源贡献

项目完全开源，欢迎社区贡献。访问 [GitHub 仓库](https://github.com/moecasts/ts-comment-case) 了解更多详情。
