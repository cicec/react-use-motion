export type ValuesFor<T> = T | T[] | { [prop: string]: T }

export type Values = ValuesFor<number>

export type SpringConfig = {
  tension?: number
  friction?: number
  mass?: number
  precision?: number
}

export type MotionConfig = SpringConfig
