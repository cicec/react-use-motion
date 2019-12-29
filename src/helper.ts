export const is = {
  num: (v: unknown) => typeof v === 'number',
  arr: (v: unknown) => Array.isArray(v),
  obj: (v: unknown) => Object.prototype.toString.call(v) === '[object Object]'
}
