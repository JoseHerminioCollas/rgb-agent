const expect = require('chai').expect
const request = require('supertest')
const express = require('express')
let EventEmitter = require('events').EventEmitter

var path = require('path')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var td = require('testdouble')

const app = express()
app.get('/user', function(req, res) {
  res.status(200).json({ name: 'tobi' })
})
app.set('views', path.join(__dirname, '../src/goatstone/rgb-agent/views'))
app.set('view engine', 'jade')
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '../public')))

var startEvent = new EventEmitter()
const startEffectEvent = new EventEmitter()
let stopEvent = new EventEmitter()
let resetEvent = new EventEmitter()
const colorEvent = new EventEmitter()

const index = require('goatstone/rgb-agent/routes/index')
app.use('/', index)

const rgb = require('goatstone/rgb-agent/routes/rgb')
app.use('/rgb', rgb(startEffectEvent, stopEvent, resetEvent, colorEvent))

describe('RGB API', function() {
  describe('end point for the rgb device', function() {
    it('should display a simple message when called', done => {
      request(app)
          .get('/')
          .expect(200)
          .end(x => done())
    })
    it(`should post and call the 
      colorEvent event emitter with a level value of 100`, done => {      
      const expectedLevel = 100
      const property = 'red'
      const URL = `/rgb/light/${property}/${expectedLevel}`
      const spy = td.function()
      colorEvent.on('red', spy)
      request(app)
         .post(URL)
          .expect(200)
          .end(x => {
            const explain = td.explain(spy)
            expect(explain.callCount).to.equal(1)
            expect(parseInt(explain.calls[0].args[0])).to.equal(expectedLevel)
            done()
          })
    })
    it(`should post and call the 
      colorEvent event emitter with a level value of 200`, done => {      
      const expectedLevel = 100
      const property = 'green'
      const URL = `/rgb/light/${property}/${expectedLevel}`
      const spy = td.function()
      colorEvent.on('green', spy)
      request(app)
         .post(URL)
          .expect(200)
          .end(x => {
            const explain = td.explain(spy)
            expect(explain.callCount).to.equal(1)
            expect(parseInt(explain.calls[0].args[0])).to.equal(expectedLevel)
            done()
          })
    })
    it(`should post and call the 
      colorEvent event emitter with a level value of 10`, done => {      
      const expectedLevel = 100
      const property = 'blue'
      const URL = `/rgb/light/${property}/${expectedLevel}`
      const spy = td.function()
      colorEvent.on('blue', spy)
      request(app)
         .post(URL)
          .expect(200)
          .end(x => {
            const explain = td.explain(spy)
            expect(explain.callCount).to.equal(1)
            expect(parseInt(explain.calls[0].args[0])).to.equal(expectedLevel)
            done()
          })
    })
  })
})
