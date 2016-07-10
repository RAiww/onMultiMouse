/* 鼠群事件 onMultiMouse v0.0.0 */
/*! onMultiMouse - RAiww. MIT @license: ra.iww.twbbs.org/ffish/MIT_License. */

"use strict";

    function onMultiMouse(){
        if(! 'jz' in window ) return;
        if( window.onmultimouse !== true ){
            ion_bindListener();
            window.onmultimouse = document.onmultimouse = true;
        }
        onMultiMouse = Function();


//>> 綁定監聽 -----

        function ion_bindListener(){
            let jEvtList,
                jMouseFloatEvtList;

            jEvtList = {
                mousedown: function( evt ){
                    if( evt.button !== 0 || ion_indexID.mouse ) return;

                    ion_multiMouseEvt( 'mouse', 'start', evt );
                    jz.wCode.evtBind( window, 'add', jMouseFloatEvtList, true );
                },
            };

            jMouseFloatEvtList = {
                mousemove: function( evt ){
                    ion_multiMouseEvt( 'mouse', 'move', evt );
                },
                mouseup: function( evt ){
                    if( evt.button !== 0 ) return;

                    jz.wCode.evtBind( window, 'remove', jMouseFloatEvtList, true );
                    ion_multiMouseEvt( 'mouse', 'end', evt );
                },
            };

            if( 'ontouchmove' in window ){
                jEvtList.touchstart = function( evt ){
                    ion_multiMouseEvt( 'touch', 'start', evt );
                };
                jEvtList.touchmove = function( evt ){
                    ion_multiMouseEvt( 'touch', 'move', evt );
                };
                jEvtList.touchend = function( evt ){
                    ion_multiMouseEvt( 'touch', 'end', evt );
                };
            }

            jz.wCode.evtBind( window, 'add', jEvtList, true );

            jEvtList = null;
        }


//>> -----

            /* ion_indexID 說明
                ion_indexID = {
                    mouse: evt.target_m,
                    1: evt.target_1,
                    2: evt.target_2,
                }
            -*/
        let ion_indexID = {},
            ArrEvtProp = [
                'pageX', 'pageY', 'clientX', 'clientY', 'screenX', 'screenY',
                'radiusX', 'radiusY', 'rotationAngle', 'force',
            ];

        function ion_multiMouseEvt( jUseType, jState, evt ){
            let jListenerList = ion_evtHandle( jUseType, jState, evt );
            for(let p = 0, jItem; jItem = jListenerList[ p++ ] ; ){
                if( !jItem.target.dispatchEvent( jItem.evt ) || jState === 'end' ){
                    let isPrevent = ( jState !== 'end' )? true : false;
                    ion_evtDefault.bind( isPrevent, jItem.id, evt );
                }
            }
        }

        function ion_evtHandle( jUseType, jState, evt ){
            let jDispatchList = [],
                jEvtInfList = ion_getEvtInfList( jUseType, jState, evt );

            for(let p = 0, jItem; jItem = jEvtInfList[ p++ ] ; )
                jDispatchList.push( ion_getDispatchInf( jItem ) );

            return jDispatchList;
        }

        let ion_evtDefault = {
                bind: function( isPrevent, jID, evt ){
                    let jPreventList = this.preventList,
                        jBindEvtList = this.bindEvtList;

                    if( isPrevent ){
                        evt.preventDefault();
                        if( jPreventList.length === 0 ) jz.wCode.evtBind( window, 'add', jBindEvtList, false );
                        if( jPreventList.indexOf( jID ) === -1 ) jPreventList.push( jID );
                    }else{
                        let jIndex_prevent = jPreventList.indexOf( jID );
                        if( jIndex_prevent !== -1 ){
                            jPreventList.splice( jIndex_prevent, 1 );
                            if( jPreventList.length === 0 ) jz.wCode.evtBind( window, 'remove', jBindEvtList, false );
                        }
                    }
                },
                preventList: [],
                bindEvtList: {
                    //選取
                    selectstart: jz.wCode.evtStopDefault,
                    //右鍵選單
                    contextmenu: jz.wCode.evtStopDefault,
                    //拖拉
                    dragstart: jz.wCode.evtStopDefault,
                },
            };

        function ion_getEvtInfList( jUseType, jState, evt ){
            let isTouch = jUseType === 'touch',
                jEvtInfList = [],
                jEvtList, jIndex, jTarget,
                jAnnex = {
                    useType: jUseType,
                    state: jState,
                };

            if( isTouch ){
                jEvtList = evt.changedTouches;
                ion_setAnnexTouchInf( jAnnex, evt );
            }else
                jEvtList = [ evt ];

            for(let p = 0, jItem_evt; jItem_evt = jEvtList[ p++ ] ; ){
                if( isTouch )
                    jIndex = jAnnex.id = jItem_evt.identifier;
                else
                    jIndex = 'mouse';

                jTarget = ion_readIndex( jState, jIndex, jItem_evt );
                if( !jTarget ) continue;

                jEvtInfList.push({ target: jTarget, evt: jItem_evt, annex: jAnnex });
            }

            return jEvtInfList;
        }

        function ion_setAnnexTouchInf( jAnnex, evt ){
            jAnnex.touchIDList = [];
            for(let p = 0, jTouches = evt.touches, jItem; jItem = jTouches[ p++ ] ; )
                jAnnex.touchIDList.push( jTouches.identifier );
        }

        function ion_readIndex( jState, jIndex, jItem_evt ){
            let jTarget;
            switch( jState ){
                case 'start':
                    if( ion_checkDoubleInIndex( jItem_evt.target ) ) jTarget = null;
                    else jTarget = ion_indexID[ jIndex ] = jItem_evt.target;
                    break;
                case 'move':
                    if( !ion_indexID[ jIndex ] ) jTarget = null;
                    else jTarget = ion_indexID[ jIndex ];
                    break;
                case 'end':
                    if( !ion_indexID[ jIndex ] ) jTarget = null;
                    else{
                        jTarget = ion_indexID[ jIndex ];
                        delete ion_indexID[ jIndex ];
                    }
                    break;
            }

            return jTarget;
        }

        //檢查是否有相同的觸發點
        function ion_checkDoubleInIndex( jTarget ){
            for(let jName in ion_indexID )
                if( jTarget === ion_indexID[ jName ] ) return true;

            return false;
        }

        function ion_getDispatchInf( jEvtInf ){
            let jNewEvt = new CustomEvent( 'multimouse', {
                    bubbles: true,
                    cancelable: true,
                    detail: ion_getDetail( jEvtInf ),
                } );

            for(let p = 0, jItem; jItem = ArrEvtProp[ p++ ] ; )
                jNewEvt[ jItem ] = jEvtInf.evt[ jItem ] || null;

            jEvtInf.evt = jNewEvt;
            return jEvtInf;
        }

        function ion_getDetail( jEvtInf ){
            let jAnnex = jEvtInf.annex,
                jDetail = {
                    useType: jAnnex.useType,
                    state: jAnnex.state,
                };

            switch( jAnnex.useType ){
                case 'mouse': break;
                case 'touch':
                    jDetail.id = jAnnex.id;
                    jDetail.touchIDList = jAnnex.touchIDList;
                    break;
            }

            return jDetail;
        }
    }
