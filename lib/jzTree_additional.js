"use strict";

window.jz = {
    wCode: {
        evtBind: function( HElem, jMethod, jEvtList ){
            if( jMethod !== 'add' && jMethod !== 'remove' ) return;
            else jMethod = jMethod + 'EventListener';

            for(var jName in jEvtList )
                HElem[ jMethod ]( jName, jEvtList[ jName ], false );
        },
        evtStopDefault: function( evt ){
            evt.preventDefault();
        },
    },
};
