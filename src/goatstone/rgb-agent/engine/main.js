import Rx from 'rx'
let EventEmitter = require('events').EventEmitter
import rXEngine from './rx-engine'
import moveEngine from './move-engine'

// engine start stop reset
// supply a list of objects sequentially, when done start again
var startEvent = new EventEmitter()
let start$ = Rx.Observable.fromEvent(startEvent, 'data')
let stopEvent = new EventEmitter()
const stop$ = Rx.Observable.fromEvent(stopEvent, 'data')
let resetEvent = new EventEmitter()
const reset$ = Rx.Observable.fromEvent(resetEvent, 'data')

let scriptArray = Array.from(new Array(10))
    .map((x, i) => ({[i] : 'aaa' + i }))

rXEngine(start$, stop$, reset$, scriptArray)
moveEngine(startEvent, stopEvent, resetEvent)
