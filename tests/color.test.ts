import { isColor, stringToRgba, rgbaToString } from '../src/color'

const color1 = '#aabbcc'
const color2 = 'rgba(255, 255, 0, 0.2)'
const color3 = 'hsla(18, 58%, 57%, 0.4)'
const color4 = '#aaggcc'
const color5 = 'rg(255, 255, 0)'

describe('color', () => {
  test('is color string', () => {
    expect(isColor(color1)).toBeTruthy()
    expect(isColor(color2)).toBeTruthy()
    expect(isColor(color3)).toBeTruthy()

    expect(isColor(color4)).toBeFalsy()
    expect(isColor(color5)).toBeFalsy()
  })

  test('color string to rgba array', () => {
    expect(stringToRgba(color1)).toStrictEqual([170, 187, 204, 1])
    expect(stringToRgba(color2)).toStrictEqual([255, 255, 0, 0.2])
    expect(stringToRgba(color3)).toStrictEqual([209, 120, 82, 0.4])
  })

  test('rgba array to rgba string', () => {
    expect(rgbaToString([170, 187, 204, 1])).toBe('rgba(170, 187, 204, 1)')
    expect(rgbaToString([255, 255, 0, 0.2])).toBe('rgba(255, 255, 0, 0.2)')
    expect(rgbaToString([209, 120, 82, 0.4])).toBe('rgba(209, 120, 82, 0.4)')
  })
})
