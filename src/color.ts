import { Rgba } from './types'

const hexReg = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/
const rgbReg = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
const hslReg = /^hsla?\((\d+),\s*([\d.]+)%,\s*([\d.]+)%(?:,\s*(\d+(?:\.\d+)?))?\)$/

const colorToRgba = (color: string): Rgba => {
  if (hexReg.test(color)) return parseHex(color)
  else if (rgbReg.test(color)) return parseRgb(color)
  else if (hslReg.test(color)) return parseHsl(color)
  else throw new Error('Color format error!')
}

const parseHex = (color: string): Rgba => {
  color = color.replace(/#/, '')

  if (color.length === 3 || color.length === 4) {
    color = `${color.replace(/(.)/g, '$1$1')}ff`
  }

  if (color.length === 6) {
    color = `${color}ff`
  }

  const hexToInt = (str: string) => toInt(str, { radix: 0x10 })

  return {
    r: hexToInt(color[0] + color[1]),
    g: hexToInt(color[2] + color[3]),
    b: hexToInt(color[4] + color[5]),
    a: hexToInt(color[6] + color[7]) / 255
  }
}

const parseRgb = (color: string): Rgba => {
  let match = rgbReg.exec(color)

  if (match) {
    return {
      r: toInt(match[1]),
      g: toInt(match[2]),
      b: toInt(match[3]),
      a: match[4] ? toFloat(match[4]) : 1
    }
  } else {
    throw new Error('Color format error!')
  }
}

const parseHsl = (color: string): Rgba => {
  let match = hslReg.exec(color)

  if (match) {
    const h = toInt(match[1]) / 360
    const s = toFloat(match[2], { max: 100 }) / 100
    const l = toFloat(match[3], { max: 100 }) / 100
    const a = match[4] ? toFloat(match[4]) : 1

    let r, g, b

    if (s === 0) {
      r = g = b = l
    }

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255)
    g = Math.round(hue2rgb(p, q, h) * 255)
    b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255)

    return { r, g, b, a }
  } else {
    throw new Error('Color format error!')
  }
}

const toInt = (str: string, { radix = 10, min = 0, max = 255 } = {}) => {
  const num = parseInt(str, radix)

  if (num < min) return min
  if (num > max) return max
  return num
}

const toFloat = (str: string, { min = 0, max = 1 } = {}) => {
  const num = parseFloat(str)

  if (num < min) return min
  if (num > max) return max
  return num
}

export { colorToRgba }
