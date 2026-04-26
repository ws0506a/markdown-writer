import type { ChangeEvent, KeyboardEvent } from 'react';

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export function Editor({ value, onChange }: Props) {
  // Tab 键插入两个空格而非切走焦点
  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = e.currentTarget;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const next = value.slice(0, start) + '  ' + value.slice(end);
      onChange(next);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 2;
      });
    }
  };

  return (
    <textarea
      className="editor"
      value={value}
      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
      onKeyDown={handleKey}
      placeholder="在这里写 Markdown..."
      spellCheck={false}
      autoFocus
    />
  );
}
