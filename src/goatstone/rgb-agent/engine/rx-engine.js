const Rx = require('rx')

function rXEngine(start$, stop$, reset$, scriptArray, intervalStart){
    
    return Rx.Observable.merge(
        start$.flatMapLatest(() =>
                             Rx.Observable
                             .interval(intervalStart)
                             .takeUntil(stop$)
                            ).map((x) => {
                                // console.log(scriptArray[ (x % scriptArray.length) ])
                                return scriptArray[ (x % scriptArray.length) ]
                            }),
        reset$.map(() => 0)
    )
}
module.exports = rXEngine
