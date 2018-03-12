// effectEngine( start$, stop$, reset$, frameEvent, effectEvent)
const Rx = require('rx')
const rXEngine = require('goatstone/rgb-agent/engine/rx-engine')

function effectEngine(patterns, startEffectEvent, stopEvent, resetEvent, effectEvent, frameEvent) {
    // TODO replace with calling event
    let scriptArray = patterns.emVehicle
    console.log('effectEngine')
    // const startEffectEvent = new EventEmitter()
    let start$ = Rx.Observable.fromEvent(startEffectEvent, 'data')
    // let stopEvent = new EventEmitter()
    const stop$ = Rx.Observable.fromEvent(stopEvent, 'data')
    // let resetEvent = new EventEmitter()
    const reset$ = Rx.Observable.fromEvent(resetEvent, 'data')

    // timer stream drive the frame push
    let timerEngineSubscription = rXEngine(start$, stop$, reset$, 1000)
    timerEngineSubscription.subscribe(i => {
        console.log('frame event', i)
        let data = scriptArray[(i % scriptArray.length)]
        // send frames through the MQTT client
        frameEvent.emit('frame', data)
    })
    effectEvent.on('set', name => {
        if (!patterns[name]) return false
        // is it turned on? turn it on
        if (name === 'off') {
            stopEvent.emit('data', 0)
            return
        }
        scriptArray = patterns[name]
        startEffectEvent.emit('data', 1)
    })

}

module.exports = effectEngine