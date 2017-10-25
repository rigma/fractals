/**
 * @file Complex number
 */

class Complex {
  constructor (re, im) {
    this.re = re
    this.im = im
  }

  static zero () {
    return new Complex(0, 0)
  }

  /**
   * Return the square of this complex
   * @return {Complex}
   */
  square () {
    return new Complex(this.re * this.re - this.im * this.im, 2 * this.re * this.im)
  }

  /**
   * Return the mod of the complex
   * @return {number}
   */
  mod () {
    return Math.sqrt(this.re * this.re + this.im * this.im)
  }

  /**
   * Return the square mod of this complex
   * @return {number}
   */
  sqrMod () {
    return this.re * this.re + this.im * this.im
  }

  /**
   * Return the sum of two complex
   * @param {Complex} the other complex to sum
   * @return {Complex}
   */
  sum (z) {
    return new Complex(this.re + z.re, this.im + z.im)
  }
}

module.exports = Complex
