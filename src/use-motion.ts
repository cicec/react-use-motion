import { useState } from 'react'
import { Motion } from './motion'
import { Action } from './action'
import { Values, MotionConfig } from './types'

function useMotion<V extends Values>(from: V, config: MotionConfig = {}): [V, (to: V) => void] {
  const action = new Action(from, config)

  const [values, setValues] = useState(from)
  const [motion] = useState(new Motion(action, (values: V) => setValues(values)))

  const startTo = (to: V) => motion.start(to)

  return [values, startTo]
}

export default useMotion
