import { GlobalAlertManager } from '../../components/Global/AlertModal';
import profanityWordsRaw from './profanity.json'; 

// normalize list
const profanityWords: string[] = (profanityWordsRaw as string[])
  .map(w => w.trim().toLowerCase())
  .filter(Boolean);

// build a single regex to catch any of them as whole words
const profanityRegex: RegExp | null = profanityWords.length > 0
  ? new RegExp(
      `\\b(?:${profanityWords
        .map(w => w.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'))
        .join('|')})\\b`,
      'i'
    )
  : null;

// check + alert function
export function checkProfanityAndAlert(
  input: string,
  onConfirm?: () => void
): boolean {
  if (!profanityRegex) return false;

  if (profanityRegex.test(input)) {
    GlobalAlertManager.show(
      'Từ không phù hợp',
      'Nội dung có chứa từ ngữ không phù hợp. Vui lòng chỉnh sửa trước khi gửi.',
      onConfirm
    );
    return true;
  }

  return false;
}
