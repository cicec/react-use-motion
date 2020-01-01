export type ValuesFor<T> = T | T[] | { [prop: string]: T }

export type Values = ValuesFor<number>

export type SpringConfig = {
  tension?: number
  friction?: number
  mass?: number
  precision?: number
}

export type MotionConfig = SpringConfig

export type Rgba = {
  r: number
  g: number
  b: number
  a: number
}
