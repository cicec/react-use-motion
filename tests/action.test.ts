import { Action } from '../src/action'

const config = { tension: 170, friction: 26, mass: 1, precision: 0.01 }

describe('action', () => {
  const initialValue = { x: 0, y: 0, bg: 'rgba(0, 0, 0, 1)' }
  const targetValue = { x: 100, y: 100, bg: 'rgba(255, 255, 255, 1)' }

  const action = new Action(initialValue, initialValue, config)

  test('to values', () => {
    expect(action.toValues()).toStrictEqual(initialValue)
  })

  test('set to target values & move 1 frame', () => {
    action.setTo(targetValue)

    expect(action.move(16 / 1000)).toBeFalsy()
    expect(action.toValues()).toStrictEqual({
      x: 4.352,
      y: 4.352,
      bg: 'rgba(11.0976, 11.0976, 11.0976, 1)'
    })
  })

  test('reset', () => {
    action.reset()
    expect(action.toValues()).toStrictEqual(initialValue)
  })

  test('stop', () => {
    action.stop()
    expect(action.toValues()).toStrictEqual(targetValue)
  })

  test('move end', () => {
    expect(action.move(16 / 1000)).toBeTruthy()
  })
})
