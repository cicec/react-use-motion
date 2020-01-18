import { is } from '../src/helper'

describe('helper', () => {
  test('is', () => {
    expect(is.arr(['a', 'b'])).toBeTruthy()
    expect(is.obj({ a: 'a', b: 'b' })).toBeTruthy()
    expect(is.fun(() => 'a')).toBeTruthy()
    expect(is.str('a')).toBeTruthy()
    expect(is.num(1)).toBeTruthy()
    expect(is.und(undefined)).toBeTruthy()
    expect(is.nul(null)).toBeTruthy()
    expect(is.set(new Set(['a', 'b']))).toBeTruthy()
    expect(is.map(new Map())).toBeTruthy()
    expect(is.equ({ a: 'a', b: 'b' }, { a: 'a', b: 'b' })).toBeTruthy()
    expect(is.numArr([1, 2])).toBeTruthy()
  })
})
