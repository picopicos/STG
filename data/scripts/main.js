/* ---------------------------------------------
    ロード完了と実行をまとめる
--------------------------------------------- */
(() => {
'use strict';

// 変数定義
window.Is_key_down = {};
const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 720;
const STAGE_WIDTH = 960;
const STAGE_HEIGHT = 720;
const SHOT_MAX_COUNT = 10;
let util = null;
let canvas = null;
let ctx = null;
let player = null;
let start_time_ms = null;
let now_time_s = null;
let shotArray = [];

window.addEventListener('load', () => {
    initialize();
    load();
}, false);

function initialize(){
    // utilityへの参照を省略
    util = new Canvas2DUtility(document.body.querySelector('#main-canvas'));
    canvas = util.canvas;
    ctx = util.context;

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    ctx.stage_width = STAGE_WIDTH;
    ctx.stage_height = STAGE_HEIGHT;
}

function load(){
    let ready = true;

    player = new Player(ctx, 0, 0, 64, 64);
    for(let i = 0; i < SHOT_MAX_COUNT; i++){
        shotArray[i] = new Shot(ctx, 0, 0, 32, 32);
        shotArray[i].setImage('./assets/img/shot.png');
    }
    player.setShotArray(shotArray);

    // 画像をまとめて参照
    player.setImage('./assets/img/player.png');

    // 読み込みが必要なものをここに置く
    // 例) ready === ready && XXX.ready
    ready === ready && player.ready;
    shotArray.map((v) => {
        ready === ready && v.ready;
    });

    if(ready === true){
        eventSetting();
        start_time_ms = Date.now();
        render();
    } else {
        setTimeout(load, 100);
    }
}

function eventSetting(){
    window.addEventListener('keydown', (event) => {
        Is_key_down[`key_${event.key}`] = true;
    }, false);
    window.addEventListener('keyup', (event) => {
        Is_key_down[`key_${event.key}`] = false;
    }, false);
}

function render(){
    util.drawRect(0, 0, canvas.width, canvas.height, '#eeeeee');
    let now_time_s = (Date.now() - start_time_ms) / 1000;

    player.update();

    shotArray.map((v) => {
        v.update();
    });

    requestAnimationFrame(render);
}

})();
