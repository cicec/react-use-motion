import { useState } from 'react'
import Motion from './motion'
import { Positions, MotionConfig } from './types'

const useMotion = (from: Positions, config: MotionConfig = {}) => {
  const [value, setValue] = useState(from)
  const [motion] = useState(new Motion(from, setValue, config))

  const startMotion = (to: Positions) => motion.start(to)

  return [value, startMotion] as [Positions, (to: Positions) => void]
}

export default useMotion
