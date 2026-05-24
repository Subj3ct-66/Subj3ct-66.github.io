# $ubJ3C7のBlog — Astro Theme Reimu

主题文档：[Astro Theme Reimu 使用指南](https://d-sketon.github.io/astro-theme-reimu/blog/theme-guide/)

## 本地开发

```powershell
cd E:\Blog
npm install
npm run dev
```

## 写文章

在 `src/content/blog/` 新建 `.md` 或 `.mdx`：

```yaml
---
title: 标题
description: 摘要（不要用纯数字）
pubDate: 2026-05-22
tags: [标签1, 标签2]
categories: [分类名]
---
```

## 改站点外观与功能

编辑 **`src/config.ts`**（标题、菜单、侧边栏、评论、页脚等）。

## 部署到云服务器

```powershell
$env:SITE_URL="https://你的域名.com"
npm run build
# 将 dist/ 内所有文件上传到服务器 /var/www/blog/
```

## 评论（不用 GitHub）

在 `src/config.ts` 中可启用 **Waline** / **Twikoo** 等，见主题指南「评论系统配置」。
