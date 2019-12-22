import { useState, useRef } from 'react'

interface Config {
  stiffness?: number
  damping?: number
  mass?: number
}

const useMotion = (
  initialValue: number,
  { stiffness = 170, damping = 26, mass = 1 }: Config = {}
) => {
  const [value, setValue] = useState(initialValue)
  const [velocity, setVelocity] = useState(0)

  let { current: raf } = useRef(0)

  const getPrecision = (v: number) => Math.abs(v * 1e-5)

  const set = (targetValue: number) => {
    if (raf) return

    const precision = getPrecision(targetValue - value)

    let currentTime = performance.now()
    let currentValue = value
    let currentVelocity = velocity

    const loop = () => {
      const distance = targetValue - currentValue

      if (Math.abs(distance) > precision) {
        const pt = currentTime
        currentTime = performance.now()
        const dt = (currentTime - pt) / 1000

        const fSpring = distance * stiffness
        const fDamper = damping * currentVelocity

        currentVelocity += (dt * (fSpring - fDamper)) / mass
        currentValue += currentVelocity * dt
        raf = requestAnimationFrame(loop)
      } else {
        currentValue = targetValue
        cancelAnimationFrame(raf)
      }

      raf = 0

      setValue(currentValue)
      setVelocity(currentVelocity)
    }

    raf = requestAnimationFrame(loop)
  }

  return [value, set] as [number, React.Dispatch<React.SetStateAction<number>>]
}

export default useMotion
