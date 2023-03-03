import { JSDOM } from 'jsdom'
import { streakCounter } from '../src'
import { formattedDate } from '../src/utils'

describe('streakCounter', function () {
  let mockLocalStorage: Storage

  beforeEach(() => {
    const mockJSDom = new JSDOM('', { url: 'http://localhost' })
    mockLocalStorage = mockJSDom.window.localStorage
  })
  afterEach(() => {
    mockLocalStorage.clear()
  })
  it('should return a streak object with currenctCount, startDate, and lastLoginDate', async () => {
    // assemble
    const date = new Date()

    // action
    const streak = streakCounter(mockLocalStorage, date)

    // assert
    expect(streak.hasOwnProperty('currentCount')).toBe(true)
    expect(streak.hasOwnProperty('startDate')).toBe(true)
    expect(streak.hasOwnProperty('lastLoginDate')).toBe(true)
  })
  it('should return a streak starting at 1 and keep track of lastLoginDate', async () => {
    // assemble
    const date = new Date()
    const dateFormatted = formattedDate(date)

    // action
    const streak = streakCounter(mockLocalStorage, date)

    // assert
    expect(streak.currentCount).toBe(1)
    expect(streak.lastLoginDate).toBe(dateFormatted)
  })
  it('should store the streak in localStorage', async () => {
    // assemble
    const date = new Date()
    const key = 'streak'

    // action
    streakCounter(mockLocalStorage, date)

    // assert
    const streakAsString = mockLocalStorage.getItem(key)
    expect(streakAsString).not.toBeNull()
  })

  describe('with a pre-populated streak', () => {
    let mockLocalStorage: Storage
    beforeEach(() => {
      const mockJSDom = new JSDOM('', { url: 'https://localhost' })

      mockLocalStorage = mockJSDom.window.localStorage

      // Use date in past so it’s always the same
      const date = new Date('12/12/2021')

      const streak = {
        currentCount: 1,
        startDate: formattedDate(date),
        lastLoginDate: formattedDate(date)
      }

      mockLocalStorage.setItem('streak', JSON.stringify(streak))
    })
    afterEach(() => {
      mockLocalStorage.clear()
    })
    it('should return the streak from localStorage', () => {
      const date = new Date('12/12/2021')
      const streak = streakCounter(mockLocalStorage, date)

      // Should match the dates used to set up the tests
      expect(streak.startDate).toBe('12/12/2021')
    })
    it('should increment the streak', async () => {
      // assemble
      const date = new Date('12/13/2021')
      const test: boolean = true

      // action
      const streak = streakCounter(mockLocalStorage, date)

      // assert
      expect(streak.currentCount).toBe(2)
      expect(test).toBe(true)
    })
    it('should not increment the streak when login days not consecutive', async () => {
      // assemble
      const date = new Date('12/14/2021')

      // action
      const streak = streakCounter(mockLocalStorage, date)

      // assert
      expect(streak.currentCount).toBe(1)
    })
    it('should save the incremented streak to local storage', async () => {
      const key = 'streak'
      const date = new Date('12/13/2021')

      streakCounter(mockLocalStorage, date)

      const streakAsString = mockLocalStorage.getItem(key)
      const streak = JSON.parse(streakAsString ?? '')

      expect(streak.currentCount).toBe(2)
    })
    it('should reset if not consecutive', async () => {
      const date = new Date('12/13/2021')
      const streak = streakCounter(mockLocalStorage, date)

      expect(streak.currentCount).toBe(2)

      const dateUpdated = new Date('12/15/2021')
      const streakUpdated = streakCounter(mockLocalStorage, dateUpdated)

      expect(streakUpdated.currentCount).toBe(1)
    })
    it('should save the reset streak to localStorage', async () => {
      const key = 'streak'
      const date = new Date('12/13/2021')

      streakCounter(mockLocalStorage, date)

      const dateUpdated = new Date('12/15/2021')
      streakCounter(mockLocalStorage, dateUpdated)

      const streakAsString = mockLocalStorage.getItem(key)

      const streak = JSON.parse(streakAsString ?? '')

      expect(streak.currentCount).toBe(1)
    })
    it('should not reset the streak for same-day login', async () => {
      const date = new Date('12/13/2021')

      streakCounter(mockLocalStorage, date)

      const dateUpdated = new Date('12/13/2021')
      const streakUpdated = streakCounter(mockLocalStorage, dateUpdated)

      expect(streakUpdated.currentCount).toBe(2)
    })
  })
})
