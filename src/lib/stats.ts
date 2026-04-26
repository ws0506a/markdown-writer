export interface Stats {
  chineseChars: number;
  englishChars: number;
  englishWords: number;
  totalChars: number;
  readingMinutes: number;
}

// 中文按 300 字/分钟，英文按 200 词/分钟（任务书指定中文 300）
export function computeStats(text: string): Stats {
  const chineseChars = (text.match(/[一-龥]/g) || []).length;
  const englishChars = (text.match(/[A-Za-z]/g) || []).length;
  const englishWords = (text.match(/[A-Za-z]+/g) || []).length;
  const totalChars = text.length;

  const minutes = chineseChars / 300 + englishWords / 200;
  const hasContent = chineseChars + englishChars > 0;
  const readingMinutes = hasContent ? Math.max(1, Math.ceil(minutes)) : 0;

  return { chineseChars, englishChars, englishWords, totalChars, readingMinutes };
}
