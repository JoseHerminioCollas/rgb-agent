const expect = require('chai').expect
const request = require('supertest')
const express = require('express')
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

const mqttClient = require('goatstone/rgb-agent/mqtt-client/client')

const index = require('goatstone/rgb-agent/routes/index')
app.use('/', index)
const rgb = require('goatstone/rgb-agent/routes/rgb')

describe('RGB API', function() {
  describe('end point for the rgb device', function() {
    const tdMqttClient = td.object(mqttClient)
    app.use('/rgb', rgb(tdMqttClient))
    it('should display a simple message when called', done => {
      request(app)
          .get('/')
          .expect(200, done)
    })
    it(`should post and call the 
      mqttClient.red method with a level value of 100`, done => {      
      const expectedLevel = 100
      const property = 'red'
      const URL = `/rgb/light/${property}/${expectedLevel}`
      request(app)
         .post(URL)
          .expect(200)
          .end(x => {
            const explain = td.explain(tdMqttClient.red)
            expect(explain.callCount).to.equal(1)
            expect(parseInt(explain.calls[0].args[0])).to.equal(expectedLevel)
            done()
          })
    })
    it(`should post and call the 
      mqttClient.green method with a level value of 200`, done =>{      
      const expectedLevel = 200
      const property = 'green'
      const URL = `/rgb/light/${property}/${expectedLevel}`
      request(app)
         .post(URL)
          .expect(200)
          .end(x => {
            const explain = td.explain(tdMqttClient.green)
            expect(explain.callCount).to.equal(1)
            expect(parseInt(explain.calls[0].args[0])).to.equal(expectedLevel)
            done()
          })
    })
  })
})
