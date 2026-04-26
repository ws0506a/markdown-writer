import { renderMarkdown, extractTitle } from './markdown';

// 内嵌一份精简的 GitHub 风格预览 CSS，使导出 HTML 独立可看
const PREVIEW_CSS = `
body { font: 16px/1.7 -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif; max-width: 760px; margin: 2rem auto; padding: 0 1rem; color: #24292f; background: #fff; }
h1, h2, h3, h4, h5, h6 { line-height: 1.3; margin: 1.5em 0 .6em; }
h1 { font-size: 2em; border-bottom: 1px solid #d0d7de; padding-bottom: .3em; }
h2 { font-size: 1.5em; border-bottom: 1px solid #d0d7de; padding-bottom: .3em; }
p { margin: 0 0 1em; }
a { color: #0969da; }
code { background: #f6f8fa; padding: .2em .4em; border-radius: 4px; font-size: 85%; font-family: ui-monospace, SFMono-Regular, monospace; }
pre { background: #f6f8fa; padding: 1em; border-radius: 6px; overflow: auto; }
pre code { background: none; padding: 0; font-size: 90%; }
blockquote { color: #57606a; border-left: 4px solid #d0d7de; margin: 0 0 1em; padding: 0 1em; }
table { border-collapse: collapse; margin: 1em 0; display: block; overflow-x: auto; }
th, td { border: 1px solid #d0d7de; padding: .4em .8em; }
th { background: #f6f8fa; }
ul, ol { padding-left: 1.6em; }
img { max-width: 100%; }
hr { border: 0; height: 1px; background: #d0d7de; margin: 2em 0; }
input[type=checkbox] { margin-right: .35em; }
`;

const HLJS_CSS = `
.hljs{color:#24292e;background:#f6f8fa}
.hljs-doctag,.hljs-keyword,.hljs-meta .hljs-keyword,.hljs-template-tag,.hljs-template-variable,.hljs-type,.hljs-variable.language_{color:#d73a49}
.hljs-title,.hljs-title.class_,.hljs-title.function_{color:#6f42c1}
.hljs-attr,.hljs-attribute,.hljs-literal,.hljs-meta,.hljs-number,.hljs-operator,.hljs-variable,.hljs-selector-attr,.hljs-selector-class,.hljs-selector-id{color:#005cc5}
.hljs-regexp,.hljs-string,.hljs-meta .hljs-string{color:#032f62}
.hljs-built_in,.hljs-symbol{color:#e36209}
.hljs-comment,.hljs-code,.hljs-formula{color:#6a737d}
.hljs-name,.hljs-quote,.hljs-selector-tag,.hljs-selector-pseudo{color:#22863a}
.hljs-subst{color:#24292e}
.hljs-section{color:#005cc5;font-weight:700}
.hljs-bullet{color:#735c0f}
.hljs-emphasis{font-style:italic}
.hljs-strong{font-weight:700}
.hljs-addition{color:#22863a;background-color:#f0fff4}
.hljs-deletion{color:#b31d28;background-color:#ffeef0}
`;

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!)
  );
}

export function buildStandaloneHtml(md: string): { filename: string; html: string } {
  const title = extractTitle(md) || '未命名文档';
  const body = renderMarkdown(md);
  const html = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(title)}</title>
<style>${PREVIEW_CSS}${HLJS_CSS}</style>
</head>
<body>
${body}
</body>
</html>`;
  // Windows / 跨平台都不允许的非法字符，简单替换
  const safeName = title.replace(/[\\/:*?"<>|]/g, '_').slice(0, 80);
  return { filename: `${safeName}.html`, html };
}

export function downloadFile(filename: string, content: string, mime = 'text/html;charset=utf-8') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
