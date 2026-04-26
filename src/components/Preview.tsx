import { useMemo } from 'react';
import { renderMarkdown } from '../lib/markdown';

interface Props {
  content: string;
}

export function Preview({ content }: Props) {
  const html = useMemo(() => renderMarkdown(content), [content]);

  if (!content.trim()) {
    return <div className="preview empty">预览将出现在这里</div>;
  }
  return (
    <div
      className="preview markdown-body"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
