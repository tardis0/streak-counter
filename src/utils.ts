export const KEY = 'streak'

export function formattedDate (date: Date): string {
  return date.toLocaleDateString('en-US')
}

export interface Streak {
  currentCount: number
  startDate: string
  lastLoginDate: string
}

export function buildStreak (date: Date, overrideDefault?: Partial<Streak>): Streak {
  const defaultStreak = {
    currentCount: 1,
    startDate: formattedDate(date),
    lastLoginDate: formattedDate(date)
  }

  return {
    ...defaultStreak,
    ...overrideDefault
  }
}

export function updateStreak (storage: Storage, streak: Streak): void {
  storage.setItem(KEY, JSON.stringify(streak))
}

export function differenceInDays (dateLeft: Date, dateRight: Date): number {
  const diffTime = Math.abs(dateLeft.getTime() - dateRight.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}
