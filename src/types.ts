export type Positions = number | number[] | { [prop: string]: number }

export type SpringConfig = {
  tension?: number
  friction?: number
  mass?: number
  precision?: number
}

export type MotionConfig = SpringConfig
