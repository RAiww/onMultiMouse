鼠群事件
=======


> 作者： RAiww <ra@iww.twbbs.org> (http://ra.iww.twbbs.org/)<br />
> 版本： v0.0.0<br />
> 授權： MIT @license: [ra.iww.twbbs.org/ffish/MIT_License](http://ra.iww.twbbs.org/ffish/MIT_License)



## 簡介


一次綁定多樣性的滑鼠（滑鼠 + 觸控）。



## 目錄


  * lib
    * [JzTree 補充包](lib/jzTree_additional.js)
    * [onMultiMouse.js](lib/onMultiMouse.js)
  * [README.md](README.md)



## 使用方法


```js
// onMultiMouse 監聽就緒
onMultiMouse();

// 新增
document.addEventListener( 'multimouse', function(){...}, false );
// 移除
document.removeEventListener( 'multimouse', function(){...}, false );
```


**注意：**
  - onMultiMouse 監聽事件是靠綁定 mousedown、mousemove、mouseup、touchstart、touchmove、touchend 等事件來達成。
  - 阻止預設事件必須在「移動狀態為 start」時就使用 ``` evt.preventDefault() ```，不然事後綁定的選取等等之事件將不會如預期執行。



## event 參數


evt：

  - detail
    - useType： 來源類型（mouse, touch）
    - state：移動狀態（start, move, end）
  - pageX： 全頁 X 軸座標
  - pageY： 全頁 Y 軸座標
  - clientX： 可視頁 X 軸座標
  - clientY： 可視頁 Y 軸座標
  - screenX： 螢幕 X 軸座標
  - screenY： 螢幕 Y 軸座標
  - radiusX
  - radiusY
  - rotationAngle
  - force： 壓力

