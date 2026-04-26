import { useState } from 'react';
import type { Draft } from '../hooks/useDrafts';

interface Props {
  drafts: Draft[];
  currentId: string;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onRemove: (id: string) => void;
  onRename: (id: string, title: string) => void;
  onClose: () => void;
}

export function DraftPanel({
  drafts,
  currentId,
  onSelect,
  onCreate,
  onRemove,
  onRename,
  onClose,
}: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState('');

  const startRename = (d: Draft) => {
    setEditingId(d.id);
    setDraftTitle(d.title);
  };

  const commit = () => {
    if (editingId && draftTitle.trim()) {
      onRename(editingId, draftTitle.trim());
    }
    setEditingId(null);
  };

  return (
    <>
      <div className="drawer-mask" onClick={onClose} aria-hidden />
      <aside className="drawer" role="dialog" aria-label="草稿列表">
        <div className="drawer-head">
          <h2>草稿</h2>
          <button className="btn" onClick={onCreate} title="新建草稿">
            新建
          </button>
        </div>
        <ul className="draft-list">
          {drafts.map((d) => (
            <li key={d.id} className={d.id === currentId ? 'on' : ''}>
              {editingId === d.id ? (
                <input
                  autoFocus
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  onBlur={commit}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') commit();
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                />
              ) : (
                <button
                  className="draft-pick"
                  onClick={() => {
                    onSelect(d.id);
                    onClose();
                  }}
                  onDoubleClick={() => startRename(d)}
                >
                  <span className="d-title">{d.title || '未命名'}</span>
                  <span className="d-meta">
                    {new Date(d.updatedAt).toLocaleString('zh-CN', { hour12: false })}
                  </span>
                </button>
              )}
              <div className="d-actions">
                <button className="link-btn" onClick={() => startRename(d)} title="重命名">
                  改名
                </button>
                <button
                  className="link-btn danger"
                  onClick={() => {
                    if (confirm(`确认删除「${d.title || '未命名'}」？`)) onRemove(d.id);
                  }}
                  title="删除"
                >
                  删除
                </button>
              </div>
            </li>
          ))}
        </ul>
        <p className="drawer-tip">双击标题或点「改名」可重命名 · Esc 取消编辑</p>
      </aside>
    </>
  );
}
