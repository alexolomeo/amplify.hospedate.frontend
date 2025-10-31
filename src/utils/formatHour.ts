export const formatHour = (hour: number): string => {
  // Handles the case of 12 AM, 1 AM, and 2 AM, which are > 23 in your enum
  if (hour > 23) {
    const adjustedHour = hour - 24;
    return `${adjustedHour.toString().padStart(2, '0')}:00 a.m.`;
  }

  // Converts to 12-hour format
  const ampm = hour >= 12 ? 'p.m.' : 'a.m.';
  const formattedHour = hour % 12 || 12; // Hour 0 becomes 12

  return `${formattedHour.toString().padStart(2, '0')}:00 ${ampm}`;
};
