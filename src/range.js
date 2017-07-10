export default function range(start, end, step = 1) {
  const length = end - start
  const iterator = Array(parseInt((length + step) / step, 10)).keys()

  return Array.from(iterator, (n) => start + (n * step))
}
