import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';

marked.use(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    },
  }),
  { gfm: true, breaks: true }
);

export function renderMarkdown(md: string): string {
  if (!md) return '';
  const raw = marked.parse(md) as string;
  // ADD_ATTR: target — 让外链可以 target="_blank" 而不被 sanitize 抹掉
  return DOMPurify.sanitize(raw, { ADD_ATTR: ['target', 'rel'] });
}

export function extractTitle(md: string): string {
  const match = md.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : '';
}
