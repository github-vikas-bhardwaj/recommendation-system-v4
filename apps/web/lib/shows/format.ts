export function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").trim();
}

export function toDateString(value: string | null): string | null {
  if (!value) return null;
  return value.slice(0, 10);
}

export function getShowImageSrc(
  value: string | null | undefined,
): string | null {
  if (!value) return null;

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}
