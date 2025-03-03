export const normalizeDate = (dateString: string) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date.toISOString(); // Convert to ISO 8601
};

export const normalizeSearchQuery = (query: string) => {
  if (!query) return "";
  return query
    .toLowerCase()
    .trim()
    .replace(/[^a-zA-Z0-9\s]/g, ""); // Remove special characters
};
