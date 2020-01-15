import { useState, useRef } from 'react'
import { Motion } from './motion'
import { Action } from './action'
import { Values, MotionConfig } from './types'

type Params<V extends Values> = {
  from: V
  to: V
  config?: MotionConfig
}

export const useMotion = <V extends Values>({
  from,
  to,
  config = {}
}: Params<V>): [V, Motion<V>] => {
  const [values, setValues] = useState(from)
  const motion = useRef(new Motion(new Action(from, to, config), (values: V) => setValues(values)))

  return [values, motion.current]
}
