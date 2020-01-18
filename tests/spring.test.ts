import { Spring } from '../src/spring'

const config = { tension: 170, friction: 26, mass: 1, precision: 0.01 }

describe('spring', () => {
  const spring = new Spring([0], config)

  test('set to target values & move 1 frame', () => {
    spring.setTo([100])
    spring.move(16 / 1000)

    expect(spring.positions).toStrictEqual([4.352])
  })

  test('reset', () => {
    spring.reset()

    expect(spring.positions).toStrictEqual([0])
  })

  test('stop', () => {
    spring.stop()

    expect(spring.positions).toStrictEqual([100])
  })
})
