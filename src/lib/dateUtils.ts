const pad = (n: number): string => String(n).padStart(2, "0");

export const toDateString = (date: Date): string => {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);
  return `${normalizedDate.getFullYear()}-${pad(normalizedDate.getMonth() + 1)}-${pad(normalizedDate.getDate())}`;
};

export const getStartOfWeek = (date: Date = new Date()): Date => {
  const startOfWeek = new Date(date);
  startOfWeek.setHours(0, 0, 0, 0);

  const dayOfWeek = startOfWeek.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  startOfWeek.setDate(startOfWeek.getDate() + mondayOffset);

  return startOfWeek;
};

export const getWeekRange = (
  date: Date = new Date(),
  weekOffset: number = 0,
): { start: string; end: string } => {
  const startOfWeek = getStartOfWeek(date);
  startOfWeek.setDate(startOfWeek.getDate() + weekOffset * 7);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);

  return {
    start: toDateString(startOfWeek),
    end: toDateString(endOfWeek),
  };
};

export const getMonthRange = (
  date: Date = new Date(),
): { start: string; end: string } => {
  const startOfMonth = new Date(date);
  startOfMonth.setHours(0, 0, 0, 0);
  startOfMonth.setDate(1);

  const endOfMonth = new Date(startOfMonth);
  endOfMonth.setMonth(endOfMonth.getMonth() + 1);
  endOfMonth.setDate(0);

  return {
    start: toDateString(startOfMonth),
    end: toDateString(endOfMonth),
  };
};

export const isDateInRange = (
  dateString: string,
  start: string,
  end: string,
): boolean => dateString >= start && dateString <= end;

export const computeDateStreak = (
  dateStrings: readonly string[],
  now: Date = new Date(),
): number => {
  if (dateStrings.length === 0) return 0;

  const uniqueDates = new Set(dateStrings);
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  let streak = 0;

  while (true) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - streak);
    const checkDateString = toDateString(checkDate);

    if (!uniqueDates.has(checkDateString)) {
      return streak;
    }

    streak += 1;
  }
};

export const computeWeeklyStreak = (
  dateStrings: readonly string[],
  now: Date = new Date(),
): number => {
  if (dateStrings.length === 0) return 0;

  const dateSet = new Set(dateStrings);
  let streak = 0;
  let weekOffset = 0;

  while (true) {
    const week = getWeekRange(now, -weekOffset);
    const hasEntry = [...dateSet].some(
      (d) => d >= week.start && d <= week.end,
    );

    if (!hasEntry) return streak;

    streak += 1;
    weekOffset += 1;
  }
};
