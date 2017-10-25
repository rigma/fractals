const http = require('http')
const express = require('express')
const cors = require('cors')
const parser = require('body-parser')

const Jimp = require('jimp')
const mandelbrot = require('./fractals/mandelbrot')

const app = express()

app.use(cors())
app.use(parser.json())
app.use(parser.urlencoded({
  extended: false
}))

app.get('/mandelbrot/:width?/:height?', (req, res, next) => {
  const width = parseInt(req.params.width) || 1024
  const height = parseInt(req.params.height) || 1024
  const color = req.query.color != null
  const maxRecursion = parseInt(req.query.max) || 20

  const img = mandelbrot.build(width, height, color, maxRecursion)
  img.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
    if (err) return next(err)

    res.type('png').end(buffer)
  })
})

const server = http.createServer(app)
server.listen(process.env.PORT || 3000, console.log('Ready to serve fractals!'))
