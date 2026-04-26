import { useCallback, useEffect, useMemo, useState } from 'react';
import { readKey, writeKey } from '../lib/storage';

export interface Draft {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
}

const DRAFTS_KEY = 'drafts';
const CURRENT_KEY = 'current';

const WELCOME = `# 欢迎使用极简 Markdown 写作工具

在左侧输入 Markdown，右侧实时预览。内容会自动保存到本地，刷新不丢。

## 试试这些

- **粗体**、*斜体*、~~删除线~~
- 链接 [Markdown 教程](https://www.markdownguide.org/)
- 行内代码：\`const x = 1\`

代码块（含语法高亮）：

\`\`\`js
function hello(name) {
  console.log(\`Hello, \${name}!\`);
}
hello("world");
\`\`\`

> 引用：写作是为了让自己更清晰地思考。

| 功能 | 状态 |
| --- | --- |
| 实时预览 | ✅ |
| 自动保存 | ✅ |
| 导出 HTML | ✅ |
| 移动端 | ✅ |

- [x] 完成第一篇笔记
- [ ] 部署到公网
`;

function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function defaultDraft(): Draft {
  return { id: uid(), title: '欢迎', content: WELCOME, updatedAt: Date.now() };
}

export interface SaveError {
  type: 'quota' | 'unknown';
  at: number;
}

export function useDrafts() {
  const [drafts, setDrafts] = useState<Draft[]>(() => {
    const stored = readKey<Draft[]>(DRAFTS_KEY, []);
    return stored.length > 0 ? stored : [defaultDraft()];
  });

  const [currentId, setCurrentId] = useState<string>(() => {
    const stored = readKey<Draft[]>(DRAFTS_KEY, []);
    const ids = stored.map((d) => d.id);
    const storedId = readKey<string>(CURRENT_KEY, '');
    if (storedId && ids.includes(storedId)) return storedId;
    return ids[0] ?? '';
  });

  const [lastSavedAt, setLastSavedAt] = useState<number>(0);
  const [saveError, setSaveError] = useState<SaveError | null>(null);

  // 持久化 drafts —— debounce 400ms，避免每次按键都 stringify 整个数组
  useEffect(() => {
    const t = setTimeout(() => {
      const result = writeKey(DRAFTS_KEY, drafts);
      if (result.ok) {
        setLastSavedAt(Date.now());
        setSaveError(null);
      } else {
        setSaveError({ type: result.reason, at: Date.now() });
      }
    }, 400);
    return () => clearTimeout(t);
  }, [drafts]);

  // 关闭/刷新前同步刷一次盘，避免最后 400ms 输入丢失
  useEffect(() => {
    const flush = () => {
      writeKey(DRAFTS_KEY, drafts);
    };
    window.addEventListener('beforeunload', flush);
    return () => window.removeEventListener('beforeunload', flush);
  }, [drafts]);

  // 持久化 currentId
  useEffect(() => {
    if (currentId) writeKey(CURRENT_KEY, currentId);
  }, [currentId]);

  // 兜底：currentId 失效时回到第一个
  useEffect(() => {
    if (drafts.length > 0 && !drafts.some((d) => d.id === currentId)) {
      setCurrentId(drafts[0].id);
    }
  }, [drafts, currentId]);

  const current = useMemo(
    () => drafts.find((d) => d.id === currentId) ?? drafts[0],
    [drafts, currentId]
  );

  const update = useCallback(
    (patch: Partial<Pick<Draft, 'title' | 'content'>>) => {
      setDrafts((prev) =>
        prev.map((d) => (d.id === currentId ? { ...d, ...patch, updatedAt: Date.now() } : d))
      );
    },
    [currentId]
  );

  const create = useCallback(() => {
    const fresh: Draft = { id: uid(), title: '未命名', content: '', updatedAt: Date.now() };
    setDrafts((prev) => [fresh, ...prev]);
    setCurrentId(fresh.id);
  }, []);

  const remove = useCallback((id: string) => {
    setDrafts((prev) => {
      const next = prev.filter((d) => d.id !== id);
      return next.length > 0 ? next : [defaultDraft()];
    });
  }, []);

  const rename = useCallback((id: string, title: string) => {
    setDrafts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, title, updatedAt: Date.now() } : d))
    );
  }, []);

  const select = useCallback((id: string) => {
    setCurrentId(id);
  }, []);

  return {
    drafts,
    current,
    currentId,
    update,
    create,
    remove,
    rename,
    select,
    lastSavedAt,
    saveError,
  };
}
