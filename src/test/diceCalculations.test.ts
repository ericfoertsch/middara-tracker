import { averageDie, calculatePool } from '@/utils/diceCalculations'
import { dice } from '@/assets/data/diceData'

test('averageDie calculates correct mean value for purple', () => {
  // purple: [1, 2, 3, 5, 6, 7] → mean = 24/6 = 4
  const result = averageDie(dice.purple)
  expect(result.averageValue).toBeCloseTo(4, 5)
})

test('averageDie calculates symbol probabilities for purple', () => {
  // purple: shield on face 4, burst on face 5, book on face 6 → each 1/6
  const result = averageDie(dice.purple)
  expect(result.symbolProbs.shield).toBeCloseTo(1 / 6, 5)
  expect(result.symbolProbs.burst).toBeCloseTo(1 / 6, 5)
  expect(result.symbolProbs.book).toBeCloseTo(1 / 6, 5)
  expect(result.symbolProbs.skull).toBe(0)
})

test('calculatePool sums values from multiple dice', () => {
  // two purple dice: expected value = 2 × 4 = 8
  const result = calculatePool(['purple', 'purple'])
  expect(result.averageTotal).toBeCloseTo(8, 5)
})

test('calculatePool returns min and max values', () => {
  // purple: min face value = 1, max = 7
  const result = calculatePool(['purple'])
  expect(result.minTotal).toBe(1)
  expect(result.maxTotal).toBe(7)
})

test('averageDie handles dice with no value faces (black)', () => {
  // black die has no numeric values — just symbols
  const result = averageDie(dice.black)
  expect(result.averageValue).toBe(0)
  expect(result.symbolProbs.skull).toBeGreaterThan(0)
})
