import { useState } from 'react'
import { Motion } from './motion'
import { Values, MotionConfig } from './types'

type Params<V extends Values> = {
  from: V
  to?: V
  config?: MotionConfig
}

export const useMotion = <V extends Values>({
  from,
  to = from,
  config = {}
}: Params<V>): [V, Motion<V>] => {
  const [values, setValues] = useState(from)
  const [motion] = useState(() => {
    const cb = (values: V) => setValues(values)

    return new Motion(from, to, config, cb)
  })

  return [values, motion]
}
