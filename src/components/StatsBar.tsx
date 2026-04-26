import type { Stats } from '../lib/stats';

interface Props {
  stats: Stats;
  lastSavedAt: number;
}

export function StatsBar({ stats, lastSavedAt }: Props) {
  const savedText = lastSavedAt
    ? `已保存 · ${new Date(lastSavedAt).toLocaleTimeString('zh-CN', { hour12: false })}`
    : '未保存';

  return (
    <div className="stats" role="status" aria-live="polite">
      <span>中文 {stats.chineseChars}</span>
      <span>英文字符 {stats.englishChars}</span>
      <span>英文词 {stats.englishWords}</span>
      <span>总字符 {stats.totalChars}</span>
      <span>预计 {stats.readingMinutes} 分钟</span>
      <span className="saved">{savedText}</span>
    </div>
  );
}
