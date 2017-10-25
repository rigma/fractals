const Jimp = require('jimp')
const Complex = require('../utils/complex')

/**
 * Translate HUE to RGB system
 * @param {number} p
 * @param {number} q
 * @param {number} t
 * @return {number}
 */
function hue2rgb (p, q, t) {
  if (t < 0) ++t
  if (t > 1) --t

  if (t < 1 / 6) return p + 6 * t * (q - p)
  if (t < 1 / 2) return q
  if (t < 2 / 3) return p + 6 * (2 / 3 - t) * (q - p)

  return p
}

/**
 * Return a normalized complex through pixel coordinates
 * @param {number} x: the x coordinate
 * @param {number} y: the y coordinate
 * @param {any} size: the dimension of the image
 */
function coordToComplex (x, y, size) {
  return new Complex((2 / size.width) * x - 1, (2 / size.height) * y - 1)
}

/**
 * Translate a convergence speed into grayscale
 * @param {number} n: the speed to translate
 * @param {number} maxRecursion: the maximum recursion
 */
function speedToGrayscale (n, maxRecursion = 20) {
  return (-255 / maxRecursion) * n + 255
}

function speedToRgb (n, maxRecursion = 50) {
  n = Math.min(n / maxRecursion, 1)
  let s = 1
  let l = 0.06
  let r
  let g
  let b

  if (s === 0) {
    r = g = b = l
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q

    r = hue2rgb(p, q, n + 1 / 3)
    g = hue2rgb(p, q, n)
    b = hue2rgb(p, q, n - 1 / 3)
  }

  return Jimp.rgbaToInt(Math.round(255 * r), Math.round(255 * g), Math.round(255 * b), 255)
}

/**
 * Returns the divergence speed of your complex
 * @param {Complex} c: the complex to test through Mandelbrot criteria
 * @param {number} maxRecursion: the maximum recursion supported
 * @return {number}
 */
function getMandelbrotDivergenceSpeed (c, maxRecursion = 20) {
  let z = Complex.zero()
  let n = 0

  while (n < maxRecursion) {
    z = z.square().sum(c)

    if (z.sqrMod() > 4) {
      return n
    }

    ++n
  }

  return n
}

/**
 * Build a grayscale Mandelbrot fractal
 * @param {Object} size: the dimension of the ouput image
 * @param {string} name: the name of the image to save
 * @param {number} maxRecursion: the maximum recursion to achieve with the fractal
 * @return {Jimp}
 */
function buildGrayscaleMandelbrot (size, maxRecursion = 20) {
  const image = new Jimp(size.width, size.height)

  for (let j = 0; j < size.height; ++j) {
    for (let i = 0; i < size.width; ++i) {
      const c = coordToComplex(i, j, size)
      const n = getMandelbrotDivergenceSpeed(c, maxRecursion)
      const grayscale = speedToGrayscale(n, maxRecursion)

      image.setPixelColor(Jimp.rgbaToInt(grayscale, grayscale, grayscale, 255), i, j)
    }
  }

  return image
}

/**
 * Build a color Mandelbrot fractal
 * @param {Object} size: the dimension of the image to generate
 * @param {number} maxRecursion: the maximum number of iteration for Mandelbot criteria
 * @return {Jimp}
 */
function buildColorMandelbrot (size, maxRecursion = 20) {
  const image = new Jimp(size.width, size.height)

  for (let j = 0; j < size.height; ++j) {
    for (let i = 0; i < size.width; ++i) {
      const c = coordToComplex(i, j, size)
      const n = getMandelbrotDivergenceSpeed(c, maxRecursion)
      const color = speedToRgb(n)

      image.setPixelColor(color, i, j)
    }
  }

  return image
}

module.exports = {
  build (width, height, color = false, maxRecursion = 20) {
    return color ? buildColorMandelbrot({ width, height }, maxRecursion) : buildGrayscaleMandelbrot({ width, height }, maxRecursion)
  }
}
