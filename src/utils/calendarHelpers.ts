export const isContinuousRange = (dates: Date[]): boolean => {
  if (dates.length < 2) return true;
  const sortedDates = [...dates].sort((a, b) => a.getTime() - b.getTime());
  for (let i = 1; i < sortedDates.length; i++) {
    const prevDay = new Date(sortedDates[i - 1]);
    prevDay.setDate(prevDay.getDate() + 1);
    if (prevDay.toDateString() !== sortedDates[i].toDateString()) {
      return false;
    }
  }
  return true;
};
