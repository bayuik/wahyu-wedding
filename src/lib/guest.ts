export function getGuestNameFromUrl(url: URL): string | null {
  const to = url.searchParams.get("to");
  if (!to) return null;
  return decodeURIComponent(to.replace(/\+/g, " "));
}
