export const getFormattedUTCDate = (daysOffset = 0): string => {
  const now = new Date();
  now.setDate(now.getDate() + daysOffset);
  now.setHours(23, 59, 0, 0);
  const utcYear = now.getUTCFullYear();
  const utcMonth = String(now.getUTCMonth() + 1).padStart(2, "0");
  const utcDay = String(now.getUTCDate()).padStart(2, "0");
  const utcHours = String(now.getUTCHours()).padStart(2, "0");
  const utcMinutes = String(now.getUTCMinutes()).padStart(2, "0");
  return `${utcYear}-${utcMonth}-${utcDay}T${utcHours}:${utcMinutes}:00Z`;
};
