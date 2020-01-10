export type ValuesFor<T> = T | { [key: string]: T }

export type Values = ValuesFor<number | string>

export type SpringConfig = {
  tension?: number
  friction?: number
  mass?: number
  precision?: number
}

export type MotionConfig = SpringConfig

export type Action<T extends Values> = { values: T, type: 'NUMBER' | 'COLOR' }
