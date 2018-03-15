const expect = require('chai').expect
const request = require('supertest')
const express = require('express')
let EventEmitter = require('events').EventEmitter

var path = require('path')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var td = require('testdouble')

const rgbLightColor = require('goatstone/rgb-agent/routes/rgb-light-color')
const rgbLightEffect = require('goatstone/rgb-agent/routes/rgb-light-effect')
const index = require('goatstone/rgb-agent/routes/index')

const app = express()
app.get('/user', function (req, res) {
  res.status(200).json({ name: 'tobi' })
})
app.set('views', path.join(__dirname, '../src/goatstone/rgb-agent/views'))
app.set('view engine', 'jade')
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '../public')))

const startEvent = new EventEmitter()
const startEffectEvent = new EventEmitter()
const stopEvent = new EventEmitter()
const resetEvent = new EventEmitter()
const colorEvent = new EventEmitter()
const effectEvent = new EventEmitter()

app.use('/', index)
app.use('/rgb/light/color', rgbLightColor(colorEvent))
app.use('/rgb/light/effect', rgbLightEffect(effectEvent))

describe('RGB API', function () {
  describe('end point for the rgb device', function () {
    it('should display a simple message when called', done => {
      request(app)
        .get('/')
        .expect(200)
        .end(x => done())
    })
    it(`should post and call the colorEvent event emitter`, done => {
        const URL = `/rgb/light/color/1/2/2/`
        const spy = td.function()
        colorEvent.on('color', spy)
        request(app)
          .post(URL)
          .expect(200)
          .end(x => {
            const explain = td.explain(spy)
            expect(explain.callCount).to.equal(1)
            done()
          })
      })
    it(`should post and call the effectEvent event emitter`, done => {
        const URL = `/rgb/light/effect/glow/`
        const spy = td.function()
        effectEvent.on('set', spy)
        request(app)
          .post(URL)
          .expect(200)
          .end(x => {
            const explain = td.explain(spy)
            expect(explain.callCount).to.equal(1)
            done()
          })
      })
  })
})
