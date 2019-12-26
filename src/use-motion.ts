import { useState } from 'react'
import { Spring, SpringConfig } from './spring'

const useMotion = (from: number, config: SpringConfig = {}) => {
  const [value, setValue] = useState(from)
  const [spring] = useState(new Spring(from, setValue, config))

  const startMotion = (to: number) => spring.start(to)

  return [value, startMotion] as [number, (to: number) => void]
}

export default useMotion
