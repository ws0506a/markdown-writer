# 极简 Markdown 写作工具

**线上 Demo**：<https://markdown-writer-five.vercel.app>

左右分栏的 Markdown 编辑器，实时预览、本地保存、导出 HTML、移动端可用。

## 本地运行

> **注意**：如果项目目录在 OneDrive 同步路径下，请先把 `markdown-writer/` 移出 OneDrive（或在 OneDrive 设置里把 `node_modules` 加入忽略），否则 `npm install` 会把 30k+ 文件灌进同步队列，硬盘和 CPU 都会卡。

```bash
cd markdown-writer
npm install
npm run dev
```

打开浏览器访问 http://localhost:5173

## 构建与预览

```bash
npm run build      # 输出到 dist/
npm run preview    # 本地预览构建产物
```

## 部署

### Vercel（推荐，零配置）

1. 把仓库 push 到 GitHub
2. 在 Vercel Dashboard 点 **New Project → Import**，选这个仓库
3. Framework 自动识别为 Vite，直接 Deploy

### Cloudflare Pages / Netlify

- Build command: `npm run build`
- Output directory: `dist`

## 技术栈

- **React 18 + TypeScript + Vite** —— SPA 框架与构建工具
- **marked + marked-highlight** —— Markdown 解析（GFM 全开）
- **DOMPurify** —— HTML 净化，防 XSS
- **highlight.js** —— 代码块语法高亮（GitHub 主题）
- 原生 `<textarea>` 编辑器、CSS Variables 双主题
- 状态管理：`useState` + 自定义 Hook，无第三方状态库

## 已实现功能

**必做**

- [x] 左右分栏：左侧 Markdown 编辑器，右侧实时预览
- [x] 字数统计：中文字符 / 英文字符 / 英文词 / 总字符 / 预计阅读时间（中文 300 字/分钟）
- [x] 自动保存到 localStorage，刷新不丢
- [x] 一键导出独立 HTML 文件（含样式、可单独打开）
- [x] 一键复制 Markdown 到剪贴板（HTTP 环境降级到 execCommand）
- [x] 移动端：单栏 + 编辑/预览切换 + 全屏 Drawer

**加分**

- [x] 多份草稿管理：新建 / 切换 / 重命名（双击或点改名）/ 删除
- [x] 深色模式：跟随系统 + 手动切换 + 持久化
- [x] 代码块语法高亮（亮/暗双主题）
- [x] Tab 键缩进 2 空格、Cmd/Ctrl+S 触发"已保存"提示

## 文件结构

```
src/
├── App.tsx              组合根组件
├── main.tsx             ReactDOM 入口
├── styles.css           全局样式 + 主题变量
├── lib/
│   ├── markdown.ts      marked + marked-highlight + DOMPurify 配置
│   ├── stats.ts         中英文字符 / 词数 / 阅读时间
│   ├── storage.ts       localStorage 封装（含 quota 检测）
│   └── exportHtml.ts    生成独立 HTML 文档 + 触发下载
├── hooks/
│   ├── useDrafts.ts     草稿 CRUD + 自动持久化
│   └── useDarkMode.ts   主题状态
└── components/
    ├── Toolbar.tsx
    ├── DraftPanel.tsx
    ├── Editor.tsx
    ├── Preview.tsx
    ├── StatsBar.tsx
    └── Toast.tsx
```

## 已知限制

- 文档超过约 5 万字时，每次按键都会重新解析整篇 Markdown，会有可感知延迟。修复思路是把 `renderMarkdown` 调用包一层 ~250 ms debounce。
- localStorage 单域名上限 5MB，达到上限会用 Toast 提示，但不会自动清理旧草稿。
- HTTP 协议下 `navigator.clipboard.writeText` 不可用，已用旧版 `execCommand('copy')` 兜底，但部分新浏览器已弃用此 API。
- 自动保存采用 400 ms debounce，并在 `beforeunload` 时同步刷盘，正常关闭页面不会丢字；强制断电极端情况下最多丢失 400 ms 内的输入。

## 关于复盘文档

`复盘.md` 是任务交付物之一，**必须由你本人填写**，不要让 AI 代笔——任务书把它列为「比代码更能反映工程素养」的考察项，让 AI 替写就直接破坏了考察意图。仓库里 `复盘.md` 是空模板，照着 5 个问题填即可。

## License

MIT
