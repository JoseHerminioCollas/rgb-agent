const expect = require('chai').expect
let EventEmitter = require('events').EventEmitter
var td = require('testdouble')
const mqttClient = require('../src/goatstone/rgb-agent/mqtt-client/client')

// mock the MQTT Client
const mQTTClientEE = new EventEmitter()
const mQTTClient = {
    connect: x => {
        mQTTClientEE.emit('connect', x)
    },
    on: (name, func) => { func() },
    publish: (e, pl) => {
        mQTTClientEE.emit(e, pl)
    },
    subscribe: () => 1
}

describe('MQTT Client Wrapper', () => {
    const colorEvent = new EventEmitter()
    const frameEvent = new EventEmitter()
    const effectEvent = new EventEmitter()
    let brokerTD
    let loggerTD
    let subscribeTD
    const colorData = { red: 0, green: 0, blue: 0 }
    describe('MQTT broker should react to a connect event', () => {
        beforeEach(() => {
            brokerTD = td.object()
            mQTTClient.connect()
            subscribeTD = td.replace(mQTTClient, 'subscribe')
            loggerTD = td.object()
            mqttClient(mQTTClient, colorEvent, frameEvent, effectEvent, loggerTD)
        })
        afterEach(() => {
            td.reset()
        })
        it('should', () => {
            expect(td.explain(subscribeTD).callCount).to.equal(1)
        })
    })

    describe('events should trigger broker to publish', () => {
        beforeEach(() => {
            brokerTD = td.object()
            loggerTD = td.object()
            mqttClient(brokerTD, colorEvent, frameEvent, effectEvent, loggerTD)
        })
        afterEach(() => {
            td.reset()
        })
        it(`should call the MQTT client when colorEvent 'color' is called`, () => {
            colorEvent.emit('color', colorData)
            expect(td.explain(brokerTD.publish).callCount).to.equal(3)
        })
        it(`should call the MQTT client when colorEvent 'red' is called`, () => {
            colorEvent.emit('red', 1)
            expect(td.explain(brokerTD.publish).callCount).to.equal(1)
        })
        it(`should call the MQTT client when colorEvent 'green' is called`, () => {
            colorEvent.emit('green', 1)
            expect(td.explain(brokerTD.publish).callCount).to.equal(1)
        })
        it(`should call the MQTT client when colorEvent 'blue' is called`, () => {
            colorEvent.emit('blue', 1)
            expect(td.explain(brokerTD.publish).callCount).to.equal(1)
        })
        it(`should call the MQTT client when frameEvent 'frame' is called`, () => {
            frameEvent.emit('frame', { red: 0, green: 0, blue: 0 })
            expect(td.explain(brokerTD.publish).callCount).to.equal(3)
        })
        it(`should call the MQTT client when effectEvent 'off' is called`, () => {
            effectEvent.emit('off', 0)
            expect(td.explain(brokerTD.publish).callCount).to.equal(1)
        })
    })

})