import { ratingToColor } from '@/utils/diceUtils'

test('maps rating 0 to black', () => {
  expect(ratingToColor(0)).toBe('black')
})
test('maps rating 1 to purple', () => {
  expect(ratingToColor(1)).toBe('purple')
})
test('maps rating 8 to blue', () => {
  expect(ratingToColor(8)).toBe('blue')
})
test('returns null for unknown rating', () => {
  expect(ratingToColor(99)).toBeNull()
})
