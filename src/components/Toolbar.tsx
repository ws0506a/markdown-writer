import type { Theme } from '../hooks/useDarkMode';

interface Props {
  theme: Theme;
  mobileView: 'editor' | 'preview';
  onCopy: () => void;
  onExport: () => void;
  onToggleDrafts: () => void;
  onToggleTheme: () => void;
  onMobileView: (v: 'editor' | 'preview') => void;
}

export function Toolbar({
  theme,
  mobileView,
  onCopy,
  onExport,
  onToggleDrafts,
  onToggleTheme,
  onMobileView,
}: Props) {
  return (
    <header className="toolbar">
      <button className="icon-btn" onClick={onToggleDrafts} aria-label="打开草稿列表" title="草稿列表">
        ☰
      </button>
      <h1 className="title">Markdown 写作</h1>

      <div className="segmented mobile-only">
        <button
          className={mobileView === 'editor' ? 'on' : ''}
          onClick={() => onMobileView('editor')}
        >
          编辑
        </button>
        <button
          className={mobileView === 'preview' ? 'on' : ''}
          onClick={() => onMobileView('preview')}
        >
          预览
        </button>
      </div>

      <div className="spacer" />

      <button className="btn" onClick={onCopy} title="复制 Markdown 到剪贴板">
        复制
      </button>
      <button className="btn" onClick={onExport} title="导出为独立 HTML 文件">
        导出
      </button>
      <button className="btn theme-btn" onClick={onToggleTheme} aria-label="切换主题" title="切换主题">
        {theme === 'dark' ? '亮' : '暗'}
      </button>
    </header>
  );
}
