const expect = require('chai').expect
let EventEmitter = require('events').EventEmitter
var td = require('testdouble')
const mqttClient = require('goatstone/rgb-agent/mqtt-client/client')

describe('MQTT Client Wrapper', () => {

    const colorEvent = new EventEmitter()
    const frameEvent = new EventEmitter()
    const effectEvent = new EventEmitter()
    let brokerTD

    beforeEach(() => {
        brokerTD = td.object()
        mqttClient(brokerTD, colorEvent, frameEvent, effectEvent)
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
        frameEvent.emit('frame', {red: 0, green: 0, blue: 0})
        expect(td.explain(brokerTD.publish).callCount).to.equal(3)
    })

})