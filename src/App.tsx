import { useEffect, useMemo, useState } from 'react';
import { Toolbar } from './components/Toolbar';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { StatsBar } from './components/StatsBar';
import { DraftPanel } from './components/DraftPanel';
import { Toast } from './components/Toast';
import { useDrafts } from './hooks/useDrafts';
import { useDarkMode } from './hooks/useDarkMode';
import { computeStats } from './lib/stats';
import { buildStandaloneHtml, downloadFile } from './lib/exportHtml';

interface ToastState {
  msg: string;
  kind: 'info' | 'error';
}

export default function App() {
  const drafts = useDrafts();
  const { theme, toggle: toggleTheme } = useDarkMode();
  const [showDrafts, setShowDrafts] = useState(false);
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');
  const [toast, setToast] = useState<ToastState | null>(null);

  const content = drafts.current?.content ?? '';
  const stats = useMemo(() => computeStats(content), [content]);

  // 自动消失
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  // 写入失败 → toast
  useEffect(() => {
    if (drafts.saveError) {
      setToast({
        msg:
          drafts.saveError.type === 'quota'
            ? '本地存储已满，请删除一些草稿后再试'
            : '保存失败，请检查浏览器存储权限',
        kind: 'error',
      });
    }
  }, [drafts.saveError]);

  const flash = (msg: string, kind: ToastState['kind'] = 'info') =>
    setToast({ msg, kind });

  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(content);
      } else {
        // HTTP 环境降级
        const ta = document.createElement('textarea');
        ta.value = content;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      flash('已复制到剪贴板');
    } catch {
      flash('复制失败，请手动选中复制', 'error');
    }
  };

  const handleExport = () => {
    if (!content.trim()) {
      flash('内容为空，无需导出', 'error');
      return;
    }
    const { filename, html } = buildStandaloneHtml(content);
    downloadFile(filename, html);
    flash(`已导出 ${filename}`);
  };

  // Cmd/Ctrl+S 触发"已保存"提示（实际保存是自动的）
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        flash('已保存');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="app">
      <Toolbar
        theme={theme}
        mobileView={mobileView}
        onCopy={handleCopy}
        onExport={handleExport}
        onToggleDrafts={() => setShowDrafts((v) => !v)}
        onToggleTheme={toggleTheme}
        onMobileView={setMobileView}
      />

      {showDrafts && (
        <DraftPanel
          drafts={drafts.drafts}
          currentId={drafts.currentId}
          onSelect={drafts.select}
          onCreate={() => {
            drafts.create();
            setShowDrafts(false);
          }}
          onRemove={drafts.remove}
          onRename={drafts.rename}
          onClose={() => setShowDrafts(false)}
        />
      )}

      <main className={`main view-${mobileView}`}>
        <div className="pane editor-pane">
          <Editor
            value={content}
            onChange={(v) => drafts.update({ content: v })}
          />
        </div>
        <div className="pane preview-pane">
          <Preview content={content} />
        </div>
      </main>

      <StatsBar stats={stats} lastSavedAt={drafts.lastSavedAt} />
      <Toast message={toast?.msg ?? null} kind={toast?.kind} />
    </div>
  );
}
