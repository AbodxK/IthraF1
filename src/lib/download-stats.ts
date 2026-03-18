const STORAGE_KEY = "ithraf1-downloads";

export function getDownloadCount(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
}

export function incrementDownloads(): number {
  const count = getDownloadCount() + 1;
  localStorage.setItem(STORAGE_KEY, String(count));
  return count;
}
