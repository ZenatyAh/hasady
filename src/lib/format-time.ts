export function formatRelativeTime(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return dateStr;

    const diffMs = Date.now() - date.getTime();
    const hours = Math.floor(diffMs / 3_600_000);
    if (hours < 1) return 'الآن';
    if (hours < 24) return `قبل ${hours} ساعة`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'أمس';
    if (days < 7) return `قبل ${days} أيام`;
    return date.toLocaleDateString('ar-SA');
  } catch {
    return dateStr;
  }
}
