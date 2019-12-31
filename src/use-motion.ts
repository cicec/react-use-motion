import { useState } from 'react'
import Motion from './motion'
import { Values, MotionConfig } from './types'

function useMotion<T extends Values>(from: T, config: MotionConfig = {}): [T, (to: T) => void] {
  const [value, setValue] = useState(from)
  const [motion] = useState(new Motion(from, (v: T) => setValue(v), config))

  const startMotion = (to: T) => motion.start(to)

  return [value, startMotion]
}

export default useMotion
