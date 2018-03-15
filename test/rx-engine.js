const Rx = require('rx')
const chai = require('chai')
const expect = chai.expect

const EventEmitter = require('events').EventEmitter
const td = require('testdouble')

const patterns = require('goatstone/rgb-agent/patterns/patterns')
const rXEngine = require('goatstone/rgb-agent/engine/rx-engine')

const scriptArray = patterns.emVehicle

const startEvent = new EventEmitter()
const startEffectEvent = new EventEmitter()
const start$ = Rx.Observable.fromEvent(startEffectEvent, 'data')

const stopEvent = new EventEmitter()
const stop$ = Rx.Observable.fromEvent(stopEvent, 'data')

const resetEvent = new EventEmitter()
const reset$ = Rx.Observable.fromEvent(resetEvent, 'data')

let rXESub

describe('RX Engine', () => {

    beforeEach(() => {
        rXESub = rXEngine(start$, stop$, reset$, scriptArray, 1000)
    })

    it('should start and emit an object from array provided when started', () => {
        rXESub.subscribe(data => {
            stopEvent.emit('data', 1)
            expect(data).to.deep.equal(scriptArray[0])
            done()
        })
        startEffectEvent.emit('data', 1)
    })

    it('should reset to zero', done => {
        let count
        before(() => {
            count = 0
        })
        rXESub.subscribe(data => {
            // TODO confirm that this output increments, it is NOT 0
        })
        setTimeout(x => {
            stopEvent.emit('data', 1)
            rXESub.subscribe(data => {
                expect(data).to.equal(0)
            })
            resetEvent.emit('data', 1)
            done()
        }, 10)
        startEffectEvent.emit('data', 1)
    })

})
