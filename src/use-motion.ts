import { useState } from 'react'
import { Motion, MotionConfig } from './motion'

const useMotion = (from: number, config: MotionConfig = {}) => {
  const [value, setValue] = useState(from)
  const [spring] = useState(new Motion(from, setValue, config))

  const startMotion = (to: number) => spring.start(to)

  return [value, startMotion] as [number, (to: number) => void]
}

export default useMotion
