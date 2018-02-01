const expect = require('chai').expect
const patterns = require('goatstone/rgb-agent/patterns/patterns')
const EventEmitter = require('events').EventEmitter
const Rx = require('rx')
const rXEngine = require('goatstone/rgb-agent/engine/rx-engine')
var td = require('testdouble')

    const scriptArray = patterns.emVehicle

var startEvent = new EventEmitter()
const startEffectEvent = new EventEmitter()
let start$ = Rx.Observable.fromEvent(startEffectEvent, 'data')
let stopEvent = new EventEmitter()
const stop$ = Rx.Observable.fromEvent(stopEvent, 'data')
let resetEvent = new EventEmitter()
const reset$ = Rx.Observable.fromEvent(resetEvent, 'data')
let rXESub

describe('RX Engine', () => {

    beforeEach(() => {
        rXESub = rXEngine(start$, stop$, reset$, scriptArray, 1000)
    })
 
    it('should start and emit an object from array provided when started', ( ) => {
        rXESub.subscribe(data => {
            stopEvent.emit('data', 1)
            expect(data).to.deep.equal(scriptArray[0])
            done()
        })
        startEffectEvent.emit('data'), 1
    })
})