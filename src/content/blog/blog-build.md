---
title: 如何利用agent实现blog的搭建
description: 啥都不会的小白也能搭建一个美观的blog!
cover: /images/bf2d62430e29763ef1ae18ab70a33ddda9399fac.jpg@.avif
coverPosition: center 12%
pubDate: 2026-05-22
tags:
  - blog
  - agent
categories:
  - 教程
  - 记录
---



# 前言
之前搭建自己的博客的时候，找到的搭建教学多且杂，而且基本都有些老了，已经和当下有点脱节了，跟着一起做老是出现各种问题(比如视频用的版本和新版不匹配)，而我又是个初入门的菜鸟，不知道怎么修复，就很苦恼>.<。但是现在的agent发展很快，而且在进一步体验过后，发现agent对于初学者真的很友好，于是我决定尝试用cursor重建我的blog，并用这篇文章记录我的一个搭建过程，也希望给想要搭建blog的新人提供一个思路^.^
# 搭建流程
## 前提要求
### agent的选择
选择一个 **agent** ,我这里使用的是 **cursor** ，像 **clude code** 、 **codex** 、 **open claw** 、 **trae** 和**通义灵码**等都是可以的。
### blog架构的选择
选择一个你想用的 **blog架构** ，是 **hugo** ，是 **hexo** ，是 **wordpress** 还是 **astro**，这个看你自己喜欢，其实都用agent搭了选什么架构都差不多了 **doge**，至于agent写的好不好和我们这些菜鸟就无关了，学的深了可以再做**迁移重构**。这里，我采用的架构是 **astro架构** 。
## 静态部署
在选择了我们的blog架构之后，我们就能在**本地搭建**一个blog，这一步叫做静态部署。这一步是我们搭建blog的第一步也是重要的一步，以后我们上传文章也和这个有关。
### 具体操作
1. 创建一个新文件夹命名为blog作为仓库(叫什么不重要)
2. 打开cmd,依次输入:
``` powershell
npm --version
git --version
node --version
```
确保你的**环境**正确完好。如果缺乏环境或环境损坏，直接和agent说就行了，当然自己配也是可以的。
3. 打开你的agent，说：请以astro架构为框架，这个blog文件夹作为仓库(把之前新建的文件夹拖给agent)，为我搭建一个属于我的blog。这时agent就会为你搭建好你blog的基本雏形，并给出一个本地的链接。比如说，我这里运行：
``` powershell
PS E:\blog npm run dev
```
回车得：
``` powershell
PS E:\Blog> npm run dev

> blog@0.4.2 dev
> astro dev

14:01:29 [astro-mermaid] Setting up Mermaid integration
14:01:29 [astro-mermaid] Existing rehype plugins:
14:01:29 [types] Generated 1ms
14:01:30 [content] Syncing content
14:01:30 [content] Synced content
14:01:30 [vite] Re-optimizing dependencies because vite config has changed

 astro  v5.18.1 ready in 1759 ms

┃ Local    http://localhost:4321/
┃ Network  use --host to expose

14:01:30 watching for file changes...
```
这里的 **`URL:http://localhost:4321/`**  就是你在运行该服务时的本地blog链接。
4. 点击这个链接，你就可以看见你本地的blog长什么样子了，之后想改东西比如改名称什么的，直接和agent说就行了，最好还是叫agent生成一个**blog使用教程**。这样**静态部署**就完毕了。
## 动态部署
我们做blog肯定不是给自己看的，而是要分享出去，要让我们的blog能在**公网**里看见，这就需要我们使用github进行**动态部署**(当然你买、租一个域名、服务器也是可以的)，这里我们主要说怎么利用github动态部署你的blog。
### 具体操作
1. 打开你的github，没有就创建一个github账号，创建一个仓库，仓库名格式为：你的账户名.github.io(账户名就在自己github首页里，或者在URL里:`https://github.com/你的账户名`)，选择pubilc，不要勾选 “Add a README”（避免和本地代码冲突） 默认分支用 `main`。
2. 打开设置Settings → Pages ，Build and deployment → Source 选 GitHub Actions（不是 “Deploy from a branch”），等 Actions 里 `Deploy to GitHub Pages` 跑成功。这样github仓库就配置好了。
3. 把你的仓库和github链接提交给agent叫它给你进行部署，期间报错都可以直接给agent，它会帮你解决也会解决的很好。
4. 这样**动态部署**就成功了，之后的操作依旧是只要和agent说就行，推送文章直接说推送就行。
## blog美化
一个赏心悦目的blog自然是必不可少的了，毕竟谁不想在自己的blog上贴上自己厨的角色呢!而想要一个好看的blog你可以做以下几步：
1. 找到一个和自己架构匹配的主题框架。
2. 将该主题的链接粘贴给agent下载更换。
3. 在网上搜寻自己喜欢的图片，按照agent生成的使用教程，放入正确的位置，叫agent给你更换，期间有任何问题都可以直接叫agent修改。
4. 增加如音乐播放器，固定对话的机器人等后续所有功能都可以叫它增添。
这样你就有了一个美观的blog了ohhhhhhhhh!!!!!
# 后语
至此我们就靠agent搭建了一个公网可访问、美观大方的blog了，快去试试吧！